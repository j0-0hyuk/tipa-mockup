import { StyledSvg, type SvgProps } from '#svg/svg.style.ts';

export default function Internet({
  width = 20,
  height = 20,
  color = 'currentColor',
  size
}: SvgProps) {
  return (
    <StyledSvg
      width={width}
      height={height}
      color={color}
      size={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0003 18.3337C14.6027 18.3337 18.3337 14.6027 18.3337 10.0003C18.3337 5.39795 14.6027 1.66699 10.0003 1.66699C5.39795 1.66699 1.66699 5.39795 1.66699 10.0003C1.66699 14.6027 5.39795 18.3337 10.0003 18.3337Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0003 1.66699C7.86052 3.91379 6.66699 6.89761 6.66699 10.0003C6.66699 13.103 7.86052 16.0869 10.0003 18.3337C12.1401 16.0869 13.3337 13.103 13.3337 10.0003C13.3337 6.89761 12.1401 3.91379 10.0003 1.66699Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.66699 10H18.3337"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledSvg>
  );
}
