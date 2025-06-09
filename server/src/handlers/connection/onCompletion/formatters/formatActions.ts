import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import actionsJson from '../../../../resources/docs/actions.json';
import { Action } from '../types/action';

const actions: Action = actionsJson;

function formatActions(): CompletionItem[] {
  console.log('Formatting actions for completion items');
  return Object.keys(actions).map((action) => ({
    label: action,
    kind: CompletionItemKind.Function,
    insertText: action,
    documentation: {
      kind: 'markdown',
      value: actions[action].description,
    },
  }));
}
export default formatActions;
