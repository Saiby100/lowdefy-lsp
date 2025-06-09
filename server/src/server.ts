import { ProposedFeatures, TextDocuments, createConnection } from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import ServerContext from './types/server-context';

import {
  onCompletion,
  onCompletionResolve,
  onDidChangeConfig,
  onInitialize,
  onInitialized,
} from './handlers/connection';

import { onDidChangeContent, onDidClose } from './handlers/document';

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);
const context: ServerContext = {
  connection,
  documents,
  parsedDocuments: new Map(),
  capabilities: {},
  documentSettings: new Map(),
};

documents.onDidClose(onDidClose(context));
documents.onDidChangeContent(onDidChangeContent(context));
documents.listen(connection);

connection.onInitialize(onInitialize(context));
connection.onInitialized(onInitialized(context));
connection.onDidChangeConfiguration(onDidChangeConfig(context));
connection.onCompletion(onCompletion(context));
connection.onCompletionResolve(onCompletionResolve(context));

connection.listen();
