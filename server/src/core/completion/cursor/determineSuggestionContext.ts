import { Node, Pair, Document } from 'yaml';
import { getSiblingLowdefyObjects, getCurrentLowdefyObject } from './utils/lowdefyObject';
import getParentKeys from './utils/getParentKeys';
import getSequenceKey from './utils/getSequenceKey';
import getLastTyped from './utils/getLastTyped';
import getBlockKeys from './utils/getBlockKeys';

function determineSuggestionContext(path: (Node | Pair)[], documentJSON: Document.Parsed) {
  const keyTokenPath = getParentKeys(path);
  const sequenceKey = getSequenceKey(path);
  const lastToken = getLastTyped(path);
  const siblingLowdefyObjects = getSiblingLowdefyObjects(path, documentJSON);
  const blockKeys = getBlockKeys(
    getCurrentLowdefyObject(path, documentJSON),
    keyTokenPath,
    lastToken,
    sequenceKey
  );

  let suggestionType = 'unknown';
  if (lastToken?.startsWith('_')) {
    if (lastToken?.endsWith('.')) suggestionType = 'operator_method';
    else suggestionType = 'operator';
  }
  if (keyTokenPath[0] === 'type') {
    if (sequenceKey === 'blocks') suggestionType = 'block';
    if (sequenceKey === 'connections') suggestionType = 'connection';
    if (sequenceKey?.startsWith('on')) suggestionType = 'action';
    if (sequenceKey === 'requests') suggestionType = 'request';
    if (sequenceKey === 'api') suggestionType = 'api';
    // TODO: Determine suggestionType from sibling objects here
  }
  if (keyTokenPath[0] === 'name' && sequenceKey === 'plugins') suggestionType = 'plugin';
  if (keyTokenPath[0] === sequenceKey && sequenceKey === 'plugins')
    suggestionType = 'plugin_default';
  if (keyTokenPath[0] === sequenceKey && sequenceKey !== 'plugins')
    suggestionType = 'block_default';

  return {
    suggestionType: suggestionType,
    meta: {
      keyPath: suggestionType === 'blockSchema' ? blockKeys : [],
      operator: suggestionType === 'operator_method' ? lastToken?.slice(0, -1) : '',
    },
  };
}

export default determineSuggestionContext;
