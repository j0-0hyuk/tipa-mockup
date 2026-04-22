import styled from '@emotion/styled';

export const StyledStartContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const StyledContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`;

export const StyledStepContent = styled.div`
  padding: 40px 0;
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  animation: fadeIn 0.25s ease;
`;

export const StyledFooter = styled.footer`
  padding: 16px 0;
  border-top: 1px solid ${({ theme }) => theme.color.borderLightGray};
  flex-shrink: 0;
  background: ${({ theme }) => theme.color.white};
`;

export const StyledFooterInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledInfoBanner = styled.div`
  background: #EEF4FF;
  border: 1px solid #C7DBFF;
  border-radius: 8px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 19.5px;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: #1E5BB8;
`;

export const StyledPageTitle = styled.h1`
  ${({ theme }) => theme.typo.Sb_24}
  color: ${({ theme }) => theme.color.black};
`;

export const StyledStepTitle = styled.h2`
  ${({ theme }) => theme.typo.Sb_20}
  color: ${({ theme }) => theme.color.black};
  text-align: left;
  margin-bottom: 20px;

  .highlight {
    color: ${({ theme }) => theme.color.main};
  }
`;

export const StyledSectionTitle = styled.h3`
  ${({ theme }) => theme.typo.Sb_16}
  color: ${({ theme }) => theme.color.black};
  margin-bottom: 16px;
`;

export const StyledDescText = styled.p`
  ${({ theme }) => theme.typo.Rg_13}
  color: ${({ theme }) => theme.color.textGray};
  margin-bottom: 12px;
  line-height: 1.5;
`;

export const StyledSelectedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.color.bgLightGray};
  color: ${({ theme }) => theme.color.black};
  ${({ theme }) => theme.typo.Md_13}
  margin-bottom: 20px;

  .count-highlight {
    color: ${({ theme }) => theme.color.main};
    font-weight: 600;
  }
`;

export const StyledDropZone = styled.div`
  border: 2px dashed #EEF1F5;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  color: ${({ theme }) => theme.color.textPlaceholder};
  ${({ theme }) => theme.typo.Rg_14}
  background: #FBFCFE;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #2C81FC;
    background: #E7F0FF;
    box-shadow: 0 4px 12px -4px rgba(44, 129, 252, 0.2);
  }
`;

export const StyledImgInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.color.borderLightGray};
  border-radius: 8px;
  font-size: 13px;
  letter-spacing: -0.02em;
  font-family: inherit;
  color: ${({ theme }) => theme.color.black};
  background: ${({ theme }) => theme.color.white};
  transition: border-color 0.15s;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.color.main};
    box-shadow: 0 0 0 2px rgba(44, 129, 252, 0.12);
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }
`;

export const StyledIconBtnText = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.color.textPlaceholder};
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.color.bgGray};
    color: ${({ theme }) => theme.color.textGray};
  }
`;

export const StyledAddLink = styled.span<{ $disabled?: boolean }>`
  color: ${({ $disabled, theme }) => ($disabled ? theme.color.textPlaceholder : theme.color.main)};
  font-size: 14px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  font-weight: 500;
  margin-top: 16px;
  display: inline-block;
  letter-spacing: -0.02em;

  &:hover {
    text-decoration: ${({ $disabled }) => ($disabled ? 'none' : 'underline')};
  }
`;

export const StyledSettingCard = styled.div`
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderLightGray};
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
`;

export const StyledKodataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: ${({ theme }) => theme.color.bgLightGray};
  border-radius: 8px;
  margin-bottom: 24px;
`;

export const StyledGenCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
`;

export const StyledSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${({ theme }) => theme.color.borderLightGray};
  border-top-color: ${({ theme }) => theme.color.main};
  border-radius: 50%;
  margin-bottom: 24px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  animation: spin 1s linear infinite;
`;

export const StyledTableRow = styled.tr<{ $selected?: boolean }>`
  cursor: pointer;
  transition: background 0.1s;
  background: ${({ $selected }) => ($selected ? '#EAF3FF' : 'transparent')};

  &:hover {
    background: ${({ $selected }) => ($selected ? '#EAF3FF' : '#FAFAFC')};
  }
`;

/* ===== DS SegmentedControl ===== */
export const StyledSeg = styled.div`
  display: inline-flex;
  background: ${({ theme }) => theme.color.bgGray};
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
`;

export const StyledSegItem = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 21px;
  letter-spacing: -0.02em;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  ${({ $active, theme }) =>
    $active
      ? `
    background: ${theme.color.white};
    color: ${theme.color.black};
    font-weight: 600;
    box-shadow: 0px 1px 2px 0px rgba(0,27,55,0.08);
  `
      : `
    background: transparent;
    color: ${theme.color.textGray};
    font-weight: 400;
  `}
`;

/* ===== DS Toggle (프로토타입 정확한 크기: 48x26) ===== */
export const StyledToggleSwitch = styled.button<{ $on: boolean }>`
  width: 48px;
  height: 26px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  transition: background 0.2s;
  background: ${({ $on, theme }) => ($on ? theme.color.main : theme.color.borderGray)};

  &::after {
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 9999px;
    background: #fff;
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? '25px' : '3px')};
    transition: left 0.2s;
    box-shadow: 0px 1px 2px 0px rgba(0,27,55,0.08);
  }
`;

/* ===== DS Select ===== */
export const StyledNativeSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  border-radius: 8px;
  font-size: 14px;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.black};
  font-family: inherit;
  background: ${({ theme }) => theme.color.white};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23B5B9C4'%3E%3Cpath d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2C81FC;
  }
