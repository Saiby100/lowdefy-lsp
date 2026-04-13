import fs from 'fs';
import path from 'path';

import { SchemaProperty, Suggestions } from './blockSchemas/types';
import { addCompletion, processObjectProperties } from './blockSchemas/processProperty';

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
