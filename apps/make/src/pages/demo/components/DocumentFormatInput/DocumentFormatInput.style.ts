import styled from '@emotion/styled';

export const StyledFileDropzone = styled.div<{
  $isUploading?: boolean;
}>`
  width: 100%;
  padding: ${({ $isUploading }) => ($isUploading ? '111px 0px' : '44px 0px')};
  border-radius: 16px;
  border: 2px dashed ${({ theme }) => theme.color.textPlaceholder};
  background-color: ${({ theme }) => theme.color.bgGray};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const StyledDescription = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.color.textGray};
  margin: 0;
`;
