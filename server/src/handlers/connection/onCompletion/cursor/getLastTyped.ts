import { Node, Pair, isScalar, Scalar } from 'yaml';

function getLastTyped(path: (Node | Pair)[]): string | undefined {
  if (isScalar(path[0])) {
    const scalar = path[0] as Scalar;
    return scalar.source;
  }
  return undefined;
}

export default getLastTyped;
