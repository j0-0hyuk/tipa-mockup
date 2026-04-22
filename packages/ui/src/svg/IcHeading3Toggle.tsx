import { StyledSvg, type SvgProps } from '#svg/svg.style.ts';

export default function IcHeading3Toggle({
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
        d="M3.32927 9.17661C3.55691 9.32017 3.55691 9.67905 3.32927 9.82261L0.512195 11.5991C0.284553 11.7426 0 11.5632 0 11.2761L0 7.72313C0 7.43602 0.284553 7.25658 0.512195 7.40013L3.32927 9.17661Z"
        fill="#3F434D"
      />
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
        d="M13.9375 8.56262C15 7.93762 16.125 8.56262 16.125 9.50012C16.125 9.83164 15.9933 10.1496 15.7589 10.384C15.5245 10.6184 15.2065 10.7501 14.875 10.7501"
        stroke="#3F434D"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.625 12.9375C14.875 13.875 16.125 13.125 16.125 12C16.125 11.6685 15.9933 11.3505 15.7589 11.1161C15.5245 10.8817 15.2065 10.75 14.875 10.75"
        stroke="#3F434D"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledSvg>
  );
}
