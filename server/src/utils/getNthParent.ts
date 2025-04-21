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
 * Recursively finds the path of nodes leading to the current offset.
 */
function findNodePath(offset: number, node: Node, currentPath: Node[]): Node[] {
  if (!node || !node.range) return currentPath;
  const [start, , end] = node.range;

  if (offset < start || offset > end) return currentPath;

  const path = [...currentPath, node];

  if (isMap(node) || isSeq(node)) {
    for (const item of node.items) {
      if (item && typeof item === 'object') {
        if ('key' in item && 'value' in item) {
          // it's a Pair
          const pair = item as Pair;
          const keyPath = findNodePath(offset, pair.key as Node, path);
          const valuePath = findNodePath(offset, pair.value as Node, path);
          if (valuePath.length > keyPath.length) return valuePath;
          if (keyPath.length > 0) return keyPath;
        } else {
          // it's a Sequence item
          const seqPath = findNodePath(offset, item as Node, path);
          if (seqPath.length > 0) return seqPath;
        }
      }
    }
  }

  return path;
}

/**
 * Gets the nth parent key from the given YAML text and position.
 */
export function getNthParentKey(
  yamlText: string,
  position: Position,
  level: number
): string | undefined {
  const doc = parseDocument(yamlText);
  const offset = posToOffset(position, yamlText);
  const rootNode = doc.contents as Node;
  if (!rootNode) return undefined;

  const path = findNodePath(offset, rootNode, []);
  const reversed = [...path].reverse();

  let found = 0;
  for (const node of reversed) {
    if (isPair(node)) {
      const keyNode = node.key;
      if (isScalar(keyNode)) {
        const value = keyNode.value;
        if (typeof value === 'string') {
          found++;
          if (found === level) {
            return value;
          }
        }
      }
    }
  }

  return undefined;
}
