import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@emotion/react';
import { Button, useToast } from '@docs-front/ui';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { postProductsExport } from '@/api/products/mutation';
import { getProductFileDownload } from '@/api/products/query';
import { getProductFileStatusPollingOptions } from '@/query/options/products';
import type { ImageItem } from './Step4ImageSelect';
import type { Language } from '@/schema/api/products/products';
import type { Theme } from '@docshunt/docs-editor-wasm';
import {
  StyledGenCenter,
  StyledSpinner,
  StyledGenCircle,
  StyledModalOverlay,
  StyledModalBox,
  StyledModalIconCircle,
  StyledModalFooter,
  StyledFileInfoBox,
  StyledBtnOutlined,
  StyledBtnFilled,
} from '../../-route.style';
import { Check, Download, FileText } from 'lucide-react';

const GEN_LABELS = [
  'SMTECH 표준 서식 분석',
  '프롬프트 및 첨부 자료 분석',
  'SMTECH DB · 우수 사례 참조 중...',
  '공공 말뭉치 기반 문장 최적화',
  '최종 검토 및 계획서 생성',
];

type StepState = 'done' | 'active' | 'pending';

interface Step6Props {
  selectedTemplateFileId: number | null;
  selectedDocFileId: number | null;
  prompt: string;
  images: ImageItem[];
  referenceFiles: File[];
  language: Language;
  documentTheme?: Theme;
  exportedProductId: number | null;
  onExportedProductIdChange: (id: number | null) => void;
  onGoHome: () => void;
}

