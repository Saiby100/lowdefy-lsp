import { isMap, Node, Pair, Document } from 'yaml';

function getCurrentObject(
  path: (Node | Pair)[],
  documentJSON: Document.Parsed
): Record<string, any> | undefined {
  for (const node of path) {
    if (isMap(node)) {
      const currentObject = node.toJS(documentJSON);
      if (typeof currentObject.type === 'string' && typeof currentObject.id === 'string') {
        return currentObject;
      }
    }
  }
  return undefined;
}

export default getCurrentObject;
