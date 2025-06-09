import { Document } from 'yaml';
import { Connection, TextDocuments } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import DocumentSettings from './document-settings';

export default interface ServerContext {
  connection: Connection;
  documents: TextDocuments<TextDocument>;
  parsedDocuments: Map<string, Document.Parsed>;
  capabilities: Record<string, boolean>;
  documentSettings: Map<string, Thenable<DocumentSettings>>;
}
