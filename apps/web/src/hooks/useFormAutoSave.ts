import { useEffect, useRef, useCallback } from 'react';
import type { Control, FieldValues } from 'react-hook-form';
import { useWatch } from 'react-hook-form';


/**
 * 저장된 폼 데이터를 불러오는 유틸리티 함수
 * @param key - 스토리지 키
 * @param defaultValues - 기본값 (저장된 데이터가 없을 때 사용)
 * @returns 저장된 데이터 또는 기본값
 */
export function getSavedFormValues<T extends FieldValues>(
  key: string,
  defaultValues: T
): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved && typeof saved === 'string') {
      const parsed = JSON.parse(saved) as Partial<T>;
      return { ...defaultValues, ...parsed };
    }
  } catch (error) {
    console.warn(`Failed to load saved form data for key "${key}":`, error);
  }
  return defaultValues;
}

/**
 * 폼 제출 성공 시 스토리지를 비우는 헬퍼 함수
 * @param key - 스토리지 키
 */
export function clearSavedFormValues(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to clear saved form data for key "${key}":`, error);
  }
}

/**
 * 폼 변경사항을 자동으로 저장하는 커스텀 훅
 * @param control - React Hook Form의 Control 객체
 * @param key - 스토리지에 저장할 키
 * @param delay - 디바운스 지연 시간 (기본값: 1000ms)
 */
export function useFormAutoSave<T extends FieldValues>(
  control: Control<T>,
  key: string,
  delay: number = 1000,
  excludeFields: string[] = [],
  enabled: boolean = true
): void {
  const formValues = useWatch({ control }) as T;
  const isInitialMount = useRef(true);
  const previousValuesRef = useRef<T | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveFormData = useCallback(
    (values: T) => {
      try {
        const valuesToSave = { ...values };
        excludeFields.forEach((field) => {
          delete valuesToSave[field];
        });
        localStorage.setItem(key, JSON.stringify(valuesToSave));
        previousValuesRef.current = values;
      } catch (error) {
        console.error(`Failed to save form data for key "${key}":`, error);
      }
    },
    [key, excludeFields]
  );

  useEffect(() => {
    if (!enabled) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousValuesRef.current = formValues;
      return;
    }

    if (
      previousValuesRef.current &&
      JSON.stringify(previousValuesRef.current) === JSON.stringify(formValues)
    ) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveFormData(formValues);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (previousValuesRef.current) {
        saveFormData(previousValuesRef.current);
      }
    };
  }, [enabled, formValues, delay, saveFormData]);
}
