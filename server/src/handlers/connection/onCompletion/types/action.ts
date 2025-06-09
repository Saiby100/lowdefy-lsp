type ActionData = {
  type: string;
  category: string;
  types: string;
  description: string;
  params: string;
};

export type Action = Record<string, ActionData>;
