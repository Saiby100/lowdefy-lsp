import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import containersJson from '../../../../resources/docs/containers.json';
import displaysJson from '../../../../resources/docs/displays.json';
import inputsJson from '../../../../resources/docs/inputs.json';
import listsJson from '../../../../resources/docs/lists.json';

import { Block } from '../types/block';

const containers: Block = containersJson;
const displays: Block = displaysJson;
const inputs: Block = inputsJson;
const lists: Block = listsJson;

function formatBlocks(): CompletionItem[] {
  const blocks = { ...containers, ...displays, ...inputs, ...lists }; // TODO: handle block types better
  return Object.keys(blocks).map((block) => ({
    label: block,
    kind: CompletionItemKind.Module,
    insertText: block,
    documentation: {
      kind: 'markdown',
      value: blocks[block].description,
    },
  }));
}

export default formatBlocks;
