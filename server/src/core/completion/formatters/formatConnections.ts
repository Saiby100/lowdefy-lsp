import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import connectionsJson from '../../../resources/docs/connections.json';
import { Connection } from '../types/connection';

const connections: Connection = connectionsJson;

function formatConnections(): CompletionItem[] {
  return Object.keys(connections).map((connection) => ({
    label: connection,
    kind: CompletionItemKind.Class,
    insertText: connection,
    documentation: {
      kind: 'markdown',
      value: connections[connection].description,
    },
  }));
}

export default formatConnections;
