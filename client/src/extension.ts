import * as path from 'path';
import { workspace, ExtensionContext, window, OutputChannel } from 'vscode';

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  Trace,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));

  // If the extension is launched in debug mode then the debug server options are used
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  const outputChannel: OutputChannel = window.createOutputChannel('Lowdefy Language Server');
  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for all documents by default
    documentSelector: [
      { scheme: 'file', language: 'yaml' },
      { scheme: 'file', language: 'yml' },
    ],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/*.yaml'),
    },
    outputChannel,
    traceOutputChannel: outputChannel,
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'lowdefy-language-server',
    'Lowdefy Language Server',
    serverOptions,
    clientOptions
  );
  client.setTrace(Trace.Verbose);

  // Start the client. This will also launch the server
  outputChannel.appendLine('Starting Lowdefy Language Server');
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
