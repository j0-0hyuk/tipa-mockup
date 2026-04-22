import { StyledSvg, type SvgProps } from '#svg/svg.style.ts';

export default function IcHeadingToggle({
  color = 'black',
  size = 18
}: SvgProps) {
  return (
    <StyledSvg
      width={size}
      height={size}
      color={color}
      size={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 9.5H10.5"
        stroke="#3F434D"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 13.25V5.75"
        stroke="#3F434D"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 13.25V5.75"
        stroke="#3F434D"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.625 9.5L15.5 8.25V13.25"
        stroke="#3F434D"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.32927 9.17661C3.55691 9.32017 3.55691 9.67905 3.32927 9.82261L0.512195 11.5991C0.284553 11.7426 0 11.5632 0 11.2761L0 7.72313C0 7.43602 0.284553 7.25658 0.512195 7.40013L3.32927 9.17661Z"
        fill="#3F434D"
      />
    </StyledSvg>
  );
}
