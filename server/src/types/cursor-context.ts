import { Node, Pair } from 'yaml';

export type CursorContext = {
  currentObject: Record<string, any> | undefined;
  keys: string[];
  lastTyped: string | undefined;
  offset: number;
  path: (Node | Pair)[];
  sequenceKey: string | undefined;
};
