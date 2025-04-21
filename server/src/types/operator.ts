type Method = {
  name: string;
  types?: string;
  description: string;
  arguments?: string;
  examples?: string;
};

type OperatorData = {
  type: string;
  types?: string;
  description: string;
  arguments?: string;
  env?: string;
  hasMethods: boolean;
  build?: boolean;
  methods?: Method[];
};

export type OperatorKey = `_${string}`;

export type Operators = Record<OperatorKey, OperatorData>;
