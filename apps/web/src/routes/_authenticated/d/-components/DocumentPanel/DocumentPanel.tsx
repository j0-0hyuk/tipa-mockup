import {
  Component,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
  useRef,
  forwardRef
} from 'react';
import type { ErrorInfo, ReactNode, Ref } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Flex, Modal, Spinner, useToast } from '@docs-front/ui';
import { Button, TextField } from '@bichon/ds';
import { Info } from 'lucide-react';
import { blobDownload } from '@/utils/blobDownload';
import { DocsThemeDialog } from '@/components/DocsThemeDialog/DocsThemeDialog';
import { EditorFormatToolbar } from '@/routes/_authenticated/d/-components/DocumentPanel/components/EditorFormatToolbar/EditorFormatToolbar';
import {
  EditorProvider,
  SlateEditor,
  useEditor,
  useDiffSession
} from '@docs-front/hwpx-editor';
import { useDocumentStyle } from '@docs-front/hwpx-editor/headless';
import type { DocumentStore, Theme } from '@docs-front/hwpx-editor';
import type { HwpxAction } from '@/ai/document-chat/ui-message';
import { getProductFileStatusPollingOptions } from '@/query/options/products';
import { getProductFileDownload } from '@/api/products/query';
import type { GetProductFileStatusResponse } from '@/schema/api/products/products';
import { putProductFile, postProductFileReset } from '@/api/files';
import { useDebounceCallback } from 'usehooks-ts';
import {
  StyledDocumentPanel,
  StyledEditorToolbar,
  StyledEditorTitle,
  StyledEditorNotice,
  StyledEditorContent,
  StyledEditorWrapper,
  StyledEditorOverlay,
  StyledEditorError
} from '@/routes/_authenticated/d/-components/DocumentPanel/DocumentPanel.style';

export interface DocumentPanelHandle {
  startStreaming: () => void;
  pushAction: (action: HwpxAction) => void;
  finishStreaming: () => void;
  rollback: () => void;
}

interface DocumentPanelProps {
  productFileIdNumber: number;
  hideToolbar?: boolean;
  onDiffFinish?: () => void;
}

interface DocumentPanelInnerProps extends DocumentPanelProps {
  statusData: GetProductFileStatusResponse;
  innerRef: Ref<DocumentPanelHandle>;
}

interface EditorErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface EditorErrorBoundaryState {
  hasError: boolean;
}

class EditorErrorBoundary extends Component<
  EditorErrorBoundaryProps,
  EditorErrorBoundaryState
> {
  state: EditorErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): EditorErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('에디터 렌더링 오류:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <StyledEditorError>
          <p>에디터에 문제가 발생했습니다.</p>
          <Button variant="outlined" size="medium" onClick={this.handleReset}>
            에디터 다시 로드
          </Button>
        </StyledEditorError>
      );
    }
    return this.props.children;
  }
}

const LEVEL_KEYS = /^l\d+$/;

/** store를 직렬화하여 File 객체 + Theme을 반환한다. */
function serializeStoreToFile(
  store: DocumentStore,
  filename: string
): { file: File; theme: ReturnType<DocumentStore['getTheme']> } {
  const bytes = store.serialize();
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
  const file = new File([buffer], filename, {
    type: 'application/octet-stream'
  });
  const theme = store.getTheme();
  return { file, theme };
}

