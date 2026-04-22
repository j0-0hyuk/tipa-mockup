import type {
  FileValidationCallbacks,
  FileValidationResult
} from '@/utils/file/validateFile';

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

const HANGUL_TYPES = [
  'application/vnd.hancom.hwp',
  'application/haansofthwp',
  'application/x-hwp'
] as const;

/**
 * hwp/hwpx 파일만 검증하는 함수 (template 페이지용)
 * @param file 검증할 파일
 * @param callbacks 검증 실패 시 호출할 콜백 함수들
 * @returns 검증 결과
 */
export function validateHwpFile(
  file: File,
  callbacks: FileValidationCallbacks = {}
): FileValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    callbacks.onFilesize?.();
    return { isValid: false, errorType: 'filesize' };
  }
  const isHwpx = file.name.endsWith('.hwpx');
  const isHwp =
    file.name.endsWith('.hwp') ||
    HANGUL_TYPES.includes(file.type as (typeof HANGUL_TYPES)[number]);

  if (!isHwpx && !isHwp) {
    callbacks.onUnsupported?.();
    return { isValid: false, errorType: 'unsupported' };
  }

  return { isValid: true };
}
