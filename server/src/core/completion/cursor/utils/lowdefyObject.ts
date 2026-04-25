import { Node, Document, Pair, isMap, isSeq } from 'yaml';

function getLowdefyObject(
  node: Node | Pair,
  documentJSON: Document.Parsed
): Record<string, any> | undefined {
  if (isMap(node)) {
    const currentObject = node.toJS(documentJSON);
    if ('type' in currentObject && 'id' in currentObject) {
      return currentObject;
    }
  }
  return undefined;
}

function getCurrentLowdefyObject(
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

function getSiblingLowdefyObjects(path: (Node | Pair)[], documentJSON: Document.Parsed) {
  // Traverse the path to find the first sequence node
  for (const node of path) {
    if (isSeq(node)) {
      // Found a sequence node, iterate over its items and collect lowdefy objects
      const lowdefyObjects: Record<string, any>[] = [];
      for (const item of node.items) {
        const lowdefyObject = getLowdefyObject(item as Node | Pair, documentJSON);
        if (lowdefyObject) {
          lowdefyObjects.push(lowdefyObject);
        }
      }
      return lowdefyObjects.reverse();
    }
  }

  return [];
}

export { getLowdefyObject, getSiblingLowdefyObjects, getCurrentLowdefyObject };