/** fileLoaded 후에만 마운트 — useDocumentStyle이 문서 로드 후 안전하게 호출 */
function StyleDialogWrapper({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { theme, updateStyle } = useDocumentStyle();

  const filteredTheme = useMemo(() => {
    const filtered = structuredClone(theme);
    filtered.style = Object.fromEntries(
      Object.entries(filtered.style)
        .filter(([key]) => LEVEL_KEYS.test(key))
        .sort(([a], [b]) => +a.slice(1) - +b.slice(1))
    );
    return filtered;
  }, [theme]);

  const handleApply = useCallback(
    (changedTheme: Theme) => {
      // 1. 변경된 스타일만 updateStyle 호출 (reloadEditor로 Slate 노드 갱신)
      for (const [styleKey, entry] of Object.entries(changedTheme.style)) {
        const oldEntry = theme.style[styleKey];
        const charStyleKey = entry.character_style ?? '';
        const paraStyleKey = entry.paragraph_style ?? '';
        const borderStyleKey = entry.border_style ?? '';

        const charChanged =
          charStyleKey !== (oldEntry?.character_style ?? '') ||
          JSON.stringify(changedTheme.character[charStyleKey]) !==
            JSON.stringify(theme.character[charStyleKey]);
        const paraChanged =
          paraStyleKey !== (oldEntry?.paragraph_style ?? '') ||
          JSON.stringify(changedTheme.paragraph[paraStyleKey]) !==
            JSON.stringify(theme.paragraph[paraStyleKey]);
        const borderChanged =
          borderStyleKey !== (oldEntry?.border_style ?? '') ||
          JSON.stringify(changedTheme.border?.[borderStyleKey]) !==
            JSON.stringify(theme.border?.[borderStyleKey]);

        if (!oldEntry || charChanged || paraChanged || borderChanged) {
          updateStyle(
            styleKey,
            changedTheme.character[charStyleKey],
            changedTheme.paragraph[paraStyleKey],
            changedTheme.border?.[borderStyleKey]
          );
        }
      }

      // 2. 서버 저장용 fullTheme 구성 후 직접 전달
      const fullTheme = structuredClone(theme);
      fullTheme.character = {
        ...fullTheme.character,
        ...changedTheme.character
      };
      fullTheme.paragraph = {
        ...fullTheme.paragraph,
        ...changedTheme.paragraph
      };
      fullTheme.border = { ...fullTheme.border, ...changedTheme.border };
      for (const [key, entry] of Object.entries(changedTheme.style)) {
        fullTheme.style[key] = entry;
      }
    },
    [theme, updateStyle]
  );

  return (
    <DocsThemeDialog
      isOpen={isOpen}
      onClose={onClose}
      onApply={handleApply}
      defaultTheme={filteredTheme}
    />
  );
}

function DocumentPanelInner({
  productFileIdNumber,
  hideToolbar,
  onDiffFinish,
  statusData,
  innerRef
}: DocumentPanelInnerProps) {
  const { store, dispatcher, loadBytes, reloadEditor, value } = useEditor();

  const displayFileName = useMemo(
    () => statusData?.data.filePath?.split('/').pop() ?? '',
    [statusData?.data.filePath]
  );

  const saveFile = useCallback(() => {
    dispatcher.flush();
    const { file, theme } = serializeStoreToFile(
      store,
      displayFileName || 'document.hwpx'
    );
    return putProductFile(productFileIdNumber, file, theme).catch((err) => {
      console.error('문서 저장 실패:', err);
    });
  }, [store, dispatcher, productFileIdNumber, displayFileName]);

  const valueRef = useRef(value);
  valueRef.current = value;

  const session = useDiffSession({
    store,
    dispatcher,
    reloadEditor,
    getEditorValue: () => valueRef.current,
    onFinish: async () => {
      await saveFile();
      onDiffFinish?.();
    }
  });

  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [fileLoaded, setFileLoaded] = useState(false);
  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');

  const RESET_CONFIRM_KEYWORD = '초기화';

  const handleResetConfirm = useCallback(async () => {
    if (isResetting || resetConfirmText !== RESET_CONFIRM_KEYWORD) return;
    setIsResetting(true);
    try {
      await postProductFileReset(productFileIdNumber);
      const blob = await getProductFileDownload(productFileIdNumber);
      const arrayBuffer = await blob.arrayBuffer();
      await loadBytes(
        new Uint8Array(arrayBuffer),
        displayFileName || 'document.hwpx'
      );
      setIsResetModalOpen(false);
      setResetConfirmText('');
      toast.open({
        content: '문서가 처음 상태로 되돌려졌습니다.',
        duration: 3000
      });
    } catch {
      toast.open({
        content: '문서 초기화에 실패했습니다.',
        duration: 3000
      });
    } finally {
      setIsResetting(false);
    }
  }, [
    isResetting,
    resetConfirmText,
    productFileIdNumber,
    loadBytes,
    displayFileName,
    toast
  ]);

  const handleDownload = useCallback(() => {
    dispatcher.flush();
    const { file } = serializeStoreToFile(
      store,
      displayFileName || 'document.hwpx'
    );
    blobDownload(file, displayFileName || 'document.hwpx');
  }, [store, dispatcher, displayFileName]);

  const loadFile = useCallback(async () => {
    if (!productFileIdNumber || fileLoaded) return;
    setError(null);
    try {
      const blob = await getProductFileDownload(productFileIdNumber);
      const arrayBuffer = await blob.arrayBuffer();
      await loadBytes(
        new Uint8Array(arrayBuffer),
        displayFileName || 'document.hwpx'
      );
      setFileLoaded(true);
    } catch (err) {
      console.error('파일 로드 실패:', err);
      setError('문서를 불러오는데 실패했습니다.');
    }
  }, [productFileIdNumber, fileLoaded, loadBytes, displayFileName]);

  useEffect(() => {
    loadFile();
  }, [loadFile]);

  useImperativeHandle(
    innerRef,
    () => ({
      startStreaming: () => session.startStreaming(),
      pushAction: (action: HwpxAction) => session.pushAction(action),
      finishStreaming: () => session.finishStreaming(),
      rollback: () => session.reset()
    }),
    [session]
  );

  return (
    <StyledDocumentPanel>
      {!hideToolbar && (
        <StyledEditorToolbar>
          <StyledEditorTitle>{displayFileName || '문서'}</StyledEditorTitle>
          <StyledEditorNotice>
            <Info size={16} />
            <span>
              에디터는 사전 내용 확인 및 AI 수정용이에요.{' '}
              <strong>실제 파일은 깨지지 않아요.</strong>
            </span>
          </StyledEditorNotice>
        </StyledEditorToolbar>
      )}
      {!hideToolbar && fileLoaded && (
        <EditorFormatToolbar
          onOpenStyleDialog={() => setIsStyleDialogOpen(true)}
          onReset={() => setIsResetModalOpen(true)}
          onDownload={handleDownload}
        />
      )}
      {isStyleDialogOpen && (
        <StyleDialogWrapper
          isOpen={isStyleDialogOpen}
          onClose={() => setIsStyleDialogOpen(false)}
        />
      )}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => {
          setIsResetModalOpen(false);
          setResetConfirmText('');
        }}
      >
        <Modal.Header title="문서 초기화" />
        <Modal.Body>
          <Flex direction="column" gap={16}>
            <p>
              문서를 최초 생성 시점으로 되돌립니다. 이 작업은 되돌릴 수 없으며,
              지금까지 편집한 모든 내용이 사라집니다.
            </p>
            <Flex direction="column" gap={8}>
              <p>
                계속하려면 아래에 <strong>{RESET_CONFIRM_KEYWORD}</strong>를
                입력해주세요.
              </p>
              <TextField
                placeholder={RESET_CONFIRM_KEYWORD}
                value={resetConfirmText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setResetConfirmText(e.target.value)
                }
                width="100%"
              />
            </Flex>
          </Flex>
        </Modal.Body>
        <Modal.Footer>
          <Modal.CancelButton
            onClick={() => {
              setIsResetModalOpen(false);
              setResetConfirmText('');
            }}
          >
            취소
          </Modal.CancelButton>
          <Modal.ConfirmButton
            onClick={handleResetConfirm}
            disabled={isResetting || resetConfirmText !== RESET_CONFIRM_KEYWORD}
            variant="warning"
          >
            {isResetting ? '되돌리는 중...' : '문서 초기화'}
          </Modal.ConfirmButton>
        </Modal.Footer>
      </Modal>

      <StyledEditorContent>
        <StyledEditorWrapper>
          <EditorErrorBoundary onReset={reloadEditor}>
            <SlateEditor diffSession={session} height="100%" />
          </EditorErrorBoundary>
        </StyledEditorWrapper>
        {!fileLoaded && (
          <StyledEditorOverlay>
            {error ? (
              <StyledEditorError>
                <p>{error}</p>
                <Button variant="outlined" size="medium" onClick={loadFile}>
                  다시 시도
                </Button>
              </StyledEditorError>
            ) : (
              <Flex direction="column" alignItems="center" gap={12}>
                <Spinner size={32} />
                <span>문서를 불러오는 중...</span>
              </Flex>
            )}
          </StyledEditorOverlay>
        )}
      </StyledEditorContent>
    </StyledDocumentPanel>
  );
}

