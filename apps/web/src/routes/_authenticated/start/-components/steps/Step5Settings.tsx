import { useState, useEffect } from 'react';
import { Flex, useToast } from '@docs-front/ui';
import type { Theme, CharacterStyle, ParagraphStyle, Style } from '@docshunt/docs-editor-wasm';
import {
  StyledPageTitle,
  StyledSectionTitle,
  StyledSettingCard,
  StyledInfoBanner,
  StyledSeg,
  StyledSegItem,
  StyledNativeSelect,
  StyledModalOverlay,
  StyledModalBox,
  StyledModalIconCircle,
  StyledModalFooter,
  StyledBtnOutlined,
  StyledBtnWarning,
} from '../../-route.style';
import styled from '@emotion/styled';

const StyledStyleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`;

const StyledStyleField = styled.div`
  label {
    display: block;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: -0.02em;
    color: #B5B9C4;
    margin-bottom: 4px;
  }
`;

const StyledPreviewBox = styled.div`
  border: 1px solid #F1F1F4;
  border-radius: 8px;
  padding: 24px;
  margin-top: 16px;
  background: #FAFAFC;
`;

const StyledPreviewH1 = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #6E7687;
  margin-bottom: 8px;
`;

const StyledPreviewH2 = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #B5B9C4;
  padding-left: 12px;
  margin-bottom: 4px;
`;

const StyledPreviewBody = styled.div`
  font-size: 13px;
  color: #B5B9C4;
  padding-left: 24px;
  margin-bottom: 4px;
`;

const StyledPreviewCaption = styled.div`
  font-size: 12px;
  color: #B5B9C4;
  padding-left: 24px;
`;

const StyledBoldBtn = styled.button`
  padding: 6px 16px;
  font-size: 13px;
  line-height: 19.5px;
  font-weight: 700;
  border-radius: 8px;
  border: 1px solid #E3E4E8;
  background: #FFFFFF;
  color: #596070;
  cursor: pointer;
  font-family: inherit;
  margin-top: 4px;
  transition: background 0.15s;

  &:hover {
    background: #FAFAFC;
  }
`;

const StyledResetBtn = styled.button`
  padding: 6px 16px;
  font-size: 13px;
  line-height: 19.5px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #E3E4E8;
  background: #FFFFFF;
  color: #596070;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.02em;
  transition: background 0.15s;

  &:hover {
    background: #FAFAFC;
  }
