export type SuggestionContext = {
  /** Which kind of completion to surface (e.g. "block", "operator", "method"). */
  suggestionType: string;
  /** Additional context needed to produce the suggestion list. */
  meta: {
    /** Path of keys from the document root, used for nested block-schema lookups. */
    keyPath: string[];
    /** Operator name when resolving methods (e.g. "_date" for "_date.now"). */
    operator: string;
  };
};
