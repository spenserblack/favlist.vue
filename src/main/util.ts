import type { JsonExport, FavlistJsonExport } from './db';

type FavlistJsonExportWithProperties = {
  title: unknown,
  columns: unknown,
  data: unknown,
};

type JsonExportWithProperties = { favlists: unknown };

/**
 * Validates that the given value is a valid JSON import/export.
 */
export function validateJson(value: unknown): value is JsonExport {
  if (!validateProperties(value)) {
    return false;
  }
  const { favlists } = value;
  if (!Array.isArray(favlists)) {
    return false;
  }
  return favlists.every(validateFavlistJson);
}

/**
 * Validates that a value is a valid JSON import/export object representing a
 * single Favlist.
 */
export function validateFavlistJson(value: unknown): value is FavlistJsonExport {
  if (!validateFavlistProperties(value)) {
    return false;
  }
  if (typeof value.title !== 'string'
      || !Array.isArray(value.columns)
      || !Array.isArray(value.data)) {
    return false;
  }
  if (value.columns.some((column) => typeof column !== 'string')) {
    return false;
  }
  const dataIsValid = value.data.every((row) => {
    if (!Array.isArray(row)) {
      return false;
    }
    return row.every((cell) => typeof cell === 'string');
  });
  return dataIsValid;
}

function validateProperties(value: unknown): value is JsonExportWithProperties {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  return ('favlists' in value);
}

function validateFavlistProperties(value: unknown): value is FavlistJsonExportWithProperties {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  return ('title' in value) && ('columns' in value) && ('data' in value);
}
