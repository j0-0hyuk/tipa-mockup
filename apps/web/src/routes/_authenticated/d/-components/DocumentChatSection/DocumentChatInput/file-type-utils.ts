export interface FileTypeInfo {
  color: string;
  bgColor: string;
  label: string;
}

const FILE_TYPE_MAP: Record<string, FileTypeInfo> = {
  pdf: { color: '#E53935', bgColor: '#FFEBEE', label: 'PDF' },
  docx: { color: '#1E88E5', bgColor: '#E3F2FD', label: 'DOCX' },
  doc: { color: '#1E88E5', bgColor: '#E3F2FD', label: 'DOC' },
  pptx: { color: '#FB8C00', bgColor: '#FFF3E0', label: 'PPTX' },
  ppt: { color: '#FB8C00', bgColor: '#FFF3E0', label: 'PPT' },
  xlsx: { color: '#43A047', bgColor: '#E8F5E9', label: 'XLSX' },
  xls: { color: '#43A047', bgColor: '#E8F5E9', label: 'XLS' },
  hwp: { color: '#1565C0', bgColor: '#E8EAF6', label: 'HWP' },
  hwpx: { color: '#1565C0', bgColor: '#E8EAF6', label: 'HWPX' },
  html: { color: '#E53935', bgColor: '#FFEBEE', label: 'HTML' },
  htm: { color: '#E53935', bgColor: '#FFEBEE', label: 'HTM' },
  txt: { color: '#757575', bgColor: '#F5F5F5', label: 'TXT' },
  log: { color: '#757575', bgColor: '#F5F5F5', label: 'LOG' }
};

const DEFAULT_FILE_TYPE: FileTypeInfo = {
  color: '#757575',
  bgColor: '#F5F5F5',
  label: 'FILE'
};

export function getFileExtension(filename: string): string {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex === -1) return '';
  return filename.slice(dotIndex + 1).toLowerCase();
}

export function getFileTypeInfo(filename: string): FileTypeInfo {
  const ext = getFileExtension(filename);
  if (ext && ext in FILE_TYPE_MAP) {
    return FILE_TYPE_MAP[ext];
  }
  return { ...DEFAULT_FILE_TYPE, label: ext ? ext.toUpperCase() : 'FILE' };
}

export const ACCEPTED_FILE_TYPES = '.pdf,.docx,.hwpx';

export const MAX_FILES = 3;

export const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

export function isPresignedUrlExpired(url: string): boolean {
  try {
    const params = new URL(url).searchParams;
    const se = params.get('se');
    if (!se) return false;
    return new Date(se).getTime() < Date.now();
  } catch {
    return false;
  }
}
