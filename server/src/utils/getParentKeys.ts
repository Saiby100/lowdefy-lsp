import { parseDocument, isMap, isSeq, Node, Pair, isPair, isScalar } from 'yaml';
import { Position } from 'vscode-languageserver-types';

/**
 * Converts type Position to offset used by YAML AST.
 */
function posToOffset(pos: Position, text: string): number {
  const lines = text.split('\n');
  let offset = 0;
  for (let i = 0; i < pos.line; i++) {
    offset += lines[i].length + 1;
  }
  return offset + pos.character;
}

/**
 * Recursively finds the path of nodes leading to the current offset (cursor position).
 */
function findNodePath(offset: number, node: Node, currentPath: (Node | Pair)[]): (Node | Pair)[] {
  if (!node || !node.range) return currentPath;
  const [start, , end] = node.range;

  if (offset < start || offset > end) return currentPath;

  let path = [...currentPath, node];

  if (isSeq(node)) {
    node.items.forEach((item) => {
      const seqPath = findNodePath(offset, item as Node, path);
      if (seqPath.length > path.length) path = seqPath;
    });
  }

  if (isMap(node)) {
    node.items.forEach((item) => {
      if (!isPair(item)) return;

      const pair = item as Pair;

      const keyPath = findNodePath(offset, pair.key as Node, [...path, pair]);
      const valuePath = findNodePath(offset, pair.value as Node, [...path, pair]);

      if (keyPath.length - 1 > path.length && keyPath.length > valuePath.length) path = keyPath;
      if (valuePath.length - 1 > path.length && valuePath.length > keyPath.length) path = valuePath;
    });
  }

  return path;
}

export function getParentKeys(yamlText: string, position: Position): string[] | undefined {
  const doc = parseDocument(yamlText);
  const offset = posToOffset(position, yamlText);
  const rootNode = doc.contents as Node;
  if (!rootNode) return undefined;

  const path = findNodePath(offset, rootNode, []);

  const keys: string[] = [];

  path.forEach((node) => {
    if (!isPair(node)) return;
    if (isScalar(node.key) && typeof node.key.value === 'string') {
      keys.unshift(node.key.value);
    }
  });

  return keys.length > 0 ? keys : undefined;
}
