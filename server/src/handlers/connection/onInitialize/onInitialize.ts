import {
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node';

import ServerContext from '../../../types/server-context';

function onInitialize({ capabilities }: ServerContext) {
  return (params: InitializeParams): InitializeResult => {
    const { capabilities: clientCapabilities } = params;

    capabilities.configuration = !!(
      clientCapabilities.workspace && clientCapabilities.workspace.configuration
    );
    capabilities.workspaceFolders = !!(
      clientCapabilities.workspace && clientCapabilities.workspace.workspaceFolders
    );
    capabilities.diagnosticRelatedInformation = !!(
      clientCapabilities.textDocument &&
      clientCapabilities.textDocument.publishDiagnostics &&
      clientCapabilities.textDocument.publishDiagnostics.relatedInformation
    );

    const result: InitializeResult = {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: {
          resolveProvider: true,
          triggerCharacters: ['.', ' ', '_'],
        },
      },
    };
    if (capabilities.workspaceFolders) {
      result.capabilities.workspace = {
        workspaceFolders: {
          supported: true,
          changeNotifications: true,
        },
      };
    }
    return result;
  };
}

export default onInitialize;
