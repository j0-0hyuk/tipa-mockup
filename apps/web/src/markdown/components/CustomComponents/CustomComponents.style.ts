import styled from '@emotion/styled';

export type CustomComponentMode = 'normal' | 'diff-before' | 'diff-after';

export const StyledCustomComponentsWrapper = styled.div<{
  mode: CustomComponentMode;
  noBorder?: boolean;
  name?: string;
}>`
  width: 100%;
  height: fit-content;
  padding: 10px;
  border-radius: 12px;
  margin: 10px 0px;
  break-inside: avoid;
  page-break-inside: avoid;
  page-break-after: avoid;
  page-break-before: avoid;
  break-before: avoid;
  break-after: avoid;

  ${({ mode, theme, noBorder }) => {
    if (noBorder && mode === 'normal') {
      return '';
    }

    switch (mode) {
      case 'diff-before':
        return `
          border: 1px solid ${theme.color.bgBlueGray};
        `;
      case 'diff-after':
        return `
          box-shadow: inset 0 0 0 4px ${theme.color.bgMain};
        `;
      case 'normal':
      default:
        return `
          border: 1px solid ${theme.color.bgBlueGray};
        `;
    }
  }}
`;

export const StyledDiffIcon = styled.div<{ mode: CustomComponentMode }>`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.white};

  ${({ mode, theme }) => {
    if (mode === 'diff-before') {
      return `
        background-color: ${theme.color.textPlaceholder};
      `;
    }
    if (mode === 'diff-after') {
      return `
        background-color: ${theme.color.main};
      `;
    }
    return `display: none;`;
  }}
`;
