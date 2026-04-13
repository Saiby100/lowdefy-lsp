import { CompletionItemKind } from 'vscode-languageserver';

import { SchemaProperty, Suggestions } from './types';
import { buildDescription, buildOneOfDescription } from './buildDescription';

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
    suggestions._type = 'oneOf';
    for (const variant of oneOf) {
      if (variant.type === 'array' && variant.items?.properties) {
        processObjectProperties(suggestions, variant.items);
      } else if (variant.type === 'object' && variant.properties) {
        processObjectProperties(suggestions, variant);
      }
    }
  } else if (type === 'object' && properties) {
    suggestions._type = 'object';
    processObjectProperties(suggestions, data);
  } else if (type === 'array' && items) {
    suggestions._type = 'array';
    if (items.properties) {
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

    const description = value.oneOf
      ? buildOneOfDescription(value)
      : buildDescription(value);
    addCompletion(key, suggestions, description);
  }
}

export { addCompletion, processProperty, processObjectProperties };
