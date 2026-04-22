import { StyledSvg, type SvgProps } from '#svg/svg.style.ts';

export default function IcInfoTooltip({
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
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_6857_12627)">
        <path
          d="M9.00033 17.3337C13.6027 17.3337 17.3337 13.6027 17.3337 9.00033C17.3337 4.39795 13.6027 0.666992 9.00033 0.666992C4.39795 0.666992 0.666992 4.39795 0.666992 9.00033C0.666992 13.6027 4.39795 17.3337 9.00033 17.3337Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5752 6.27245C6.77112 5.7155 7.15782 5.24587 7.66682 4.94672C8.17583 4.64758 8.77427 4.53823 9.35618 4.63804C9.93808 4.73785 10.4659 5.04038 10.8461 5.49205C11.2263 5.94372 11.4344 6.51538 11.4335 7.10578C11.4335 8.77245 8.99924 10.4397 8.99924 10.4397"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 13.1665H9.00875"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_6857_12627)">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </StyledSvg>
  );
}
