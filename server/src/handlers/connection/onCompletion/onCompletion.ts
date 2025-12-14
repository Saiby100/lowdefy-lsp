import { CompletionItem, TextDocumentPositionParams } from 'vscode-languageserver';
import ServerContext from '../../../types/server-context';

import { getCompletions } from '../../../core/completion';

function onCompletion({ documents, parsedDocuments }: ServerContext) {
  return (params: TextDocumentPositionParams): CompletionItem[] => {
    const document = documents.get(params.textDocument.uri);
    const parsedDocument = parsedDocuments.get(params.textDocument.uri);

    if (!document || !parsedDocument) {
      return [];
    }

    return getCompletions(document.getText(), parsedDocument, params.position);
  };
}
export default onCompletion;
