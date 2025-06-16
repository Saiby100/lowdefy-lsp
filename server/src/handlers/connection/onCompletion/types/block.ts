type BlockData = {
  type: string;
  category: string;
  schema: string;
  description: string;
  areas?: Array<string>;
};

export type Block = Record<string, BlockData>;
