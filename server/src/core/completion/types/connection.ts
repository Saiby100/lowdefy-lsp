type ConnectionData = {
  /** Connection type identifier (e.g. "AWSS3"). */
  type: string;
  /** Grouping label, always "Connection" for connection entries. */
  category: string;
  /** Markdown description rendered in completion documentation. */
  description: string;
};

export type Connection = Record<string, ConnectionData>;
