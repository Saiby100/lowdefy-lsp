import { isSeq, Node, Pair, isPair, isScalar } from 'yaml';

function getSequenceKey(path: (Node | Pair)[], sequenceKeys: string[] = []): string | undefined {
  const matches = ['api', 'blocks', 'connections', 'requests', 'plugins', 'on.*', ...sequenceKeys];
  const regex = new RegExp(`^(${matches.join('|')})$`);

  for (const node of path) {
    if (isPair(node) && isSeq(node.value) && isScalar(node.key)) {
      const key = node.key.value;
      if (typeof key === 'string' && key.match(regex)) {
        return key;
      }
    }
  }
  return undefined;
}

export default getSequenceKey;
