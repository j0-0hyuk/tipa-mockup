import type { TypographyKey } from '#styles/emotion.d.ts';
import styled from '@emotion/styled';

export interface StyledFormProps {
  $labelTypo?: TypographyKey;
}

export const StyledFormItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledFormLabel = styled.label<StyledFormProps>`
  display: inline-flex;
  color: ${({ theme }) => theme.color.black};
  ${({ $labelTypo, theme }) =>
    $labelTypo ? theme.typo[$labelTypo] : theme.typo.Md_15}
`;

export const StyledFormMessage = styled.p`
  color: #d93025;
  margin-top: 6px;
  ${({ theme }) => theme.typo.Rg_14}
`;

export const StyledForm = styled.form`
  display: contents;
`;
