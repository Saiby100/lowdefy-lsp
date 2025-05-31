import { Suggestions } from '../types/suggestions';

function getValue<T>(obj: any, keys: string[]): T | undefined {
  return keys.reduce(
    (current, key) => (current && typeof current === 'object' ? current[key] : undefined),
    obj
  );
}

function setValue(obj: Suggestions, keys: string[], value: any): void {
  keys.reduce((current, key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
      return null;
    }
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = { completions: [] };
    }
    return current[key];
  }, obj);
}