`;

/* ===== Common Modal ===== */
export const StyledModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(37, 38, 44, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const StyledModalBox = styled.div<{ $width?: number }>`
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  width: ${({ $width }) => $width ?? 480}px;
  box-shadow: 0px 4px 8px 0px rgba(0, 27, 55, 0.12);
`;

export const StyledModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const StyledModalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #25262c;
`;

export const StyledModalClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6e7687;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f1f4;
  }
`;

export const StyledModalDesc = styled.div`
  font-size: 14px;
  color: #6e7687;
  letter-spacing: -0.02em;
  line-height: 1.6;
  margin-bottom: 20px;
`;

export const StyledModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`;

export const StyledModalIconCircle = styled.div<{ $variant: 'success' | 'warn' }>`
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: ${({ $variant }) =>
    $variant === 'success' ? '#E6F9EE' : '#FFECEE'};
`;

/* ===== Upload Dropzone (modal) ===== */
export const StyledModalDropzone = styled.div`
  border: 2px dashed #e3e4e8;
  border-radius: 8px;
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  margin-bottom: 20px;

  &:hover {
    border-color: #2c81fc;
    background: #eaf3ff;
  }
`;

export const StyledModalDropzoneIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #eaf3ff;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
`;

export const StyledFileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  max-height: 160px;
  overflow-y: auto;
`;

export const StyledFileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fafafc;
  border-radius: 6px;
`;

export const StyledFileIcon = styled.div`
  min-width: 40px;
  height: 32px;
  padding: 0 6px;
  background: #eaf3ff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StyledFileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const StyledFileName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #25262c;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.02em;
`;

export const StyledFileSize = styled.div`
  font-size: 12px;
  color: #6e7687;
  letter-spacing: -0.02em;
`;

export const StyledFileRemoveBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #b5b9c4;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #f04452;
  }
`;

/* ===== Request Form ===== */
export const StyledRequestField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;

  label {
    font-size: 13px;
    font-weight: 500;
    color: #596070;
    letter-spacing: -0.02em;
  }
`;

export const StyledDsInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e3e4e8;
  border-radius: 8px;
  font-size: 14px;
  letter-spacing: -0.02em;
  color: #25262c;
  font-family: inherit;
  background: #ffffff;
  transition: border-color 0.15s;
  outline: none;

  &:focus {
    border-color: #2c81fc;
    box-shadow: 0 0 0 2px rgba(44, 129, 252, 0.12);
  }

  &::placeholder {
    color: #b5b9c4;
  }
`;

/* ===== Modal Action Buttons ===== */
export const StyledBtnOutlined = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 21px;
  font-weight: 600;
  letter-spacing: -0.02em;
  cursor: pointer;
  border: 1px solid #e3e4e8;
  background: #ffffff;
  color: #596070;
  font-family: inherit;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover {
    background: #fafafc;
  }
`;

export const StyledBtnFilled = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 21px;
  font-weight: 600;
  letter-spacing: -0.02em;
  cursor: pointer;
  border: none;
  background: #2c81fc;
  color: #ffffff;
  font-family: inherit;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover {
    background: #0c52b8;
  }

  &:disabled {
    background: #f1f1f4;
    color: #b5b9c4;
    cursor: not-allowed;
  }
`;

export const StyledBtnWarning = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 21px;
  font-weight: 600;
  letter-spacing: -0.02em;
  cursor: pointer;
  border: none;
  background: #f04452;
  color: #ffffff;
  font-family: inherit;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover {
    filter: brightness(0.9);
  }
`;

/* ===== Loading Popup ===== */
export const StyledLoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(37, 38, 44, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const StyledLoadingPopup = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 40px 40px 32px;
  width: 520px;
  box-shadow: 0px 4px 8px 0px rgba(0, 27, 55, 0.12);
  text-align: center;
`;

export const StyledLoadingSpinnerRing = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid #f1f1f4;
  border-top-color: #2c81fc;
  border-radius: 50%;
  margin: 0 auto 24px;

  @keyframes spinRing {
    to { transform: rotate(360deg); }
  }
  animation: spinRing 1s linear infinite;
`;

export const StyledLoadingSteps = styled.div`
  text-align: left;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 20px;
`;

export const StyledLoadingStep = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StyledLoadingDot = styled.div<{ $state: 'done' | 'active' | 'pending' }>`
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ $state }) => {
    switch ($state) {
      case 'done':
        return 'background: #2c81fc;';
      case 'active':
        return `
          border: 2px solid #2c81fc;
          background: #ffffff;
          animation: dotPulse 1.5s ease infinite;
        `;
      case 'pending':
        return 'background: #f1f1f4;';
    }
  }}

  @keyframes dotPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

/* ===== Download success file info ===== */
export const StyledFileInfoBox = styled.div`
  background: #fafafc;
  border-radius: 6px;
  padding: 12px 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`;

/* ===== Gen Step Circle with pulse animation ===== */
export const StyledGenCircle = styled.div<{ $state: 'done' | 'active' | 'pending' }>`
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;

  ${({ $state, theme }) => {
    switch ($state) {
      case 'done':
        return `background: ${theme.color.main}; color: ${theme.color.white};`;
      case 'active':
        return `
          background: ${theme.color.white};
          border: 2px solid ${theme.color.main};
          color: ${theme.color.main};
          animation: genPulse 1.5s ease infinite;
        `;
      case 'pending':
        return `background: ${theme.color.bgGray}; color: ${theme.color.textPlaceholder};`;
    }
  }}

  @keyframes genPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
