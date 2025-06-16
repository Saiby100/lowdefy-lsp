import { TextDocument } from 'vscode-languageserver-textdocument';
import ServerContext from '../../../types/server-context';
import { Diagnostic } from 'vscode-languageserver';
import getBlocks from './getBlocks';

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

function validateDocument(
  { connection, parsedDocuments, validate }: ServerContext,
  document: TextDocument
) {
  const parsedDoc = parsedDocuments.get(document.uri);
  if (!parsedDoc) return;

  const blocks = getBlocks(parsedDoc);
  blocks.forEach((block) => {
    const lowdefyType = block.type ?? Object.keys(block)[0];
    validate(lowdefyType, block);
  });
  const diagnostics: Diagnostic[] = [];

  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

export default validateDocument;
