import fs from 'fs';
import path from 'path';

function getSchema(lowdefyType: string): JSON | undefined {
  // const schemaTypes = ['actions', 'blocks', 'connections', 'operators'];
  const schemaTypes = ['blocks'];

  for (const schemaType of schemaTypes) {
    const filePath = path.join(
      __dirname,
      `../../resources/schemas/${schemaType}/${lowdefyType}.json`
    );
    if (fs.existsSync(filePath)) {
      console.log('Schema found for type:', lowdefyType);
      const schema = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(schema);
    }
  }
  return undefined;
}

export default getSchema;
