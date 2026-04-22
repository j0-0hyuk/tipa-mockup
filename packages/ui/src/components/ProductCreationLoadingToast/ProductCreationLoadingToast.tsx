import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';

import {
  StyledContentRow,
  StyledLoadingText,
  StyledPercentageText,
  StyledProductCreationLoadingToast,
  StyledProgressBarContainer,
  StyledTextContainer,
  StyledIconSlot,
  StyledSpinnerIcon
} from '#components/ProductCreationLoadingToast/ProductCreationLoadingToast.style.ts';

export interface ProductCreationLoadingToastProps {
  progress: number;
  isVisible: boolean;
  message?: string;
  leadingIcon?: ReactNode;
  showSpinnerIcon?: boolean;
}

export const ProductCreationLoadingToast = ({
  progress,
  isVisible,
  message = '문서에 내용을 채워넣는 중....',
  leadingIcon,
  showSpinnerIcon = false
}: ProductCreationLoadingToastProps) => {
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [useSimulatedProgress, setUseSimulatedProgress] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    if (progress === 0) {
      setUseSimulatedProgress(true);
      setSimulatedProgress(0);

      const totalDuration = 120000;
      const updateInterval = 1000;
      const totalSteps = totalDuration / updateInterval;
      const progressPerStep = 100 / totalSteps;

      const interval = setInterval(() => {
        setSimulatedProgress((prev) => {
          if (prev >= 90) return prev;
          if (prev < 70) {
            return prev + 2 + Math.random() * 4;
          }
          return prev + progressPerStep + (Math.random() - 0.5) * 0.5;
        });
      }, updateInterval);

      return () => clearInterval(interval);
    }

    setUseSimulatedProgress(false);
  }, [isVisible, progress]);

  useEffect(() => {
    if (progress !== 100) return;

    if (useSimulatedProgress && simulatedProgress < 100) {
      const remainingProgress = 100 - simulatedProgress;
      const rapidSteps = 20;
      const stepSize = remainingProgress / rapidSteps;

      let currentStep = 0;
      const rapidInterval = setInterval(() => {
        currentStep++;
        setSimulatedProgress((prev) => {
          const newProgress = prev + stepSize;
          if (newProgress >= 100 || currentStep >= rapidSteps) {
            clearInterval(rapidInterval);
            return 100;
          }
          return newProgress;
        });
      }, 50);

      return () => clearInterval(rapidInterval);
    }

    setSimulatedProgress(100);
  }, [progress, simulatedProgress, useSimulatedProgress]);

  const displayProgress = useSimulatedProgress ? simulatedProgress : progress;

  const iconNode =
    leadingIcon ??
    (showSpinnerIcon ? (
      <StyledSpinnerIcon>
        <LoaderCircle size={16} />
      </StyledSpinnerIcon>
    ) : null);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 20, y: -10 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <StyledProductCreationLoadingToast>
            <StyledContentRow>
              <StyledTextContainer>
                {iconNode ? <StyledIconSlot>{iconNode}</StyledIconSlot> : null}
                <motion.div
                  key={progress}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <StyledLoadingText>{message}</StyledLoadingText>
                </motion.div>
              </StyledTextContainer>
              <StyledPercentageText>
                {Math.round(displayProgress)}%
              </StyledPercentageText>
            </StyledContentRow>

            <StyledProgressBarContainer>
              <motion.div
                animate={{ width: `${displayProgress}%` }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  height: '6px',
                  background: '#3182f7',
                  borderRadius: '999px',
                  width: `${displayProgress}%`
                }}
              />
            </StyledProgressBarContainer>
          </StyledProductCreationLoadingToast>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
