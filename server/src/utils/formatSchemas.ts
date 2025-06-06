import { CompletionItemKind } from 'vscode-languageserver';

import fs from 'fs';
import path from 'path';

import { Suggestions } from '../types/suggestions';
import getSuggestionsObject from './getSuggestionsObject';

function buildDescription(value: Record<string, any>): string {
  const valueType = typeof value.type === 'string' ? value.type : value.type?.join(' | ') || '';
  let description = `${value.description || ''}\n**${valueType}**`;

  if (value.enum) description += `\n**Enum**: \`${value.enum.join('`, `')}\``;
  if (value.default) description += `\n**Default**: \`${JSON.stringify(value.default)}\``;

  return description.trim();
}

function addCompletion(keys: string[], suggestions: Suggestions, value: Record<string, any>) {
  const suggestionsObject = getSuggestionsObject(suggestions, keys);
  suggestionsObject.completions.push({
    label: keys[keys.length - 1],
    kind: CompletionItemKind.Keyword,
    insertText: keys[keys.length - 1],
    documentation: {
      kind: 'markdown',
      value: buildDescription(value),
    },
  });
}

function processObjectKeys(
  keyPath: string[],
  suggestions: Suggestions,
  value: Record<string, any>
) {
  if (!value) return;
  if (value.type && typeof value.type === 'object') {
    processProperty(keyPath, suggestions, value);
    return;
  }

  Object.entries(value as Record<string, Record<string, any>>).forEach(([key, value]) =>
    processProperty([...keyPath, key], suggestions, value)
  );
}

function processProperty(
  keyPath: string[],
  suggestions: Suggestions,
  value: Record<string, any>
): Suggestions {
  if (value.type === 'object')
    processObjectKeys([...keyPath, 'properties'], suggestions, value.properties);
  else if (value.type === 'array') {
    processProperty(keyPath, suggestions, value.items);
  }

  addCompletion(keyPath, suggestions, value);

  return suggestions;
}

function formatSchemas(): Record<string, Suggestions> {
  const BASE_DIR = path.join(__dirname, '../resources/schemas');
  const directories = fs.readdirSync(BASE_DIR);
  const suggestions: Suggestions = { completions: [], children: {} };
  const schema: Record<string, Suggestions> = {};

  for (const dir of directories) {
    const jsonFiles = fs.readdirSync(path.join(__dirname, `../resources/schemas/${dir}`));
    const directory = path.join(BASE_DIR, dir);
    for (const file of jsonFiles) {
      console.log('Processing file:', file);
      const filePath = path.join(directory, file);
      const blockType = path.basename(file, '.json');
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);

      processProperty([], suggestions, parsed);
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
