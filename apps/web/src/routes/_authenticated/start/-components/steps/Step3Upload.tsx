import { useState, useRef, useMemo } from 'react';
import { useTheme } from '@emotion/react';
import { Flex, Spinner, useToast } from '@docs-front/ui';
import { useQuery } from '@tanstack/react-query';
import { getProductsFilesOptions } from '@/query/options/products';
import type { ProductFilePathMapContents } from '@/schema/api/products/products';
import {
  StyledStepTitle,
  StyledInfoBanner,
  StyledSectionTitle,
  StyledDropZone,
  StyledModalOverlay,
  StyledModalBox,
  StyledModalHeader,
  StyledModalTitle,
  StyledModalClose,
  StyledModalDesc,
  StyledModalFooter,
  StyledModalDropzone,
  StyledModalDropzoneIcon,
  StyledFileList,
  StyledFileItem,
  StyledFileIcon,
  StyledFileInfo,
  StyledFileName,
  StyledFileSize,
  StyledFileRemoveBtn,
  StyledBtnOutlined,
  StyledBtnFilled,
} from '../../-route.style';
import { Upload, FileEdit, X, FileText, Star, SquarePen } from 'lucide-react';
import { SegmentedControlRoot, SegmentedControlItem } from '@bichon/ds';

const BG_GRAY = '#F1F1F4';
const TEXT_3 = '#6E7687';

const PAGE_SIZE = 10;

interface Step3Props {
  hasUpload: boolean;
  onUploadChange: (val: boolean) => void;
  selectedDocFileId: number | null;
  onSelectDoc: (i: number | null) => void;
  referenceFiles: File[];
  onReferenceFilesChange: (files: File[]) => void;
  templateName: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function isFormType(doc: ProductFilePathMapContents): boolean {
  if (doc.filePath && doc.filePath.toLowerCase().endsWith('.hwpx')) return true;
  if (doc.templateMeta) return true;
  return false;
}

function extractDisplayName(doc: ProductFilePathMapContents): string {
  if (doc.filePath) {
    const parts = doc.filePath.split('/');
    return parts[parts.length - 1] || '문서';
  }
  return '문서';
}

export function Step3Upload({ hasUpload, onUploadChange, selectedDocFileId, onSelectDoc, referenceFiles, onReferenceFilesChange, templateName }: Step3Props) {
  const theme = useTheme();
  const toast = useToast();

  // API: 내 문서 목록 (fileType 필터 제거 → exports 데이터 사용)
  const { data: filesData, isLoading } = useQuery(getProductsFilesOptions({ size: 100 }));

  const docList = useMemo(() => {
    return filesData?.data.exports?.content ?? [];
  }, [filesData]);

  const [currentPage, setCurrentPage] = useState(1);
  const [docFilter, setDocFilter] = useState<'all' | 'form' | 'draft'>('form');

  // 모달 3: 참고 자료 업로드
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [modalFiles, setModalFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSelect = (productFileId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectDoc(selectedDocFileId === productFileId ? null : productFileId);
  };

  const handleModalFileChange = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    setModalFiles((prev) => {
      const combined = [...prev, ...incoming];
      const maxAllowed = 3 - referenceFiles.length;
      if (combined.length > maxAllowed) {
        toast.open({ content: '최대 3개까지 첨부 가능합니다.', duration: 2000 });
        return combined.slice(0, Math.max(0, maxAllowed));
      }
      return combined;
    });
  };

  const handleUploadConfirm = () => {
    if (modalFiles.length === 0) return;
    onReferenceFilesChange([...referenceFiles, ...modalFiles]);
    setShowUploadModal(false);
    setModalFiles([]);
    onUploadChange(true);
    toast.open({ content: `${modalFiles.length}개 파일이 추가되었습니다.`, duration: 2000 });
  };

  const filteredDocs = useMemo(() => {
    if (docFilter === 'all') return docList;
    return docList.filter((doc) => docFilter === 'form' ? isFormType(doc) : !isFormType(doc));
  }, [docList, docFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / PAGE_SIZE));
  const pagedDocs = filteredDocs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <StyledStepTitle>
        <span className="highlight">'{templateName}'</span>
        <br />
        작성을 위한 자료를 업로드해주세요
      </StyledStepTitle>

      <StyledInfoBanner>
        <span style={{ color: '#6E7687', flexShrink: 0, fontSize: 14 }}>&#9432;</span>
        연구개발계획서 작성에 활용할 파일들을 업로드하는
        단계입니다.
      </StyledInfoBanner>

      <StyledSectionTitle>파일 업로드하기</StyledSectionTitle>
      {/* 드롭존 클릭 → 모달 3 열기 */}
      <StyledDropZone
        onClick={() => setShowUploadModal(true)}
        style={hasUpload ? { borderColor: theme.color.main, background: theme.color.bgMain } : undefined}
      >
        <Upload
          size={28}
          color={hasUpload ? theme.color.main : theme.color.borderLightGray}
          style={{ marginBottom: 12 }}
        />
        {hasUpload ? (
          <div style={{ color: theme.color.main, fontWeight: 500 }}>
            {referenceFiles.length}개 파일이 업로드되었습니다
          </div>
        ) : (
          <>
            <div>클릭하여 파일을 선택하거나 여기로 드래그해주세요</div>
            <div style={{ fontSize: 12, color: theme.color.textPlaceholder, marginTop: 8 }}>
              (pdf, docx, hwp, hwpx에 한하여 30mb 이내 3개까지 첨부 가능)
            </div>
          </>
        )}
      </StyledDropZone>

      {/* 기존 작성 문서 불러오기 섹션 — 목업에서 숨김 */}

      {/* ─── 모달 3: 참고 자료 업로드 ───────────────────────── */}
      {showUploadModal && (
        <StyledModalOverlay onClick={() => setShowUploadModal(false)}>
          <StyledModalBox $width={520} onClick={(e) => e.stopPropagation()}>
            <StyledModalHeader>
              <StyledModalTitle>참고 자료 업로드</StyledModalTitle>
              <StyledModalClose onClick={() => setShowUploadModal(false)}>
                <X size={20} />
              </StyledModalClose>
            </StyledModalHeader>

            <StyledModalDesc>
              기존에 작성한 사업계획서나 참고 자료를 업로드하세요. 최대 3개까지 첨부 가능합니다.
            </StyledModalDesc>

            <StyledModalDropzone
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleModalFileChange(e.dataTransfer.files); }}
            >
              <StyledModalDropzoneIcon>
                <Upload size={24} color="#2C81FC" />
              </StyledModalDropzoneIcon>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#25262C', marginBottom: 4, letterSpacing: '-0.02em' }}>
                클릭하여 파일을 선택하거나 여기로 드래그해주세요
              </div>
              <div style={{ fontSize: 13, color: '#B5B9C4', letterSpacing: '-0.02em' }}>
                pdf, docx, hwp, hwpx (30MB 이내, 최대 3개)
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".hwp,.hwpx,.docx,.pdf"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleModalFileChange(e.target.files)}
              />
            </StyledModalDropzone>

