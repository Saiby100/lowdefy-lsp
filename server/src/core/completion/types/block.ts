type BlockData = {
  /** Block type identifier (e.g. "Button"). */
  type: string;
  /** Block category label (e.g. "input", "display"). */
  category: string;
  /** Path or identifier of the JSON schema describing this block. */
  schema: string;
  /** Markdown description rendered in completion documentation. */
  description: string;
  /** Named render areas the block exposes for nested blocks, when applicable. */
  areas?: Array<string>;
};

export type Block = Record<string, BlockData>;