`;

const STYLE_TABS = ['대제목', '소제목', '본문', '캡션'] as const;

const STYLE_OPTIONS: Record<string, string[]> = {
  '크기': ['선택', '11pt', '14pt', '18pt', '24pt'],
  '굵기': ['선택', 'Regular', 'Medium', 'Bold'],
  '줄간격': ['선택', '1.0', '1.5', '2.0'],
  '글머리 기호': ['선택', '없음', '- (대시)', '• (불릿)'],
  '문단 위 간격': ['선택', '0pt', '6pt', '12pt'],
  '문단 아래 간격': ['선택', '0pt', '6pt', '12pt'],
};

const STYLE_FIELDS = ['크기', '굵기', '줄간격', '글머리 기호', '문단 위 간격', '문단 아래 간격'] as const;

type StyleValues = Record<string, Record<string, string>>;

function createInitialValues(): StyleValues {
  const values: StyleValues = {};
  for (const tab of STYLE_TABS) {
    values[tab] = {};
    for (const field of STYLE_FIELDS) {
      values[tab][field] = '선택';
    }
  }
  return values;
}

const TAB_TO_STYLE_KEY: Record<string, string> = {
  '대제목': 'l1',
  '소제목': 'l2',
  '본문': 'l3',
  '캡션': 'l4',
};

function buildThemeFromStyles(styleValues: StyleValues): Theme | undefined {
  const hasChanges = Object.values(styleValues).some(
    (tabValues) => Object.values(tabValues).some((v) => v !== '선택'),
  );
  if (!hasChanges) return undefined;

  const character: Record<string, CharacterStyle> = {};
  const paragraph: Record<string, ParagraphStyle> = {};
  const style: Record<string, Style> = {};

  STYLE_TABS.forEach((tab, i) => {
    const styleKey = TAB_TO_STYLE_KEY[tab];
    const charKey = `c_start_${i}`;
    const paraKey = `p_start_${i}`;
    const values = styleValues[tab];

    const charStyle: CharacterStyle = {};
    if (values['크기'] !== '선택') charStyle.size = parseInt(values['크기']);
    if (values['굵기'] !== '선택') charStyle.bold = values['굵기'] === 'Bold';

    const paraStyle: ParagraphStyle = {};
    if (values['줄간격'] !== '선택') paraStyle.line_spacing = Math.round(parseFloat(values['줄간격']) * 100);
    if (values['문단 위 간격'] !== '선택') paraStyle.margin_top = parseInt(values['문단 위 간격']);
    if (values['문단 아래 간격'] !== '선택') paraStyle.margin_bottom = parseInt(values['문단 아래 간격']);
    if (values['글머리 기호'] !== '선택' && values['글머리 기호'] !== '없음') {
      paraStyle.mark = values['글머리 기호'].includes('대시') ? '-' : '●';
    }

    const hasChar = Object.keys(charStyle).length > 0;
    const hasPara = Object.keys(paraStyle).length > 0;

    if (hasChar) character[charKey] = charStyle;
    if (hasPara) paragraph[paraKey] = paraStyle;

    if (hasChar || hasPara) {
      style[styleKey] = {
        character_style: hasChar ? charKey : undefined,
        paragraph_style: hasPara ? paraKey : undefined,
        border_style: undefined,
      };
    }
  });

  if (Object.keys(style).length === 0 && Object.keys(character).length === 0 && Object.keys(paragraph).length === 0) {
    return undefined;
  }

  return { character, paragraph, border: {}, style };
}

interface Step5Props {
  onThemeChange: (theme: Theme | undefined) => void;
}

export function Step5Settings({ onThemeChange }: Step5Props) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [styleValues, setStyleValues] = useState<StyleValues>(createInitialValues);
  const [showResetModal, setShowResetModal] = useState(false);

  const currentTab = STYLE_TABS[activeTab];

  const handleStyleChange = (field: string, value: string) => {
    setStyleValues(prev => ({
      ...prev,
      [currentTab]: { ...prev[currentTab], [field]: value },
    }));
  };

  useEffect(() => {
    onThemeChange(buildThemeFromStyles(styleValues));
  }, [styleValues, onThemeChange]);

  const handleResetConfirm = () => {
    setStyleValues(createInitialValues());
    setShowResetModal(false);
    toast.open({ content: '문서 스타일이 기본값으로 초기화되었습니다' });
  };

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <StyledPageTitle style={{ marginBottom: 20 }}>문서 세부 설정</StyledPageTitle>
      <StyledInfoBanner>
        <span style={{ color: '#6E7687', flexShrink: 0 }}>ⓘ</span>
        보다 완벽한 사업계획서를 위해 문서의 스타일과 데이터 연동 옵션을 확인해주세요.
      </StyledInfoBanner>

      <StyledSettingCard>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em', color: '#25262C' }}>문서 스타일</h3>
        <p style={{ fontSize: 13, color: '#B5B9C4', marginBottom: 20, letterSpacing: '-0.02em' }}>
          문서 전체에 적용되는 스타일을 설정합니다
        </p>

        <div style={{ marginBottom: 24 }}>
          <StyledSeg>
            {STYLE_TABS.map((tab, i) => (
              <StyledSegItem
                key={tab}
                $active={activeTab === i}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </StyledSegItem>
            ))}
          </StyledSeg>
        </div>

        <StyledStyleGrid>
          {STYLE_FIELDS.map((label) => (
            <StyledStyleField key={label}>
              <label>{label}</label>
              <StyledNativeSelect
                value={styleValues[currentTab][label]}
                onChange={(e) => handleStyleChange(label, e.target.value)}
              >
                {(STYLE_OPTIONS[label] ?? []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </StyledNativeSelect>
            </StyledStyleField>
          ))}
        </StyledStyleGrid>

        <div>
          <label style={{ fontSize: 12, color: '#B5B9C4', letterSpacing: '-0.02em' }}>서식</label>
          <div style={{ marginTop: 4 }}>
            <StyledBoldBtn>B</StyledBoldBtn>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <label style={{ fontSize: 12, color: '#B5B9C4', letterSpacing: '-0.02em' }}>미리보기</label>
          <StyledPreviewBox>
            <StyledPreviewH1>대제목을 입력하세요</StyledPreviewH1>
            <StyledPreviewH2>○ 부제목을 입력하세요</StyledPreviewH2>
            <StyledPreviewBody>- 본문 텍스트를 입력하세요</StyledPreviewBody>
            <StyledPreviewCaption>* 캡션을 입력하세요</StyledPreviewCaption>
          </StyledPreviewBox>
          <p style={{ fontSize: 12, color: '#B5B9C4', textAlign: 'center', marginTop: 12, letterSpacing: '-0.02em' }}>
            미리보기는 실제와 다를 수 있으며, 내려받은 파일에는 정상 적용됩니다.
          </p>
          <Flex justify="flex-end" style={{ marginTop: 12 }}>
            <StyledResetBtn onClick={() => setShowResetModal(true)}>기본값 초기화</StyledResetBtn>
          </Flex>
        </div>
      </StyledSettingCard>

      {/* ─── 모달 5: 초기화 확인 ─────────────────────────────── */}
      {showResetModal && (
        <StyledModalOverlay onClick={() => setShowResetModal(false)}>
          <StyledModalBox $width={400} onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <StyledModalIconCircle $variant="warn">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F04452" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </StyledModalIconCircle>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em', color: '#25262C' }}>
              스타일을 초기화하시겠습니까?
            </div>
            <div style={{ fontSize: 14, color: '#6E7687', lineHeight: 1.6, letterSpacing: '-0.02em' }}>
              모든 문서 스타일 설정이 기본값으로 되돌아갑니다.<br />이 작업은 되돌릴 수 없습니다.
            </div>
            <StyledModalFooter style={{ justifyContent: 'center' }}>
              <StyledBtnOutlined onClick={() => setShowResetModal(false)}>취소</StyledBtnOutlined>
              <StyledBtnWarning onClick={handleResetConfirm}>초기화</StyledBtnWarning>
            </StyledModalFooter>
          </StyledModalBox>
        </StyledModalOverlay>
      )}
    </div>
  );
}
