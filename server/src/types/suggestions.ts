import { CompletionItem } from 'vscode-languageserver';

export type Suggestions = {
  [key: string]: Suggestions | CompletionItem[];
  completions: CompletionItem[];
};
