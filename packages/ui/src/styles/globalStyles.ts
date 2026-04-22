import { css } from '@emotion/react';

import { theme } from '#styles/theme.ts';

import PretendardThinWoff2 from '#assets/fonts/woff2/Pretendard-Thin.woff2';
import PretendardExtraLightWoff2 from '#assets/fonts/woff2/Pretendard-ExtraLight.woff2';
import PretendardLightWoff2 from '#assets/fonts/woff2/Pretendard-Light.woff2';
import PretendardRegularWoff2 from '#assets/fonts/woff2/Pretendard-Regular.woff2';
import PretendardMediumWoff2 from '#assets/fonts/woff2/Pretendard-Medium.woff2';
import PretendardSemiBoldWoff2 from '#assets/fonts/woff2/Pretendard-SemiBold.woff2';
import PretendardBoldWoff2 from '#assets/fonts/woff2/Pretendard-Bold.woff2';
import PretendardExtraBoldWoff2 from '#assets/fonts/woff2/Pretendard-ExtraBold.woff2';
import PretendardBlackWoff2 from '#assets/fonts/woff2/Pretendard-Black.woff2';

export const globalStyles = css`
  @font-face {
    font-family: 'Pretendard';
    src:
      url(${PretendardThinWoff2}) format('font-woff2'),
    font-weight: 100;
    font-display: swap;
  }

  @font-face {
    font-family: 'Pretendard';
    src:
      url(${PretendardExtraLightWoff2}) format('font-woff2'),
    font-weight: 200;
    font-display: swap;
  }

  @font-face {
    font-family: 'Pretendard';
    src:
      url(${PretendardLightWoff2}) format('font-woff2'),
    font-weight: 300;
    font-display: swap;
  }

  @font-face {
    font-family: 'Pretendard';
    src:
      url(${PretendardRegularWoff2}) format('font-woff2'),
    font-weight: 400;
    font-display: swap;
  }

  @font-face {
    font-family: 'Pretendard';
    src:
      url(${PretendardMediumWoff2}) format('font-woff2'),
    font-weight: 500;
    font-display: swap;
  }

  @font-face {
    font-family: 'Pretendard';
    src:
      url(${PretendardSemiBoldWoff2}) format('font-woff2'),
    font-weight: 600;
    font-display: swap;
  }

  @font-face {
    font-family: 'Pretendard';
    src:
      url(${PretendardBoldWoff2}) format('font-woff2'),
    font-weight: 700;
    font-display: swap;
  }

  @font-face {
    font-family: 'Pretendard';
    src:
      url(${PretendardExtraBoldWoff2}) format('font-woff2'),
    font-weight: 800;
    font-display: swap;
  }

  @font-face {
    font-family: 'Pretendard';
    src:
      url(${PretendardBlackWoff2}) format('font-woff2'),
    font-weight: 900;
    font-display: swap;
  }

  :root {
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    height: 100%;
    width: 100%;
  }

  input,
  textarea {
    outline: none;
  }

  textarea {
    resize: none;
  }

  button {
    border: 0;
    outline: none;
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  form {
    width: 100%;
  }

  * {
    font-family:
      'Pretendard',
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      Roboto,
      'Helvetica Neue',
      'Segoe UI',
      'Apple SD Gothic Neo',
      'Noto Sans KR',
      'Malgun Gothic',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      sans-serif;

    box-sizing: border-box;
  }

  .recharts-surface:focus {
    outline: none !important;
    user-select: none !important;
  }

  .bn-block-group
    .bn-block:not(:has(.bn-toggle-wrapper))
    .bn-block-group
    .bn-block-outer:not([data-prev-depth-changed])::before {
    border-left: none !important;
  }

  .bn-editor [data-content-type='table'] td {
    font-weight: 400;
    text-align: left;
    color: ${theme.color.black};
    line-height: 20px;
  }

  .bn-editor {
    padding-inline: 0 !important;
  }

  .bn-editor [data-content-type='table'] th,
  .bn-editor [data-content-type='table'] td {
    padding: 8px 10px;
    min-height: 40px;
    font-size: 14px;
    border: 1px solid ${theme.color.borderGray};
  }

  body {
    background:
      linear-gradient(0deg, #fff 0%, #fff 100%),
      linear-gradient(180deg, #eaf2fe 0%, #fff 100%);
    margin: 0;
    display: flex;
    min-width: 320px;
    height: 100vh;
  }

  /* Custom Scrollbar Design based on Figma */
  /* Webkit-based browsers (Chrome, Safari, Edge) */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 0;
  }

  /* 기본 상태에서는 스크롤바 숨기기 */
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: content-box;
    min-height: 20px;
    transition: background 0.2s ease;
  }

  /* hover 시에만 스크롤바 보이기 */
  *:hover::-webkit-scrollbar-thumb {
    background: #e3e4e8;
    background-clip: content-box;
  }

  *:hover::-webkit-scrollbar-thumb:hover {
    background: #d1d5db;
    background-clip: content-box;
  }

  *:hover::-webkit-scrollbar-thumb:active {
    background: #9ca3af;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* Firefox - 공간은 유지하되 투명하게 */
  * {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }

  *:hover {
    scrollbar-color: #e3e4e8 transparent;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .paddle-frame {
    pointer-events: auto !important;
  }
`;
