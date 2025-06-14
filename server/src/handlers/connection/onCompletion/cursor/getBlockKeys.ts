function getBlockKeys(
  currentObject: Record<string, any> | undefined,
  keys: string[],
  lastTyped: string | undefined,
  sequenceKey: string | undefined
): string[] {
  if (!currentObject || !sequenceKey) return [];
  if (typeof currentObject.type !== 'string') return [];

  const blockKeys: string[] = [currentObject.type];
  for (const key of keys) {
    if (key === sequenceKey) break;
    if (key === lastTyped) continue;
    blockKeys.push(key);
  }
  return blockKeys;
}

export default getBlockKeys;
