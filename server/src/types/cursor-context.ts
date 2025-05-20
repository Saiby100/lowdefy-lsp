import { Node, Pair } from 'yaml';

export type CursorContext = {
  keys: string[];
  lastTyped: string | undefined;
  offset: number;
  path: (Node | Pair)[];
  sequenceKey: string | undefined;
};
