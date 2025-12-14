import { CompletionItemKind } from 'vscode-languageserver';

import fs from 'fs';
import path from 'path';

interface SchemaProperty {
  type?: string | string[];
  description?: string;
  enum?: string[];
  default?: unknown;
  oneOf?: SchemaProperty[];
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
  docs?: { displayType?: string };
}

interface Suggestions {
  _type?: string;
  completions?: Array<{
    label: string;
    kind: CompletionItemKind;
    insertText: string;
    documentation: { kind: string; value: string };
  }>;
  [key: string]: unknown;
}

function formatType(type: string | string[] | undefined): string {
  if (!type) return '';
  return Array.isArray(type) ? type.join(' | ') : type;
}

function buildDescription(data: SchemaProperty): string {
  const parts: string[] = [];

  if (data.description) {
    parts.push(data.description);
  }

  const typeStr = formatType(data.type);
  if (typeStr) {
    parts.push(`**Type:** ${typeStr}`);
  }

  if (data.enum && data.enum.length > 0) {
    parts.push(`**Enum:** ${data.enum.join(', ')}`);
  }

  if (data.default !== undefined) {
    parts.push(`**Default:** ${JSON.stringify(data.default)}`);
  }

  return parts.join('\n\n');
}

function buildOneOfDescription(data: SchemaProperty): string {
  const parts: string[] = [];

  if (data.description) {
    parts.push(data.description);
  } else if (data.oneOf) {
    // Try to get description from first oneOf variant that has one
    const desc = data.oneOf.find((variant) => variant.description)?.description;
    if (desc) parts.push(desc);
  }

  if (data.oneOf) {
    const types = data.oneOf
      .map((variant) => formatType(variant.type))
      .filter(Boolean)
      .join(' | ');
    if (types) {
      parts.push(`**Type:** ${types}`);
    }
  }

  if (data.default !== undefined) {
    parts.push(`**Default:** ${JSON.stringify(data.default)}`);
  }

  return parts.join('\n\n');
}

function addCompletion(
  key: string,
  suggestions: Suggestions,
  description: string
): void {
  if (!suggestions.completions) {
    suggestions.completions = [];
  }
  suggestions.completions.push({
    label: key,
    kind: CompletionItemKind.Keyword,
    insertText: key,
    documentation: {
      kind: 'markdown',
      value: description,
    },
  });
}

function processProperty(
  key: string,
  suggestions: Suggestions,
  data: SchemaProperty
): void {
  const { oneOf, properties, type, items } = data;

  if (oneOf) {
    // Handle oneOf - check if any variant has nested object properties
    suggestions._type = 'oneOf';
    for (const variant of oneOf) {
      if (variant.type === 'array' && variant.items?.properties) {
        // Array of objects - process the object properties
        processObjectProperties(suggestions, variant.items);
      } else if (variant.type === 'object' && variant.properties) {
        processObjectProperties(suggestions, variant);
      }
    }
  } else if (type === 'object' && properties) {
    // Nested object with properties - recurse into it
    suggestions._type = 'object';
    processObjectProperties(suggestions, data);
  } else if (type === 'array' && items) {
    suggestions._type = 'array';
    if (items.properties) {
      // Array of objects - process the object properties
      processObjectProperties(suggestions, items);
    }
  } else if (type) {
    suggestions._type = Array.isArray(type) ? type.join('|') : type;
  }
}

function processObjectProperties(
  suggestions: Suggestions,
  data: SchemaProperty
): void {
  if (!data.properties) return;

  for (const [key, value] of Object.entries(data.properties)) {
    const childSuggestions: Suggestions = {};
    suggestions[key] = childSuggestions;
    processProperty(key, childSuggestions, value);

    // Build description based on whether it's a oneOf or regular property
    const description = value.oneOf
      ? buildOneOfDescription(value)
      : buildDescription(value);
    addCompletion(key, suggestions, description);
  }
}

function transformBlockSchema(
  suggestions: Suggestions,
  data: { properties?: SchemaProperty; events?: SchemaProperty }
): void {
  if (!data.properties && !data.events) {
    console.error('Schema is missing properties and events');
    return;
  }

  if (data.properties) {
    const propertiesSuggestions: Suggestions = { _type: 'object' };
    suggestions.properties = propertiesSuggestions;
    addCompletion(
      'properties',
      suggestions,
      'Object containing properties of the block.\n\n**Type:** object'
    );
    processObjectProperties(propertiesSuggestions, data.properties);
  }

  if (data.events) {
    const eventsSuggestions: Suggestions = { _type: 'object' };
    suggestions.events = eventsSuggestions;
    addCompletion(
      'events',
      suggestions,
      'Object containing events of the block.\n\n**Type:** object'
    );
    processObjectProperties(eventsSuggestions, data.events);
  }
}

function formatBlockSchemas(): Record<string, any> {
  const BASE_DIR = path.join(__dirname, '../../../resources/schemas/blocks');
  const schema: Record<string, any> = {};

  const blockSchema = fs.readdirSync(BASE_DIR);
  blockSchema.forEach((file) => {
    const filePath = path.join(BASE_DIR, file);
    const blockType = path.basename(file, '.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    const suggestions = {};

    try {
      transformBlockSchema(suggestions, parsed);
      schema[blockType] = suggestions;
    } catch (error) {
      console.error(`Error transforming schema for ${blockType}:`, error);
    }
  });

  return schema;
}

export default formatBlockSchemas;
