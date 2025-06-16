import ServerContext from '../../../types/server-context';
import validateDocument from '../../shared/validate/validateDocument';
import { parseDocument } from 'yaml';

function onDidChangeContent(context: ServerContext) {
  const { parsedDocuments } = context;
  return (change: any) => {
    validateDocument(context, change.document);
    parsedDocuments.set(change.document.uri, parseDocument(change.document.getText()));
  };
}

export default onDidChangeContent;
