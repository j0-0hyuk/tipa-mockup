import styled from '@emotion/styled';

export const StyledWarningText = styled.p`
  ${({ theme }) => theme.typo.Rg_12}
  color: ${({ theme }) => theme.color.textGray};
  white-space: pre-wrap;
  text-align: center;
<<<<<<< HEAD
  line-height: 1.5;
=======
>>>>>>> cca333c (feat: hwp 파일 지원 - 내보내기, 파일 추가 (#384))
`;

export const StyledDropZone = styled.div<{ isDragOver?: boolean }>`
  border: 1px dashed ${({ theme }) => theme.color.textPlaceholder};
  border-radius: 8px;
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: ${({ isDragOver, theme }) =>
    isDragOver ? theme.color.bgGray : '#f7f8f8'};
  cursor: pointer;
  transition: background-color 0.2s ease;
  align-self: stretch;

  &:hover {
    opacity: 0.7;
  }
`;

export const StyledError = styled.span`
  color: ${({ theme }) => theme.color.error};
  ${({ theme }) => theme.typo.Sb_16}
`;

export const StyledDropZoneLabel = styled.div<{ $useLanguage?: string }>`
  color: ${({ theme }) => theme.color.bgDarkGray};
  text-align: center;

  ${({ theme }) => theme.typo.Md_13}

  text-decoration-style: solid;
  text-decoration-skip-ink: none;
  text-decoration-thickness: auto;
  text-underline-position: from-font;
  ${({ $useLanguage }) =>
    $useLanguage === 'en' &&
    `
    text-decoration: none;
  `}
`;

export const StyledDropZoneDescription = styled.div`
  color: ${({ theme }) => theme.color.chartRed};

  ${({ theme }) => theme.typo.Md_13}

  & > .emphasize {
    color: ${({ theme }) => theme.color.main};
  }
`;
