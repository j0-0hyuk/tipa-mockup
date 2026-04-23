import styled from '@emotion/styled';

/* ===== Layout ===== */
export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const StyledContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(180deg, #EEF3FB 0%, #F7F9FC 100%);
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`;

export const StyledStepContent = styled.div`
  padding: 40px 32px;
  max-width: 1080px;
  margin: 24px auto;
  width: 100%;
  background: #FBFCFE;
  border: 1px solid #EEF1F5;
  border-radius: 16px;
  box-shadow: 0 32px 80px -24px rgba(15, 23, 42, 0.25), 0 12px 32px -8px rgba(15, 23, 42, 0.1);

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

/* ===== Step Title ===== */
export const StyledStepTitle = styled.h2`
  ${({ theme }) => theme.typo.Sb_24}
  color: ${({ theme }) => theme.color.black};
  margin-bottom: 24px;
`;

export const StyledSectionTitle = styled.h3`
  ${({ theme }) => theme.typo.Sb_16}
  color: ${({ theme }) => theme.color.black};
  margin-bottom: 12px;
`;

/* ===== Textarea ===== */
export const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  border: 1px solid #EEF1F5;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.6;
  letter-spacing: -0.02em;
  font-family: inherit;
  color: ${({ theme }) => theme.color.black};
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  resize: vertical;
  outline: none;
  transition: all 0.15s;

  &:focus {
    border-color: #2C81FC;
    box-shadow: 0 0 0 2px rgba(44, 129, 252, 0.12);
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }
`;

/* ===== Drop Zone ===== */
export const StyledDropZone = styled.div<{ $dragging?: boolean }>`
  border: 2px dashed ${({ $dragging, theme }) => ($dragging ? theme.color.main : theme.color.borderLightGray)};
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  color: ${({ theme }) => theme.color.textPlaceholder};
  ${({ theme }) => theme.typo.Rg_14}
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $dragging }) => ($dragging ? '#EAF3FF' : 'transparent')};

  &:hover {
    border-color: ${({ theme }) => theme.color.main};
    background: #EAF3FF;
  }
`;

/* ===== AI Feedback Box ===== */
export const StyledFeedbackBox = styled.div`
  background: #FFF8E1;
  border-left: 3px solid #FFB300;
  border-radius: 6px;
  padding: 14px 18px;
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.6;
  letter-spacing: -0.02em;
  color: #5D4E37;

  @keyframes feedbackFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  animation: feedbackFadeIn 0.3s ease;
`;

export const StyledAiSuggestionBox = styled.div`
  background: #EAF3FF;
  border-left: 3px solid #2C81FC;
  border-radius: 6px;
  padding: 14px 18px;
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.6;
  letter-spacing: -0.02em;
  color: #1A3A6B;

  @keyframes feedbackFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  animation: feedbackFadeIn 0.3s ease;
`;

/* ===== Step 2 Item Card ===== */
export const StyledReviewCard = styled.div`
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderLightGray};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
`;

export const StyledReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const StyledReviewIndex = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
`;

/* ===== Step 3: Split view ===== */
export const StyledSplitView = styled.div`
  display: flex;
  gap: 24px;
  min-height: 600px;
`;

export const StyledMarkdownPane = styled.div`
  flex: 1;
  background: #FFFFFF;
  border: 1px solid #D8DCE4;
  border-radius: 4px;
  padding: 16px 64px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.9;
  letter-spacing: -0.01em;
  color: #1A1D23;
  box-shadow:
    0 1px 3px rgba(15, 23, 42, 0.06),
    0 6px 24px rgba(15, 23, 42, 0.04),
    4px 0 0 0 #FFFFFF,
    5px 0 0 0 #E2E5EB,
    8px 0 0 0 #FFFFFF,
    9px 0 0 0 #EAEDF1;

  h1 {
    font-size: 24px;
    font-weight: 700;
    margin: 36px 0 18px;
    color: #1A1D23;
    padding-bottom: 10px;
    border-bottom: 2px solid #1A1D23;
  }

  h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 30px 0 14px;
    color: #1A1D23;
    padding-bottom: 8px;
    border-bottom: 1px solid #D8DCE4;
  }

  h3 {
    font-size: 17px;
    font-weight: 700;
    margin: 24px 0 12px;
    color: #2A2D35;
  }

  p {
    margin: 0 0 16px;
    text-align: justify;
    word-break: keep-all;
    line-height: 2.1;
  }

  ul {
    list-style-type: none;
    padding-left: 20px;
    margin: 0 0 16px;
    line-height: 2.1;

    > li::before {
      content: '● ';
      display: inline-block;
      width: 1.5em;
      margin-left: -1.5em;
      font-size: 8px;
      vertical-align: middle;
    }
  }

  ul ul {
    padding-left: 20px;
    margin: 4px 0;

    > li::before {
      content: '○ ';
      font-size: 8px;
    }
  }

  li {
    margin-bottom: 8px;
  }

  strong {
    font-weight: 600;
  }

  hr {
    border: none;
    border-top: 1px solid #D8DCE4;
    margin: 32px 0;
  }

  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    margin: 16px 0 24px;
    font-size: 13px;
    line-height: 1.7;
    letter-spacing: -0.02em;
    word-break: break-word;
  }

  thead th {
    background: #F4F5F7;
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
    color: #2A2D35;
    border-bottom: 2px solid #D8DCE4;

    &:first-of-type {
      width: 15%;
    }
  }

  tbody td {
    padding: 10px 14px;
    border-bottom: 1px solid #EAEDF1;
    color: #1A1D23;
    vertical-align: top;
  }

  tbody tr:last-child td {
    border-bottom: 1px solid #EAEDF1;
  }
`;