            {modalFiles.length > 0 && (
              <StyledFileList>
                {modalFiles.map((file, idx) => (
                  <StyledFileItem key={idx}>
                    <StyledFileIcon>
                      <FileText size={16} color="#2C81FC" />
                    </StyledFileIcon>
                    <StyledFileInfo>
                      <StyledFileName>{file.name}</StyledFileName>
                      <StyledFileSize>{formatFileSize(file.size)}</StyledFileSize>
                    </StyledFileInfo>
                    <StyledFileRemoveBtn onClick={() => setModalFiles((prev) => prev.filter((_, i) => i !== idx))}>
                      <X size={16} />
                    </StyledFileRemoveBtn>
                  </StyledFileItem>
                ))}
              </StyledFileList>
            )}

            <StyledModalFooter>
              <StyledBtnOutlined onClick={() => { setShowUploadModal(false); setModalFiles([]); }}>취소</StyledBtnOutlined>
              <StyledBtnFilled onClick={handleUploadConfirm} disabled={modalFiles.length === 0}>업로드 완료</StyledBtnFilled>
            </StyledModalFooter>
          </StyledModalBox>
        </StyledModalOverlay>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '12px 16px', fontWeight: 500, fontSize: 13,
  lineHeight: '19.5px', letterSpacing: '-0.02em', color: '#6E7687', borderBottom: '1px solid #E3E4E8',
};

const tdStyle: React.CSSProperties = {
  padding: '14px 16px', borderBottom: '1px solid #F1F1F4', fontSize: 13, letterSpacing: '-0.02em',
};
