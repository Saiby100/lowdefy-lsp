import { DidChangeConfigurationNotification } from 'vscode-languageserver';
import ServerContext from '../../../types/server-context';

function onInitialized({ connection, capabilities }: ServerContext) {
  return () => {
    if (capabilities.workspace) {
      connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }

    if (capabilities.workspaceFolders) {
      connection.workspace.onDidChangeWorkspaceFolders((_event) => {
        // Handle workspace folder changes if necessary
      });
    }
  };
}
export default onInitialized;