export const StyledToolPanel = styled.div`
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StyledToolButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${({ $active }) => ($active ? '#2C81FC' : '#EEF1F5')};
  border-radius: 10px;
  background: ${({ $active }) => ($active ? '#E7F0FF' : '#FFFFFF')};
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  color: ${({ $active, theme }) => ($active ? theme.color.main : theme.color.black)};
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.02em;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  text-align: left;

  &:hover {
    border-color: #2C81FC;
    background: #E7F0FF;
    box-shadow: 0 4px 12px -4px rgba(44, 129, 252, 0.2);
  }
`;

/* ===== Step 4: Result panels ===== */
export const StyledResultContainer = styled.div`
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.borderLightGray};
  border-radius: 12px;
  padding: 32px;
  min-height: 400px;
`;

export const StyledResultTitle = styled.h3`
  ${({ theme }) => theme.typo.Sb_20}
  color: ${({ theme }) => theme.color.black};
  margin-bottom: 20px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  letter-spacing: -0.02em;

  th {
    background: #FAFAFC;
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: #596070;
    border-bottom: 1px solid #E3E4E8;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #F1F1F4;
    color: #25262C;
  }

  tr:hover td {
    background: #FAFAFC;
  }
`;

export const StyledCodeCard = styled.div`
  background: #FAFAFC;
  border: 1px solid ${({ theme }) => theme.color.borderLightGray};
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 12px;
`;

export const StyledDiffBlock = styled.div`
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  font-size: 15px;
  line-height: 1.7;
  letter-spacing: -0.02em;
`;

export const StyledDiffOld = styled.div`
  background: #FFECEE;
  padding: 14px 18px;
  color: #B91C1C;
  text-decoration: line-through;
`;

export const StyledDiffNew = styled.div`
  background: #E6F9EE;
  padding: 14px 18px;
  color: #15803D;
`;

export const StyledListItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  background: #FAFAFC;
  border-radius: 8px;
  margin-bottom: 10px;
`;

/* ===== Spinner ===== */
export const StyledSpinnerRing = styled.div`
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

/* ===== Loading Overlay ===== */
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

/* ===== File list ===== */
export const StyledFileChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #FAFAFC;
  border: 1px solid #E3E4E8;
  border-radius: 6px;
  font-size: 13px;
  color: #25262C;
  letter-spacing: -0.02em;
`;

export const StyledFileRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #B5B9C4;
  padding: 2px;
  display: flex;
  align-items: center;

  &:hover { color: #F04452; }
`;

/* ===== Section Page Navigation ===== */
export const StyledPageIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const StyledPageButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ $disabled }) => ($disabled ? '#EEF1F5' : '#D8DCE4')};
  background: ${({ $disabled }) => ($disabled ? '#F9FAFB' : '#FFFFFF')};
  color: ${({ $disabled }) => ($disabled ? '#D0D5DD' : '#596070')};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  transition: all 0.15s;

  &:hover {
    ${({ $disabled }) => !$disabled && `
      border-color: #2C81FC;
      color: #2C81FC;
      background: #EEF4FF;
    `}
  }
`;

export const StyledPageInfo = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: #25262C;
  letter-spacing: -0.02em;
`;

/* ===== View Tabs ===== */
export const StyledViewTabs = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 16px;
  border: 1px solid #E3E4E8;
  border-radius: 10px;
  overflow: hidden;
  width: fit-content;
`;

export const StyledViewTab = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ $active }) => ($active ? '#FFFFFF' : '#596070')};
  background: ${({ $active }) => ($active ? '#2C81FC' : '#FFFFFF')};
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  letter-spacing: -0.02em;

  &:hover {
    ${({ $active }) => !$active && `
      background: #F4F6F8;
    `}
  }
`;

/* ===== Slide Placeholder (16:9 PPT ratio) ===== */
export const StyledSlidePlaceholder = styled.div`
  flex: 1;
  aspect-ratio: 16 / 9;
  background: #FFFFFF;
  border: 1px solid #D8DCE4;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #B5B9C4;
  font-size: 15px;
  letter-spacing: -0.02em;
  box-shadow:
    0 1px 3px rgba(15, 23, 42, 0.06),
    0 6px 24px rgba(15, 23, 42, 0.04);
`;
