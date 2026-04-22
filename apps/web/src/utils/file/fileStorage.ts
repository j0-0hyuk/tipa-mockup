/**
 * 파일을 IndexedDB에 저장하고 불러오는 유틸리티
 */

const DB_NAME = 'docs-front-file-storage';
const DB_VERSION = 1;
const STORE_NAME = 'files';

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  isBlob?: boolean;
  fileUrl?: string;
  productFilePathMapId?: number;
  productFileId?: number;
}

/**
 * IndexedDB 초기화
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * 파일을 IndexedDB에 저장
 */
export async function saveFileToIndexedDB(
  file: File,
  metadata: FileMetadata
): Promise<string> {
  const db = await openDB();
  const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const arrayBuffer = await file.arrayBuffer();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const fileData = {
      id,
      arrayBuffer: arrayBuffer,
      metadata
    };

    const request = store.add(fileData);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
}

/**
 * IndexedDB에서 파일 불러오기
 */
export async function getFileFromIndexedDB(
  id: string
): Promise<{ file: File; metadata: FileMetadata } | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const result = request.result;
      if (result && result.arrayBuffer) {
        // ArrayBuffer를 File 객체로 변환
        const blob = new Blob([result.arrayBuffer], {
          type: result.metadata.type
        });
        const file = new File([blob], result.metadata.name, {
          type: result.metadata.type,
          lastModified: result.metadata.lastModified
        });

        resolve({
          file,
          metadata: result.metadata
        });
      } else {
        resolve(null);
      }
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * IndexedDB에서 파일 삭제
 */
export async function deleteFileFromIndexedDB(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * 파일을 IndexedDB에 저장하고 react-secure-storage에 메타데이터 저장
 */
export interface SaveFileOptions {
  file: File;
  metadata?: Partial<FileMetadata>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export async function saveFileForTemplate(
  options: SaveFileOptions
): Promise<void> {
  const { file, metadata = {}, onSuccess, onError } = options;

  try {
    const fileMetadata: FileMetadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      isBlob: true,
      ...metadata
    };

    const fileId = await saveFileToIndexedDB(file, fileMetadata);

    const fileInfo = {
      ...fileMetadata,
      fileId: fileId,
      storageType: 'indexeddb' as const
    };

    localStorage.setItem('templateFile', JSON.stringify(fileInfo));

    onSuccess?.();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    onError?.(err);
    throw err;
  }
}

/**
 * fileUrl에서 파일을 다운로드하여 IndexedDB에 저장하고 react-secure-storage에 메타데이터 저장
 */
export interface SaveFileFromUrlOptions {
  fileUrl: string;
  filename: string;
  createdAt?: string;
  metadata?: Partial<FileMetadata>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export async function saveFileFromUrlForTemplate(
  options: SaveFileFromUrlOptions
): Promise<void> {
  const {
    fileUrl,
    filename,
    createdAt,
    metadata = {},
    onSuccess,
    onError
  } = options;

  try {
    // fileUrl에서 파일 다운로드
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`파일 다운로드 실패: ${response.statusText}`);
    }

    const blob = await response.blob();
    const file = new File([blob], filename, {
      type: blob.type || 'application/octet-stream',
      lastModified: createdAt ? new Date(createdAt).getTime() : Date.now()
    });

    const fileMetadata: FileMetadata = {
      name: filename,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      isBlob: false,
      fileUrl: fileUrl,
      ...metadata
    };

    const fileId = await saveFileToIndexedDB(file, fileMetadata);

    const fileInfo = {
      ...fileMetadata,
      fileId: fileId,
      storageType: 'indexeddb' as const
    };

    localStorage.setItem('templateFile', JSON.stringify(fileInfo));

    onSuccess?.();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    onError?.(err);
    throw err;
  }
}
