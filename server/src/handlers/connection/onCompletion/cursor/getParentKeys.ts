import { Node, Pair, isPair, isScalar } from 'yaml';

function getParentKeys(path: (Node | Pair)[]): string[] {
  const keys: string[] = [];

  path.forEach((node) => {
    if (!isPair(node)) return;
    if (isScalar(node.key) && typeof node.key.value === 'string') {
      keys.push(node.key.value);
    }
  });

  return keys;
}

export default getParentKeys;
