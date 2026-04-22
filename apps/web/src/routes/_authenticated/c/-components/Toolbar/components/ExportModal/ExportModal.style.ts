import { StyledRadioButton } from '@docs-front/ui';
import { StyledUploadedFile } from '@/routes/_authenticated/c/-components/Toolbar/components/deprecated/TemplateExportModal/components/ExportDrawerFormfield/ExportDrawerFormfield.style';
import styled from '@emotion/styled';

export const StyledModal = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  background: white;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: 12px;
  padding: 8px;
  z-index: 1000;
  height: fit-content;
  width: fit-content;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.15s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const StyledMenuItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 7.5px 12px;
  cursor: pointer;
  border-radius: 4px;
  background: white;
  white-space: nowrap;
  ${({ theme }) => theme.typo.Md_14}
  color: ${({ theme }) => theme.color.black};

  &:hover {
    background: ${({ theme }) => theme.color.bgBlueGray};
  }
`;

export const StyledSectionLabel = styled.div`
  color: ${({ theme }) => theme.color.black};

  ${({ theme }) => theme.typo.Md_14}
`;
export const StyledRadioContainerGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;

export const StyledRadioContainer = styled(StyledUploadedFile)`
  width: 100%;
  border: 1.2px solid ${({ theme }) => theme.color.borderLightGray};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    border-color: ${({ theme }) => theme.color.borderGray};
    background: ${({ theme }) => theme.color.bgGray};
  }

  &[data-state='checked'] {
    border: 1.2px solid ${({ theme }) => theme.color.main};
    background: ${({ theme }) => theme.color.bgMain};

    ${StyledRadioButton} {
      border: 1px solid ${({ theme }) => theme.color.main};
    }

    &:hover {
      border-color: ${({ theme }) => theme.color.main};
      background: ${({ theme }) => theme.color.bgMain};
    }
  }
`;

export const StyledRadioLabel = styled.div<{ isSm?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  color: ${({ theme }) => theme.color.black};
  ${({ theme, isSm }) => (isSm ? theme.typo.Rg_13 : theme.typo.Md_14)}
`;
export const StyledFormfieldLabel = styled.div`
  text-align: left;
  color: ${({ theme }) => theme.color.textGray};
  ${({ theme }) => theme.typo.Md_13}
`;
