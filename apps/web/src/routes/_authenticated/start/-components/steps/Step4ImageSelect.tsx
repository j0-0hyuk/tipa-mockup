import { useTheme } from '@emotion/react';
import { Checkbox } from '@docs-front/ui';
import {
  StyledStepTitle,
  StyledInfoBanner,
  StyledImgInput,
  StyledIconBtnText,
  StyledAddLink,
} from '../../-route.style';
import { X } from 'lucide-react';

export interface ImageItem {
  title: string;
  prompt: string;
  position: string;
  genBy: 'ai' | 'human';
  checked: boolean;
}

interface Step4Props {
  images: ImageItem[];
  onImagesChange: (imgs: ImageItem[]) => void;
  templateName: string;
}

export function Step4ImageSelect({ images, onImagesChange, templateName }: Step4Props) {
  const theme = useTheme();

  const toggleCheck = (i: number) => {
    onImagesChange(images.map((img, idx) => idx === i ? { ...img, checked: !img.checked } : img));
  };

  const updatePrompt = (i: number, value: string) => {
    onImagesChange(images.map((img, idx) => idx === i ? { ...img, prompt: value } : img));
  };

  const updateTitle = (i: number, value: string) => {
    onImagesChange(images.map((img, idx) => idx === i ? { ...img, title: value } : img));
  };

  const removeImage = (i: number) => {
    onImagesChange(images.filter((_, idx) => idx !== i));
  };

  const addImage = () => {
    if (images.length >= 10) return;
    onImagesChange([
      ...images,
      { title: '', prompt: '', position: '', genBy: 'human', checked: true },
    ]);
  };

  const checkedCount = images.filter(img => img.checked).length;

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <StyledStepTitle>
        <span className="highlight">'{templateName}'</span>
        <br />
        시각 자료(이미지) 구성
      </StyledStepTitle>

      <StyledInfoBanner style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#6E7687', flexShrink: 0, fontSize: 14 }}>&#9432;</span>
          AI 추천 이미지 최대 10장. 항목 추가·프롬프트 수정 가능.
        </span>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 12px',
          borderRadius: 9999,
          background: '#FFFFFF',
          color: '#25262C',
          fontSize: 13,
          fontWeight: 500,
          flexShrink: 0,
        }}>
          <span style={{ color: theme.color.main, fontWeight: 600 }}>{checkedCount}</span>
          / 10
        </span>
      </StyledInfoBanner>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: theme.color.bgLightGray }}>
            <th style={{ ...thStyle, width: 55, whiteSpace: 'nowrap' }}>선택</th>
            <th style={{ ...thStyle, width: 150 }}>이미지 제목</th>
            <th style={thStyle}>생성 프롬프트 (AI에게 내리는 명령)</th>
            <th style={{ ...thStyle, width: 60 }}></th>
          </tr>
        </thead>
        <tbody>
          {images.map((img, i) => (
            <tr
              key={i}
              style={{
                background: 'transparent', // #19: 선택된 항목 포인트 컬러 제거
                transition: 'background 0.1s',
              }}
            >
              <td style={tdStyle}>
                <Checkbox checked={img.checked} onCheckedChange={() => toggleCheck(i)} />
              </td>
              <td style={tdStyle}>
                <input
                  value={img.title}
                  onChange={(e) => updateTitle(i, e.target.value)}
                  style={{
                    border: 'none',
                    background: 'none',
                    font: 'inherit',
                    fontSize: 13,
                    width: '100%',
                    padding: 0,
                    outline: 'none',
                    fontWeight: 500,
                    // #19: 선택 여부와 관계없이 포인트 컬러 제거
                    color: '#25262C',
                    letterSpacing: '-0.02em',
                    cursor: 'text',
                  }}
                />
              </td>
              <td style={tdStyle}>
                {/* #19: 입력창 클릭 시에만 파란 테두리 (StyledImgInput에 이미 :focus 스타일 있음) */}
                <StyledImgInput
                  value={img.prompt}
                  onChange={(e) => updatePrompt(i, e.target.value)}
                  placeholder="이미지 생성 프롬프트를 입력하세요"
                />
              </td>
              <td style={tdStyle}>
                <StyledIconBtnText onClick={() => removeImage(i)} title="삭제">
                  <X size={16} />
                </StyledIconBtnText>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <StyledAddLink $disabled={images.length >= 10} onClick={addImage}>
        + 새로운 이미지 항목 추가
      </StyledAddLink>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px 16px',
  fontWeight: 500,
  fontSize: 13,
  lineHeight: '19.5px',
  letterSpacing: '-0.02em',
  color: '#6E7687',
  borderBottom: '1px solid #E3E4E8',
};
const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  borderBottom: '1px solid #F1F1F4',
  verticalAlign: 'middle',
  fontSize: 13,
  letterSpacing: '-0.02em',
};
