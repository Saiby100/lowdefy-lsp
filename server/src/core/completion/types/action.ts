type ActionData = {
  /** Action type identifier (e.g. "CallMethod"). */
  type: string;
  /** Grouping label, always "Action" for action entries. */
  category: string;
  /** Markdown-formatted call signature(s) for the action. */
  types: string;
  /** Markdown description rendered in completion documentation. */
  description: string;
  /** Markdown-formatted parameter documentation. */
  params: string;
};

export type Action = Record<string, ActionData>;
