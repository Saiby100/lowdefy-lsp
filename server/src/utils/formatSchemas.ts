import { CompletionItemKind } from 'vscode-languageserver';

import fs from 'fs';
import path from 'path';

// import { Suggestions } from '../types/suggestions';
// import getSuggestionsObject from './getSuggestionsObject';

function buildDescription(value: Record<string, any>): string {
  const valueType = typeof value.type === 'string' ? value.type : value.type?.join(' | ') || '';
  let description = `${value.description || ''}\n**${valueType}**`;

  if (value.enum) description += `\n**Enum**: \`${value.enum.join('`, `')}\``;
  if (value.default) description += `\n**Default**: \`${JSON.stringify(value.default)}\``;

  return description.trim();
}

function processObject(
  suggestions: Record<string, any>,
  { additionalProperties, properties }: Record<string, any>
) {
  if (additionalProperties !== false || !properties) return;

  Object.entries(properties as Record<string, any>).forEach(([key, value]) => {
    if (value.type === 'object') {
      suggestions[key] = { type: 'object' };
      processObject(suggestions[key], value.properties);
    }
    if (value.type === 'array') {
      suggestions[key] = { type: 'array' };
      processObject(suggestions, value.items);
    }
    if (value.oneOf && typeof Array.isArray(value.oneOf)) {
      suggestions[key] = { type: 'oneOf' };
      for (const item of value.oneOf) {
      }
    }
  });
}

function processProperty(
  suggestions: Record<string, any>,
  { type, oneOf, properties }: Record<string, any>
) {
  if (!type && !oneOf) return;
  if (type === 'object') {
    processObject(suggestions, properties);
  } else if (Array.isArray(oneOf)) {
    oneOf.forEach((propertyType) => {});
  }
}

function transformSchema(suggestions: Record<string, any>, data: Record<string, any>) {
  if (!data.properties && !data.events) {
    console.error('Schema is missing properties and events:', data);
    return {};
  }

  if (data.properties) {
    suggestions.properties = { type: 'object' };
    processObject(suggestions.properties, data.properties);
  }

  if (data.events) {
    suggestions.events = { type: 'object' };
    processObject(suggestions.events, data.events);
  }
}

function formatSchemas(): Record<string, any> {
  const BASE_DIR = path.join(__dirname, '../resources/schemas');
  const directories = fs.readdirSync(BASE_DIR);
  const schema: Record<string, any> = {};

  for (const dir of directories) {
    const jsonFiles = fs.readdirSync(path.join(__dirname, `../resources/schemas/${dir}`));
    const directory = path.join(BASE_DIR, dir);
    for (const file of jsonFiles) {
      console.log('Processing file:', file);
      const filePath = path.join(directory, file);
      const blockType = path.basename(file, '.json');
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      const suggestions: Record<string, any> = {};

      transformSchema(suggestions, parsed);
      schema[blockType] = suggestions;
      return schema; // TODO: Remove
    }
  }
  // directories.forEach((dir: string) => {
  //   const jsonFiles = fs.readdirSync(path.join(__dirname, `../resources/schemas/${dir}`));
  //   const directory = path.join(BASE_DIR, dir);
  //   jsonFiles.forEach((file: string) => {
  //     const filePath = path.join(directory, file);
  //     const blockType = path.basename(file, '.json');
  //     const content = fs.readFileSync(filePath, 'utf-8');
  //     const parsed = JSON.parse(content);

  //     processProperty([], suggestions, parsed);
  //     schema[blockType] = suggestions;
  //   });
  // });

  return schema;
}

export default formatSchemas;
