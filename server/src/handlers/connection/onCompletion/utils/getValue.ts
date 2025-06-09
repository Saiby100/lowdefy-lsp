function getValue(obj: Record<string, any>, keys: Array<string>): any {
  if (keys.length === 0) return null;
  return keys.reduce((acc, key) => acc?.[key], obj);
}

export default getValue;
