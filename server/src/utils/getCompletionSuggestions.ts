import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { Operators, OperatorKey } from '../types/operator';
import { Action } from '../types/action';
import { Connection } from '../types/connection';
import { Block } from '../types/block';

import { getParentKeys } from './getNthParent';

import actionsJson from '../resources/docs/actions.json';
const actions: Action = actionsJson;

import connectionsJson from '../resources/docs/connections.json';
const connections: Connection = connectionsJson;

import containersJson from '../resources/docs/containers.json';
const containers: Block = containersJson;

import displaysJson from '../resources/docs/displays.json';
const displays: Block = displaysJson;

import inputsJson from '../resources/docs/inputs.json';
const inputs: Block = inputsJson;

import listsJson from '../resources/docs/lists.json';
const lists: Block = listsJson;

import operatorsJson from '../resources/docs/operators.json';
import { Position } from 'vscode-languageserver-textdocument';
const operators: Operators = operatorsJson;

function getFormattedActions(): CompletionItem[] {
  return Object.keys(actions).map((action) => ({
    label: action,
    kind: CompletionItemKind.Method,
    insertText: action,
    documentation: {
      kind: 'markdown',
      value: actions[action].description,
    },
  }));
}

function getFormattedConnections(): CompletionItem[] {
  return Object.keys(connections).map((connection) => ({
    label: connection,
    kind: CompletionItemKind.Class, //TODO: Find good kind
    insertText: connection,
    documentation: {
      kind: 'markdown',
      value: connections[connection].description,
    },
  }));
}

function getFormattedContainers(): CompletionItem[] {
  return Object.keys(containers).map((container) => ({
    label: container,
    kind: CompletionItemKind.Class,
    insertText: container,
    documentation: {
      kind: 'markdown',
      value: containers[container].description,
    },
  }));
}

function getFormattedDisplays(): CompletionItem[] {
  return Object.keys(displays).map((display) => ({
    label: display,
    kind: CompletionItemKind.Method,
    insertText: display,
    documentation: {
      kind: 'markdown',
      value: displays[display].description,
    },
  }));
}

function getFormattedInputs(): CompletionItem[] {
  return Object.keys(inputs).map((input) => ({
    label: input,
    kind: CompletionItemKind.Method,
    insertText: input,
    documentation: {
      kind: 'markdown',
      value: inputs[input].description,
    },
  }));
}

function getFormattedLists(): CompletionItem[] {
  return Object.keys(lists).map((list) => ({
    label: list,
    kind: CompletionItemKind.Method,
    insertText: list,
    documentation: {
      kind: 'markdown',
      value: lists[list].description,
    },
  }));
}

function getFormattedOperators(): CompletionItem[] {
  return Object.keys(operators).map((operator) => {
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
  });
}

function checkIntersection(targetArray: any[], values: any[]): Boolean {
  return values.some((item) => targetArray.includes(item));
}

function createGetCompletionSuggestions() {
  const actions = getFormattedActions(); // parent is `type` and parent.parent.parent is `events`
  const connections = getFormattedConnections(); // parent is `connection`
  const containers = getFormattedContainers(); // parent is `type` and parent.parent is `blocks`
  const displays = getFormattedDisplays(); // parent is `type` and parent.parent is `blocks`
  const inputs = getFormattedInputs(); // parent is `type` and parent.parent is `blocks`
  const lists = getFormattedLists(); // parent is `type` and parent.parent is `blocks`
  const operators = getFormattedOperators(); // developer typed `_`

  return (document: string, position: Position): CompletionItem[] => {
    // Suggest block types if parent is `type`.
    // Suggest properties/params depending on if type was given.
    // const parentKeys = getParentKeys(document, position);
    const defaultCompletions: CompletionItem[] = [
      {
        label: 'id',
        kind: CompletionItemKind.Field,
        insertText: 'id: ',
        documentation: {
          kind: 'markdown',
          value: '**id**: Sets the id of the block (should be unique).',
        },
      },
      {
        label: 'type',
        kind: CompletionItemKind.Field,
        insertText: 'type: ',
        documentation: {
          kind: 'markdown',
          value: '**type**: Sets the type of the block you would like to use.',
        },
      },
    ];
    return defaultCompletions;
  };
}

export default createGetCompletionSuggestions;
