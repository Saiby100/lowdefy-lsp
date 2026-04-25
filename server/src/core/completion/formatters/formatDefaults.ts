import { CompletionItemKind } from 'vscode-languageserver';

function formatDefaults() {
  return {
    block_default: [
      {
        label: 'id',
        kind: CompletionItemKind.Field,
        insertText: 'id:',
        documentation: {
          kind: 'markdown',
          value: '**id**: Sets the id of the block (should be unique).',
        },
      },
      {
        label: 'type',
        kind: CompletionItemKind.Field,
        insertText: 'type:',
        documentation: {
          kind: 'markdown',
          value: '**type**: Sets the type of the block you would like to use.',
        },
      },
    ],
    plugin_default: [
      {
        label: 'name',
        kind: CompletionItemKind.Field,
        insertText: 'name:',
        documentation: {
          kind: 'markdown',
          value: '**name**: Sets the name of the plugin (should be unique).',
        },
      },
      {
        label: 'version',
        kind: CompletionItemKind.Field,
        insertText: 'version:',
        documentation: {
          kind: 'markdown',
          value: '**version**: Sets the version of the plugin.',
        },
      },
    ],
  };
}

export default formatDefaults;
