import { StyledSvg, type SvgProps } from '#svg/svg.style.ts';

export default function Meatball({
  width = 18,
  height = 18,
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
        d="M10 10.8346C10.4603 10.8346 10.8334 10.4615 10.8334 10.0013C10.8334 9.54106 10.4603 9.16797 10 9.16797C9.53978 9.16797 9.16669 9.54106 9.16669 10.0013C9.16669 10.4615 9.53978 10.8346 10 10.8346Z"
        stroke="#6E7687"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8333 10.8346C16.2936 10.8346 16.6667 10.4615 16.6667 10.0013C16.6667 9.54106 16.2936 9.16797 15.8333 9.16797C15.3731 9.16797 15 9.54106 15 10.0013C15 10.4615 15.3731 10.8346 15.8333 10.8346Z"
        stroke="#6E7687"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16665 10.8346C4.62688 10.8346 4.99998 10.4615 4.99998 10.0013C4.99998 9.54106 4.62688 9.16797 4.16665 9.16797C3.70641 9.16797 3.33331 9.54106 3.33331 10.0013C3.33331 10.4615 3.70641 10.8346 4.16665 10.8346Z"
        stroke="#6E7687"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledSvg>
  );
}
