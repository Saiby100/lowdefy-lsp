import fs from 'fs';
import path from 'path';

function formatSchemas(): Record<string, Record<string, string[]>> {
  const files = fs.readdirSync(path.join(__dirname, '../../schemas'));
  const schemas: Record<string, Record<string, string[]>> = {};

  files.forEach((file) => {
    const filePath = path.join(__dirname, '../../schemas', file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);

    const properties = Object.keys(json?.properties.properties || {});
    const events = Object.keys(json?.events?.properties || {});

    const fileName = path.basename(file, '.json');
    schemas[fileName] = { properties, events };
  });
  return schemas;
}
