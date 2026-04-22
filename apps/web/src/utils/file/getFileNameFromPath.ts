const decodeUriSafe = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const getFileNameFromPath = (
  filePath?: string | null
): string => {
  if (!filePath) return '';

  const pathWithoutQueryOrHash =
    filePath.split('?')[0]?.split('#')[0] ?? filePath;
  const fileName = pathWithoutQueryOrHash.split('/').pop() || '';

  return decodeUriSafe(fileName).normalize('NFC');
};
