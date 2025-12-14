import { isMap, isSeq, Node, Pair, isPair } from 'yaml';
/**
 * Recursively finds the path of nodes leading to the current offset (cursor position).
 */
function getNodePath(offset: number, node: Node, currentPath: (Node | Pair)[]): (Node | Pair)[] {
  if (!node || !node.range) return currentPath;
  const [start, , end] = node.range;

  if (offset < start || offset > end) return currentPath;

  let path = [...currentPath, node];

  if (isSeq(node)) {
    node.items.forEach((item) => {
      const seqPath = getNodePath(offset, item as Node, path);
      if (seqPath.length > path.length) path = seqPath;
    });
  }

  if (isMap(node)) {
    node.items.forEach((item) => {
      if (!isPair(item)) return;

      const pair = item as Pair;

      const keyPath = getNodePath(offset, pair.key as Node, [...path, pair]);
      const valuePath = getNodePath(offset, pair.value as Node, [...path, pair]);

      if (keyPath.length - 1 > path.length && keyPath.length > valuePath.length) path = keyPath;
      if (valuePath.length - 1 > path.length && valuePath.length > keyPath.length) path = valuePath;
    });
  }

  return path;
}

export default getNodePath;
