import { CompletionItem } from 'vscode-languageserver';
import ServerContext from '../../../types/server-context';

function onCompletionResolve(context: ServerContext) {
  return (item: any): CompletionItem => {
    // console.log('onCompletionResolve', item);
    return item;
  };
}

export default onCompletionResolve;
