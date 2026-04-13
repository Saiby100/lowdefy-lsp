type Method = {
  /** Method name as it appears after the operator dot (e.g. "_date.now"). */
  name: string;
  /** Markdown-formatted call signature(s) for the method. */
  types?: string;
  /** Markdown description rendered in completion documentation. */
  description: string;
  /** Markdown-formatted argument documentation. */
  arguments?: string;
  /** Markdown-formatted usage examples. */
  examples?: string;
};

type OperatorData = {
  /** Operator identifier including leading underscore (e.g. "_actions"). */
  type: string;
  /** Markdown-formatted call signature(s) for the operator. */
  types?: string;
  /** Markdown description rendered in completion documentation. */
  description: string;
  /** Markdown-formatted argument documentation. */
  arguments?: string;
  /** Environment where the operator runs (e.g. "Client Only", "Server Only"). */
  env?: string;
  /** Whether this operator exposes methods invoked via dot syntax. */
  hasMethods: boolean;
  /** Whether this operator is evaluated at build time. */
  build?: boolean;
  /** Available methods when hasMethods is true. */
  methods?: Method[];
};

export type Operators = Record<string, OperatorData>;
