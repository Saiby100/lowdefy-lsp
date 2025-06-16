import { TextDocument } from 'vscode-languageserver-textdocument';
import ServerContext from '../../../types/server-context';
import { Diagnostic } from 'vscode-languageserver';

function getDocumentSettings(
  { connection, capabilities, documentSettings }: ServerContext,
  resource: string
) {
  if (capabilities.configuration) {
    return documentSettings.get('_global');
  }
  let result = documentSettings.get(resource);
  if (!result) {
    result = connection.workspace.getConfiguration({
      scopeUri: resource,
      section: 'lowdefyLanguageServer',
    });
    documentSettings.set(resource, result);
  }
  return result;
}

function validateDocument(context: ServerContext, document: TextDocument) {
  let settings = getDocumentSettings(context, document.uri);
  const diagnostics: Diagnostic[] = [];
  // TODO: Validate text document based on settings
  // console.log('Validating document:', settings, document.uri);

  context.connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

export default validateDocument;
