import { useState, useCallback, useRef, useEffect } from 'react';

type ProgressStep = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

interface UseProductCreationLoadingToastReturn {
  progress: ProgressStep;
  isVisible: boolean;
  show: () => void;
  hide: () => void;
  setProgress: (progress: ProgressStep) => void;
  reset: () => void;
}

const PROGRESS_STEPS: ProgressStep[] = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100
];

export function useProductCreationLoadingToast(): UseProductCreationLoadingToastReturn {
  const [progress, setProgressState] = useState<ProgressStep>(10);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback(() => {
    setIsVisible(true);
    setProgressState(10);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setProgress = useCallback((newProgress: ProgressStep) => {
    setProgressState(newProgress);
  }, []);

  const reset = useCallback(() => {
    setProgressState(10);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoProgress = useCallback(
    (intervalMs: number = 2000) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      let currentIndex = 0;
      intervalRef.current = setInterval(() => {
        if (currentIndex < PROGRESS_STEPS.length - 1) {
          currentIndex++;
          setProgressState(PROGRESS_STEPS[currentIndex]);
        } else {
          setTimeout(() => {
            hide();
          }, 1500);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, intervalMs);
    },
    [hide]
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    progress,
    isVisible,
    show,
    hide,
    setProgress,
    reset,
    startAutoProgress
  } as UseProductCreationLoadingToastReturn & {
    startAutoProgress: (intervalMs?: number) => void;
  };
}
