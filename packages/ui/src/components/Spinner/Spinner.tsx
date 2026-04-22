import LoadSpinner from '#assets/lottie/load-spinner.json' with { type: 'json' };
import Lottie from 'lottie-react';

export interface SpinnerProps {
  size?: number;
}

export const Spinner = ({ size = 24 }: SpinnerProps) => {
  return (
    <Lottie style={{ height: size }} animationData={LoadSpinner} loop={true} />
  );
};
