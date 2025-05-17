import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { Operators, OperatorKey } from '../types/operator';
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
function formatTypes(): Record<string, CompletionItem[]> {
  return {
    actions: Object.keys(actions).map((action) => ({
      label: action,
      kind: CompletionItemKind.Method,
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
      kind: CompletionItemKind.Class,
      insertText: container,
      documentation: {
        kind: 'markdown',
        value: containers[container].description,
      },
    })),
    displays: Object.keys(displays).map((display) => ({
      label: display,
      kind: CompletionItemKind.Method,
      insertText: display,
      documentation: {
        kind: 'markdown',
        value: displays[display].description,
      },
    })),
    inputs: Object.keys(inputs).map((input) => ({
      label: input,
      kind: CompletionItemKind.Method,
      insertText: input,
      documentation: {
        kind: 'markdown',
        value: inputs[input].description,
      },
    })),
    lists: Object.keys(lists).map((list) => ({
      label: list,
      kind: CompletionItemKind.Method,
      insertText: list,
      documentation: {
        kind: 'markdown',
        value: lists[list].description,
      },
    })),
    operators: Object.keys(operators).map((operator) => {
      const operatorKey = operator as OperatorKey;

      return {
        label: operatorKey,
        kind: CompletionItemKind.Operator,
        insertText: operators[operatorKey]?.hasMethods ? operatorKey : `${operatorKey}: `,
        documentation: {
          kind: 'markdown',
          value: operators[operatorKey].description,
        },
      };
    }),
  };
}

export default formatTypes;
