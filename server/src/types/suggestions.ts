import { CompletionItem } from 'vscode-languageserver';

export type Suggestions = {
  completions: CompletionItem[];
  type?: string;
  children: Record<string, Suggestions>;
};
