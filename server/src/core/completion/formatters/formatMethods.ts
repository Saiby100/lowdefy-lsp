import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { Operators } from '../types/operator';

import operatorsJson from '../../../resources/docs/operators.json';

const operators: Operators = operatorsJson;

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

export default formatMethods;
