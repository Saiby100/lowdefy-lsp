import Ajv from 'ajv';
import getSchema from './getSchema.js';

function createValidate() {
  const ajv = new Ajv();
  const cachedSchemas: Record<string, any> = {};

  return (lowdefyType: string, block: Record<string, any>) => {
    if (!cachedSchemas[lowdefyType]) {
      const schema = getSchema(lowdefyType);
      if (!schema) {
        console.error(`Schema not found for type: ${lowdefyType}`);
        return true;
      }
      cachedSchemas[lowdefyType] = ajv.compile(schema);
    }
    return cachedSchemas[lowdefyType].validate(block);
  };
}

export default createValidate;
