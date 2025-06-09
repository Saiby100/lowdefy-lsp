import ServerContext from '../../../types/server-context';

function onDidClose({ documentSettings }: ServerContext) {
  return (closed: any) => {
    documentSettings.delete(closed.document.uri);
  };
}

export default onDidClose;
