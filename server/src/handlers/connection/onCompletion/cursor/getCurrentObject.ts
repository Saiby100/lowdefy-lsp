import { isMap, Node, Pair, Document } from 'yaml';

function getCurrentObject(
  path: (Node | Pair)[],
  documentJSON: Document.Parsed
): Record<string, any> | undefined {
  for (const node of path) {
    if (isMap(node)) return node.toJS(documentJSON);
  }
  return undefined;
}

export default getCurrentObject;