export function Step6Generate({
  selectedTemplateFileId,
  selectedDocFileId: _selectedDocFileId,
  prompt,
  images,
  referenceFiles,
  language,
  documentTheme,
  exportedProductId,
  onExportedProductIdChange,
  onGoHome,
}: Step6Props) {
  const theme = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFileName, setDownloadFileName] = useState<string>('사업계획서_초안.hwpx');
  const hasStartedRef = useRef(false);
  const hasHandledRef = useRef(false);

  // API: 생성 요청
  const exportMutation = useMutation({
    mutationFn: () => {
      if (!selectedTemplateFileId) throw new Error('템플릿을 선택해주세요.');
      return postProductsExport({
        contents: {
          userPrompt: prompt,
          productContents: '',
          productImagesMetaData: [],
          svgSuggestions: images
            .filter((img) => img.checked)
            .map((img) => ({
              name: img.title,
              info: img.prompt,
              position: img.position,
              gen_by: img.genBy,
            })),
          templateFileId: selectedTemplateFileId,
          language,
          theme: documentTheme,
        },
        referenceFiles: referenceFiles.length > 0 ? referenceFiles : undefined,
      });
    },
    onSuccess: (result) => onExportedProductIdChange(result.data.exportedProductId),
    onError: () => {
      setFailed(true);
      toast.open({ content: '생성 요청에 실패했습니다.', duration: 3000 });
    },
  });

  // 프로토타입: 더미 4초 생성 딜레이
  useEffect(() => {
    let step = 0;
    setCurrentStep(0);
    setFailed(false);
    const timer = setInterval(() => {
      step += 1;
      setCurrentStep(step);
      if (step >= GEN_LABELS.length) {
        clearInterval(timer);
        setTimeout(() => {
          // 내 문서함에 생성 문서 추가 (초안 생성 상태로 초기화)
          localStorage.setItem('rnd_generated_title', prompt.trim().slice(0, 40) || 'AI 기반 지능형 문서 자동 생성 시스템 개발');
          const now = new Date();
          localStorage.setItem('rnd_generated_date', `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`);
          localStorage.removeItem('rnd_doc_status');
          setFailed(true); // failed를 완료 표시로 재활용
        }, 400);
      }
    }, 600);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGoHome = onGoHome;

  const handleDownload = useCallback(async () => {
    if (!exportedProductId) return;
    try {
      const blob = await getProductFileDownload(exportedProductId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowDownloadModal(true);
    } catch {
      toast.open({ content: '다운로드에 실패했습니다.', duration: 3000 });
    }
  }, [exportedProductId, downloadFileName, toast]);

  const handleQuickEdit = () => {
    // 내 문서함에 생성된 문서 추가
    localStorage.setItem('rnd_generated_title', prompt.trim().slice(0, 40) || 'AI 기반 지능형 문서 자동 생성 시스템 개발');
    localStorage.setItem('rnd_generated_date', new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', ''));
    navigate({ to: '/d/preview' as any, search: { status: '초안 생성' } as any });
  };

  if (false) {
    return (
      <StyledGenCenter>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: '#F04452',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        }}>
          <span style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 700 }}>!</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.02em', color: '#25262C' }}>
          사업계획서 생성에 실패했습니다
        </h2>
        <p style={{ fontSize: 14, color: '#B5B9C4', textAlign: 'center', lineHeight: 1.6, marginBottom: 32, letterSpacing: '-0.02em' }}>
          잠시 후 다시 시도해주세요.
        </p>
        <button
          onClick={handleGoHome}
          style={{ background: 'none', border: 'none', color: theme.color.textGray, fontSize: 14, cursor: 'pointer', padding: '8px 16px', letterSpacing: '-0.02em' }}
        >
          처음으로
        </button>
      </StyledGenCenter>
    );
  }

  if (failed) {
    return (
      <>
        <StyledGenCenter>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: theme.color.main,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
          }}>
            <Check size={28} color={theme.color.white} strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.02em', color: '#25262C' }}>
            작성이 완료되었습니다
          </h2>
          <p style={{ fontSize: 14, color: '#6E7687', textAlign: 'center', lineHeight: 1.6, marginBottom: 20, letterSpacing: '-0.02em' }}>
            작성된 연구개발계획서를 확인하세요.
          </p>
          <div style={{ fontSize: 13, color: '#6E7687', lineHeight: 1.5, marginBottom: 28, padding: '14px 18px', background: '#FAFAFC', borderRadius: 8, maxWidth: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#6E7687', flexShrink: 0, fontSize: 14 }}>ⓘ</span>
            본 결과물은 AI 기반 참고용 초안이며, 사용자의 검토 및 보완이 필요합니다.
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="outlined" size="large" onClick={onGoHome}>
              처음으로
            </Button>
            <Button variant="filled" size="large" onClick={handleQuickEdit}>
              내용 확인
            </Button>
          </div>
          {/* <button
            onClick={handleGoHome}
            style={{ marginTop: 16, background: 'none', border: 'none', color: theme.color.textGray, fontSize: 14, cursor: 'pointer', padding: '8px 16px', letterSpacing: '-0.02em' }}
          >
            처음으로
          </button> */}

        </StyledGenCenter>

        {/* ─── 모달 6: 다운로드 완료 ──────────────────────────── */}
        {showDownloadModal && (
          <StyledModalOverlay onClick={() => setShowDownloadModal(false)}>
            <StyledModalBox $width={420} onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
              <StyledModalIconCircle $variant="success">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </StyledModalIconCircle>

              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em', color: '#25262C' }}>
                사업계획서 다운로드 완료
              </div>
              <div style={{ fontSize: 14, color: '#6E7687', letterSpacing: '-0.02em', lineHeight: 1.6 }}>
                파일이 성공적으로 다운로드되었습니다.
              </div>

              <StyledFileInfoBox>
                <FileText size={16} color="#2C81FC" />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#25262C', letterSpacing: '-0.02em' }}>{downloadFileName}</span>
              </StyledFileInfoBox>

              <StyledModalFooter style={{ justifyContent: 'center', marginTop: 16 }}>
                <StyledBtnOutlined onClick={() => { setShowDownloadModal(false); handleQuickEdit(); }}>
                  바로수정(beta)
                </StyledBtnOutlined>
                <StyledBtnFilled onClick={() => setShowDownloadModal(false)}>확인</StyledBtnFilled>
              </StyledModalFooter>
            </StyledModalBox>
          </StyledModalOverlay>
        )}
      </>
    );
  }

  return (
    <StyledGenCenter>
      <StyledSpinner />
      <h2 style={{
        fontSize: 20,
        fontWeight: 600,
        marginBottom: 12,
        letterSpacing: '-0.02em',
        color: '#25262C',
      }}>
        문서를 생성하고 있습니다
      </h2>
      <p style={{
        fontSize: 14,
        color: '#B5B9C4',
        textAlign: 'center',
        lineHeight: 1.6,
        marginBottom: 32,
        letterSpacing: '-0.02em',
      }}>
        양식과 프롬프트를 분석하여 문서를 생성 중입니다.<br />
        완료되면 자동으로 에디터로 이동합니다.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {GEN_LABELS.map((label, i) => {
          const state: StepState =
            i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending';

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
              <StyledGenCircle $state={state}>
                {state === 'done' ? <Check size={12} strokeWidth={3} /> : i + 1}
              </StyledGenCircle>
              <span style={{
                color: state === 'pending' ? '#B5B9C4' : '#25262C',
                fontWeight: state === 'active' ? 500 : 400,
                fontSize: 14,
                letterSpacing: '-0.02em',
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </StyledGenCenter>
  );
}
