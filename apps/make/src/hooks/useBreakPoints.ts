import { useMediaQuery } from '@raddix/use-media-query';

interface BreakPoints {
  sm: boolean;
  md: boolean;
  isMobile: boolean;
}

export function useBreakPoints(): BreakPoints {
  const sm = useMediaQuery('(max-width: 499px)');
  const md = useMediaQuery('(min-width: 500px) and (max-width: 999px)');
  const isMobile = useMediaQuery('(max-width: 999px)');

  return {
    sm,
    md,
    isMobile
  };
}
