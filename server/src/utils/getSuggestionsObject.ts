import { Suggestions } from '../types/suggestions';

function getSuggestionsObject(obj: Suggestions, keys: string[]): Suggestions {
  let current = obj;
  keys.forEach((key) => {
    if (!current.children[key]) current.children[key] = { completions: [], children: {} };
    if (key === 'completions') throw new Error('Cannot use "completions" as a key');
    current = current.children[key];
  });
  return current;
}

export default getSuggestionsObject;
