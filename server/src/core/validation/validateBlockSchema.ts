import { Document, isMap, isSeq, isPair, isScalar, Node, Pair, YAMLMap } from 'yaml';
import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';
import getSchema from './getSchema';

interface SchemaProperty {
  type?: string | string[];
  enum?: any[];
  properties?: Record<string, SchemaProperty>;
  additionalProperties?: boolean;
  description?: string;
}

interface BlockSchema {
  type?: string;
  properties?: SchemaProperty;
  events?: SchemaProperty;
  additionalProperties?: boolean;
}

function isOperatorValue(value: any): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const keys = Object.keys(value);
  return keys.length === 1 && keys[0].startsWith('_');
}

function isOperatorNode(node: Node | null): boolean {
  if (!node || !isMap(node)) return false;
  if (node.items.length !== 1) return false;
  const key = node.items[0]?.key;
  if (!isScalar(key)) return false;
  return typeof key.value === 'string' && key.value.startsWith('_');
}

function offsetToPosition(text: string, offset: number): { line: number; character: number } {
  const lines = text.slice(0, offset).split('\n');
  return {
    line: lines.length - 1,
    character: lines[lines.length - 1].length,
  };
}

function nodeToRange(text: string, node: Node | Pair): Range {
  let range: [number, number, number] | null | undefined;
  if (isPair(node)) {
    const key = node.key as Node | null;
    range = key?.range;
  } else {
    range = node.range;
  }
  if (!range) {
    return { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } };
  }
  return {
    start: offsetToPosition(text, range[0]),
    end: offsetToPosition(text, range[1]),
  };
}

function validateType(
  value: any,
  expectedType: string | string[],
  valueNode: Node,
  text: string,
  propertyName: string
): Diagnostic | null {
  if (isOperatorNode(valueNode)) {
    return null;
  }

  const types = Array.isArray(expectedType) ? expectedType : [expectedType];
  const actualType = Array.isArray(value) ? 'array' : typeof value;

  const isValid = types.some((type) => {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number';
      case 'integer':
        return typeof value === 'number' && Number.isInteger(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      case 'null':
        return value === null;
      default:
        return true;
    }
  });

  if (!isValid) {
    const expectedStr = types.join(' | ');
    return {
      severity: DiagnosticSeverity.Error,
      range: nodeToRange(text, valueNode),
      message: `Property "${propertyName}" expects type "${expectedStr}", but got "${actualType}".`,
      source: 'lowdefy',
    };
  }

  return null;
}

function validateProperties(
  propertiesNode: YAMLMap | null,
  schemaProperties: SchemaProperty,
  text: string,
  document: Document.Parsed,
  path: string
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  if (!propertiesNode || !isMap(propertiesNode)) {
    return diagnostics;
  }

  const schemaProps = schemaProperties.properties || {};
  const additionalPropertiesAllowed = schemaProperties.additionalProperties !== false;

  for (const item of propertiesNode.items) {
    if (!isPair(item)) continue;

    const keyNode = item.key;
    const valueNode = item.value as Node;

    if (!isScalar(keyNode)) continue;

    const key = String(keyNode.value);

    if (!additionalPropertiesAllowed && !(key in schemaProps)) {
      diagnostics.push({
        severity: DiagnosticSeverity.Warning,
        range: nodeToRange(text, keyNode),
        message: `Unknown property "${key}" in ${path}.`,
        source: 'lowdefy',
      });
      continue;
    }

    const propSchema = schemaProps[key];
    if (!propSchema) continue;

    const jsValue = valueNode?.toJS?.(document);

    if (propSchema.type && valueNode) {
      const typeError = validateType(jsValue, propSchema.type, valueNode, text, key);
      if (typeError) {
        diagnostics.push(typeError);
        continue;
      }
    }

    if (propSchema.enum && !isOperatorNode(valueNode)) {
      if (!propSchema.enum.includes(jsValue)) {
        diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: nodeToRange(text, valueNode),
          message: `Property "${key}" must be one of: ${propSchema.enum.map((v) => `"${v}"`).join(', ')}.`,
          source: 'lowdefy',
        });
      }
    }

    if (propSchema.properties && propSchema.additionalProperties === false && isMap(valueNode)) {
      const nestedDiagnostics = validateProperties(
        valueNode,
        propSchema,
        text,
        document,
        `${path}.${key}`
      );
      diagnostics.push(...nestedDiagnostics);
    }
  }

  return diagnostics;
}

function findBlockNodes(
  node: Node,
  document: Document.Parsed,
  blocks: { node: YAMLMap; type: string }[]
): void {
  if (isMap(node)) {
    let hasId = false;
    let blockType: string | null = null;

    for (const item of node.items) {
      const key = isScalar(item.key) ? item.key.value : null;
      const value = isScalar(item.value) ? item.value.value : null;

      if (key === 'id' && typeof value === 'string') {
        hasId = true;
      }
      if (key === 'type' && typeof value === 'string') {
        blockType = value;
      }
    }

    if (hasId && blockType) {
      blocks.push({ node, type: blockType });
    }

    for (const item of node.items) {
      if (item.value) {
        findBlockNodes(item.value as Node, document, blocks);
      }
    }
  } else if (isSeq(node)) {
    for (const item of node.items) {
      findBlockNodes(item as Node, document, blocks);
    }
  }
}

function validateBlockSchema(
  document: Document.Parsed,
  text: string
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const root = document.contents;

  if (!root) return diagnostics;

  const blocks: { node: YAMLMap; type: string }[] = [];
  findBlockNodes(root, document, blocks);

  for (const { node, type } of blocks) {
    const schema = getSchema(type) as BlockSchema | undefined;
    if (!schema) continue;

    for (const item of node.items) {
      if (!isPair(item) || !isScalar(item.key)) continue;

      const key = String(item.key.value);
      const valueNode = item.value as Node;

      if (key === 'properties' && schema.properties && isMap(valueNode)) {
        const propDiagnostics = validateProperties(
          valueNode,
          schema.properties,
          text,
          document,
          `${type}.properties`
        );
        diagnostics.push(...propDiagnostics);
      }

      if (key === 'events' && schema.events && isMap(valueNode)) {
        const eventDiagnostics = validateProperties(
          valueNode,
          schema.events,
          text,
          document,
          `${type}.events`
        );
        diagnostics.push(...eventDiagnostics);
      }
    }
  }

  return diagnostics;
}

export default validateBlockSchema;
