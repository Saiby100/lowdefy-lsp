import { TextDocument } from 'vscode-languageserver-textdocument';
import ServerContext from '../../types/server-context';
import { parseDocument } from 'yaml';
import validateBlockSchema from './validateBlockSchema';

function validateDocument({ connection }: ServerContext, document: TextDocument) {
  const text = document.getText();
  const parsedDoc = parseDocument(text);
  const diagnostics = validateBlockSchema(parsedDoc, text);
  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

export default validateDocument;
