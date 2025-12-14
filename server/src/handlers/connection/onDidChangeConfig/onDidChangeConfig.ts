import DocumentSettings from '../../../types/document-settings';
import ServerContext from '../../../types/server-context';
import { validateDocument } from '../../../core/validation';

const defaultSettings: DocumentSettings = {
  maxNumberOfProblems: 1000,
};

function onDidChangeConfig(context: ServerContext) {
  const { documents, documentSettings, capabilities } = context;
  return (change: any) => {
    if (capabilities.configuration) {
      documentSettings.clear();
    } else {
      documentSettings.set(
        '_global',
        Promise.resolve(
          <DocumentSettings>(change.settings.lowdefyLanguageServer || defaultSettings)
        )
      );
    }
    documents.all().forEach((doc) => validateDocument(context, doc));
  };
}
export default onDidChangeConfig;
