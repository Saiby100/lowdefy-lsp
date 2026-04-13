import { SchemaProperty } from './types';

function formatType(type: string | string[] | undefined): string {
  if (!type) return '';
  return Array.isArray(type) ? type.join(' | ') : type;
}

function buildDescription(data: SchemaProperty): string {
  const parts: string[] = [];

  if (data.description) {
    parts.push(data.description);
  }

  const typeStr = formatType(data.type);
  if (typeStr) {
    parts.push(`**Type:** ${typeStr}`);
  }

  if (data.enum && data.enum.length > 0) {
    parts.push(`**Enum:** ${data.enum.join(', ')}`);
  }

  if (data.default !== undefined) {
    parts.push(`**Default:** ${JSON.stringify(data.default)}`);
  }

  return parts.join('\n\n');
}

function buildOneOfDescription(data: SchemaProperty): string {
  const parts: string[] = [];

  if (data.description) {
    parts.push(data.description);
  } else if (data.oneOf) {
    const desc = data.oneOf.find((variant) => variant.description)?.description;
    if (desc) parts.push(desc);
  }

  if (data.oneOf) {
    const types = data.oneOf
      .map((variant) => formatType(variant.type))
      .filter(Boolean)
      .join(' | ');
    if (types) {
      parts.push(`**Type:** ${types}`);
    }
  }

  if (data.default !== undefined) {
    parts.push(`**Default:** ${JSON.stringify(data.default)}`);
  }

  return parts.join('\n\n');
}

export { formatType, buildDescription, buildOneOfDescription };
