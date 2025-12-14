import { Document, isMap, Node, isSeq, isPair } from 'yaml';

function isOperator(key: any): boolean {
  if (typeof key !== 'string') return false;
  return key.startsWith('_');
}
function isBlock(obj: Record<string, any>): boolean {
  if (typeof obj !== 'object' || obj === null) return false;
  if (typeof obj.id !== 'string' || typeof obj.type !== 'string') return false;
  return true;
}

function getBlocks(documentJSON: Document.Parsed): Record<string, any>[] {
  const root = documentJSON.contents as Node;
  if (!root) return [];

  const blocks: Record<string, any>[] = [];

  function getBlockObject(node: Node) {
    if (!node || typeof node !== 'object') return;

    if (isMap(node)) {
      for (const item of node.items) {
        const key = item.key?.toString?.();
        const valNode = item.value as Node;
        const valAsJS = valNode.toJS(documentJSON);

        if (isOperator(key) && typeof key === 'string') blocks.push({ [key]: valAsJS });
        if (isBlock(valAsJS)) blocks.push(valAsJS);

        getBlockObject(valNode);
      }
    } else if (isSeq(node)) {
      for (const item of node.items) {
        const itemNode = item as Node;
        const itemAsJS = itemNode.toJS(documentJSON);
        if (isBlock(itemAsJS)) blocks.push(itemAsJS);
        getBlockObject(itemNode);
      }
    }
  }

  getBlockObject(root);
  return blocks;
}

export default getBlocks;