export const DocumentPanel = forwardRef(function DocumentPanel(
  props: DocumentPanelProps,
  ref: Ref<DocumentPanelHandle>
) {
  const { data: statusData } = useSuspenseQuery(
    getProductFileStatusPollingOptions(props.productFileIdNumber)
  );

  const isStatusCompleted = statusData.data.status === 'COMPLETED';
  const fileName =
    statusData?.data.filePath?.split('/').pop() || 'document.hwpx';

  const handleChange = useDebounceCallback((store: DocumentStore) => {
    const { file, theme } = serializeStoreToFile(store, fileName);
    putProductFile(props.productFileIdNumber, file, theme).catch((err) => {
      console.error('문서 저장 실패:', err);
    });
  }, 1000);

  if (!isStatusCompleted || !statusData) {
    return (
      <StyledDocumentPanel>
        <StyledEditorContent>
          <StyledEditorOverlay>
            <Flex direction="column" alignItems="center" gap={12}>
              <Spinner size={32} />
              <span>문서를 불러오는 중...</span>
            </Flex>
          </StyledEditorOverlay>
        </StyledEditorContent>
      </StyledDocumentPanel>
    );
  }

  return (
    <EditorProvider
      initialTheme={statusData.data.theme ?? undefined}
      onChange={handleChange}
    >
      <DocumentPanelInner {...props} statusData={statusData} innerRef={ref} />
    </EditorProvider>
  );
});
