import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { Operators } from '../types/operator';

import operatorsJson from '../../../resources/docs/operators.json';

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

export default formatOperators;
