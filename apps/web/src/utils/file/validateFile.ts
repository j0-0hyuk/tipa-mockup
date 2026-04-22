export type FileValidationError = 'hwp' | 'unsupported' | 'filesize';

export interface FileValidationCallbacks {
  onHwp?: () => void;
  onUnsupported?: () => void;
  onFilesize?: () => void;
}

export interface FileValidationResult {
  isValid: boolean;
  errorType?: FileValidationError;
}

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

const HANGUL_TYPES = [
  'application/vnd.hancom.hwp',
  'application/haansofthwp',
  'application/x-hwp'
] as const;

/**
 * 파일을 검증하고 필요한 경우 콜백을 호출합니다.
 * @param file 검증할 파일
 * @param callbacks 검증 실패 시 호출할 콜백 함수들
 * @returns 검증 결과
 */
export function validateFile(
  file: File,
  callbacks: FileValidationCallbacks = {}
): FileValidationResult {
  // 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    callbacks.onFilesize?.();
    return { isValid: false, errorType: 'filesize' };
  }

  // 파일 확장자 검증
  const isHwpx = file.name.endsWith('.hwpx');
  const isDocx = file.name.endsWith('.docx');
  const isPdf = file.name.endsWith('.pdf');
  const isHwp =
    file.name.endsWith('.hwp') ||
    HANGUL_TYPES.includes(file.type as (typeof HANGUL_TYPES)[number]);

  // 지원하는 파일 형식인지 확인
  if (!isHwpx && !isDocx && !isPdf) {
    if (isHwp) {
      callbacks.onHwp?.();
      return { isValid: false, errorType: 'hwp' };
    } else {
      callbacks.onUnsupported?.();
      return { isValid: false, errorType: 'unsupported' };
    }
  }

  return { isValid: true };
}
