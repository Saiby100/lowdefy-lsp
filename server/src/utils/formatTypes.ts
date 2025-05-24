import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { Operators } from '../types/operator';
import { Action } from '../types/action';
import { Connection } from '../types/connection';
import { Block } from '../types/block';

import actionsJson from '../resources/docs/actions.json';
import connectionsJson from '../resources/docs/connections.json';
import containersJson from '../resources/docs/containers.json';
import displaysJson from '../resources/docs/displays.json';
import inputsJson from '../resources/docs/inputs.json';
import listsJson from '../resources/docs/lists.json';
import operatorsJson from '../resources/docs/operators.json';

// Cast json to type
const actions: Action = actionsJson;
const connections: Connection = connectionsJson;
const containers: Block = containersJson;
const displays: Block = displaysJson;
const inputs: Block = inputsJson;
const lists: Block = listsJson;
const operators: Operators = operatorsJson;

// Build completion arrays
function formatBlocks(): Record<string, CompletionItem[]> {
  return {
    actions: Object.keys(actions).map((action) => ({
      label: action,
      kind: CompletionItemKind.Function,
      insertText: action,
      documentation: {
        kind: 'markdown',
        value: actions[action].description,
      },
    })),
    connections: Object.keys(connections).map((connection) => ({
      label: connection,
      kind: CompletionItemKind.Class, //TODO: Find good kind
      insertText: connection,
      documentation: {
        kind: 'markdown',
        value: connections[connection].description,
      },
    })),
    containers: Object.keys(containers).map((container) => ({
      label: container,
      kind: CompletionItemKind.Module,
      insertText: container,
      documentation: {
        kind: 'markdown',
        value: containers[container].description,
      },
    })),
    displays: Object.keys(displays).map((display) => ({
      label: display,
      kind: CompletionItemKind.Module,
      insertText: display,
      documentation: {
        kind: 'markdown',
        value: displays[display].description,
      },
    })),
    inputs: Object.keys(inputs).map((input) => ({
      label: input,
      kind: CompletionItemKind.Module,
      insertText: input,
      documentation: {
        kind: 'markdown',
        value: inputs[input].description,
      },
    })),
    lists: Object.keys(lists).map((list) => ({
      label: list,
      kind: CompletionItemKind.Module,
      insertText: list,
      documentation: {
        kind: 'markdown',
        value: lists[list].description,
      },
    })),
  };
}

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

export { formatBlocks, formatOperators, formatMethods };
