import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import fs from 'fs';
import path from 'path';

import { Suggestions } from '../types/suggestions';

function addCompletion(keys: string[], value: Record<string, any>, suggestions: Suggestions) {
  let current: Suggestions = suggestions;
  if (!current[keys[0]]) current = suggestions[keys[0]] = { completions: [] };
  keys.forEach((key) => {
    // if (key === 'completions') throw new Error('Cannot use "completions" as a key in suggestions.');
    current = current[key] as Suggestions;
    if (!current) {
      current = { completions: [] };
    }
  });
  suggestions.completions.push({
    label: key,
    kind: CompletionItemKind.Keyword,
    insertText: key,
    documentation: {
      kind: 'plaintext',
      value: value.description ?? '',
    },
  });
}

function processObject(key: string, obj: Record<string, any>, suggestions: Suggestions) {
  if (!obj.properties) {
    addCompletion(key, obj, suggestions);
    return;
  }

  Object.entries(obj.properties as Record<string, Record<string, any>>).forEach(([key, value]) => {
    processProperty(key, value, completionItems);
  });
}

function processArray(
  key: string,
  property: Record<string, any>,
  completionItems: CompletionItem[]
) {
  if (!property.items) {
    completionItems.push({
      label: key,
      kind: CompletionItemKind.Keyword,
      insertText: key,
      documentation: {
        kind: 'plaintext',
        value: property.description ?? '',
      },
    });
    return;
  }

  // processProperty(key)
}

// Call if additionalProperties are explicityly set to false
function processProperty(
  keys: string[],
  property: Record<string, any>,
  suggestions: Suggestions
): CompletionItem[] {
  // if (typeof property.type === 'array') processMultipleTypes(key, property, completionItems);
  // else if (property.type === 'object') processObject(key, property, completionItems);
  // else if (property.type === 'array') processArray(key, property, completionItems);
  // else if (property.type === 'string') processString(key, property, completionItems);
  // // else

  return completionItems;
}

function formatSchemas(blockType: string): Record<string, Record<string, string[]>> {
  const files = fs.readdirSync(path.join(__dirname, '../../schemas/'));
  const schemas: Record<string, Record<string, string[]>> = {};

  files.forEach((file) => {
    const filePath = path.join(__dirname, '../../schemas', file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);

    const properties = Object.keys(json?.properties.properties || {});
    const events = Object.keys(json?.events?.properties || {});

    const fileName = path.basename(file, '.json');
    schemas[fileName] = { properties, events };
  });
  return schemas;
}
