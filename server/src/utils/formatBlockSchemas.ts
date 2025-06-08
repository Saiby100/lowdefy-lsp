import { CompletionItemKind } from 'vscode-languageserver';

import fs from 'fs';
import path from 'path';

function buildDescription({
  type: dataType,
  description,
  enum: enumValues,
  default: defaultValue,
}: Record<string, any>): string {
  const valueType = typeof dataType === 'string' ? dataType : dataType?.join(' | ') || '';
  let desc = `${description || ''}\n**${valueType}**`;

  if (enumValues) desc += `\n**Enum**: \`${enumValues.join('`, `')}\``;
  if (defaultValue) desc += `\n**Default**: \`${JSON.stringify(defaultValue)}\``;

  return desc.trim();
}

function addCompletion(key: string, suggestions: Record<string, any>, data: Record<string, any>) {
  if (!suggestions) throw new Error('Suggestions object is undefined');
  if (!suggestions.completions) suggestions.completions = [];
  suggestions.completions.push({
    label: key,
    kind: CompletionItemKind.Keyword,
    insertText: key,
    documentation: {
      kind: 'markdown',
      value: buildDescription(data),
    },
  });
}

function processObject(suggestions: Record<string, any>, data: Record<string, any>) {
  if (!data) return;
  const { additionalProperties, properties } = data;
  if (additionalProperties !== false || !properties) return;

  Object.entries(properties as Record<string, any>).forEach(([key, value]) => {
    suggestions[key] = { _type: data.type };
    processProperty(key, suggestions[key], value);
  });
}

function processProperty(key: string, suggestions: Record<string, any>, data: Record<string, any>) {
  const { oneOf, properties, type } = data;
  if (!type && !oneOf) return;
  if (type === 'object') {
    processObject(suggestions, properties);
  } else if (Array.isArray(oneOf)) {
    suggestions._type = 'oneOf';
    oneOf.forEach((property) => {
      processProperty(key, suggestions, property);
    });
  }

  addCompletion(key, suggestions, data);
}

function transformBlockSchema(suggestions: Record<string, any>, data: Record<string, any>) {
  if (!data.properties && !data.events) {
    console.error('Schema is missing properties and events:', data);
    return;
  }

  if (data.properties) {
    suggestions.properties = { _type: 'object' };
    addCompletion('properties', suggestions, {
      type: 'object',
      description: 'Object containing properties of the block.',
    });
    processObject(suggestions.properties, data.properties);
  }

  if (data.events) {
    suggestions.events = { type: 'object' };
    addCompletion('events', suggestions, {
      type: 'object',
      description: 'Object containing events of the block.',
    });
    processObject(suggestions.events, data.events);
  }
}

function formatBlockSchemas(): Record<string, any> {
  const BASE_DIR = path.join(__dirname, '../resources/schemas/blocks');
  const schema: Record<string, any> = {};

  const blockSchema = fs.readdirSync(BASE_DIR);
  for (const file of blockSchema) {
    const filePath = path.join(BASE_DIR, file);
    const blockType = path.basename(file, '.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    const suggestions = {};

    try {
      transformBlockSchema(suggestions, parsed);
      schema[blockType] = suggestions;
    } catch (error) {
      console.error(`Error transforming schema for ${blockType}:`);
    }
  }

  return schema;
}

export default formatBlockSchemas;
