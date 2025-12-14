import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { Operators } from '../types/operator';

import operatorsJson from '../../../resources/docs/operators.json';

// Cast json to type
const operators: Operators = operatorsJson;

function formatOperators(): CompletionItem[] {
  return Object.keys(operators).map((operator) => {
    return {
      label: operator,
      kind: CompletionItemKind.Operator,
      insertText: operators[operator]?.hasMethods ? operator : `${operator}: \n\t`, // TODO: Get tabspace config
      documentation: {
        kind: 'markdown',
        value: operators[operator].description,
      },
    };
  });
}

function formatMethods(): Record<string, CompletionItem[]> {
  const methods: Record<string, CompletionItem[]> = {};

  Object.keys(operators).forEach((operator) => {
    if (!operators[operator].hasMethods) return;

    const operatorMethods = operators[operator].methods || [];

    if (!methods[operator]) {
      methods[operator] = [];
    }

    operatorMethods.forEach((method) => {
      const newMethod: CompletionItem = {
        label: method.name,
        kind: CompletionItemKind.Method,
        insertText: `${method.name}: \n\t`,
        documentation: {
          kind: 'markdown',
          value: method.description,
        },
      };
      methods[operator].push(newMethod);
    });
  });

  return methods;
}

export { formatOperators, formatMethods };
