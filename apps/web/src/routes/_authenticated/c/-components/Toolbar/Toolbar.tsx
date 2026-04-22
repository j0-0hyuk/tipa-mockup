import {
  getDocumentOptions,
  getProductFileStatusPollingOptions
} from '@/query/options/products';
import { ColorPicker } from '@/routes/_authenticated/c/-components/Toolbar/components/ColorPicker/ColorPicker';
import { ExportButton } from '@/routes/_authenticated/c/-components/Toolbar/components/ExportButton/ExportButton';
import ExportModal from '@/routes/_authenticated/c/-components/Toolbar/components/ExportModal/ExportModal';
import { Skeleton, Flex, IconButton, Button } from '@docs-front/ui';
import {
  StyledToolbar,
  StyledToolbarTitle
} from '@/routes/_authenticated/c/-components/Toolbar/Toolbar.style';
import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import {
  useLocation,
  useMatchRoute,
  useNavigate
} from '@tanstack/react-router';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { ArrowLeft, Menu, Download } from 'lucide-react';
import SideNavigationModal from '@/routes/_authenticated/-components/SideNavigation/SideNavigationModal';
import { useSideNavigationModalStore } from '@/store/useSideNavigationModalStore';
import { getProductFileDownload } from '@/api/products/query';
import { blobDownload } from '@/utils/blobDownload';

export default function Toolbar() {
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: '/c/$productId' });
  if (!params) {
    throw new Error('params is not valid');
  }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { isMobile } = useBreakPoints();
  const { isOpen, open } = useSideNavigationModalStore();

  const productId = Number(params.productId);
  const { data: document } = useSuspenseQuery(getDocumentOptions(productId));

  return (
    <StyledToolbar>
      <Flex alignItems="center" gap={8}>
        {isMobile && (
          <IconButton variant="text" size="small" onClick={() => open()}>
            <Flex height="100%" alignItems="center" justify="center">
              <Menu size={20} />
            </Flex>
          </IconButton>
        )}
        {document.itemName ? (
          <StyledToolbarTitle $isSm={isMobile}>
            {document.itemName}
          </StyledToolbarTitle>
        ) : (
          <Skeleton loading={true} width="96px" height="24px" />
        )}
        <Suspense>{params && <ColorPicker productId={productId} />}</Suspense>
      </Flex>

      <div style={{ position: 'relative' }}>
        <Flex gap="12px" alignItems="center">
          {/* <Suspense>
            <HistoryButton productId={productId} />
          </Suspense> */}
          <Suspense>
            {params && (
              <ExportButton
                productId={productId}
                onClick={() => setIsModalOpen(true)}
              />
            )}
          </Suspense>
        </Flex>
        {isModalOpen && (
          <ExportModal
            onClose={() => setIsModalOpen(false)}
            itemName={document.itemName ?? '사업계획서'}
          />
        )}
      </div>
      {isOpen && <SideNavigationModal />}
    </StyledToolbar>
  );
}

export function HomeNavbar() {
  const { isOpen, open } = useSideNavigationModalStore();
  const location = useLocation();
  const pathname = location.pathname;
  const hideBorder =
    pathname.includes('/credit-plan') || pathname.includes('/credit-policy');

  // d/$productFileId 라우트 감지
  const matchRoute = useMatchRoute();
  const docParams = matchRoute({ to: '/d/$productFileId' });
  const productFileIdNumber = docParams
    ? Number(docParams.productFileId)
    : null;

  if (productFileIdNumber) {
    return <DocumentNavbar productFileIdNumber={productFileIdNumber} />;
  }

  return (
    <StyledToolbar $hideBorder={hideBorder}>
      <IconButton variant="text" size="small" onClick={() => open()}>
        <Flex semantic="nav" height="100%" alignItems="center" justify="center">
          <Menu size={20} />
        </Flex>
      </IconButton>
      {isOpen && <SideNavigationModal />}
    </StyledToolbar>
  );
}

function DocumentNavbar({
  productFileIdNumber
}: {
  productFileIdNumber: number;
}) {
  const navigate = useNavigate();
  const { data: statusData } = useQuery(
    getProductFileStatusPollingOptions(productFileIdNumber)
  );

  const isStatusCompleted = statusData?.data.status === 'COMPLETED';

  const displayFileName = useMemo(
    () => statusData?.data.filePath?.split('/').pop() ?? '',
    [statusData?.data.filePath]
  );

  const handleDownload = useCallback(async () => {
    if (!productFileIdNumber) return;
    try {
      const blob = await getProductFileDownload(productFileIdNumber);
      blobDownload(blob, displayFileName);
    } catch (err) {
      console.error('파일 다운로드 실패:', err);
    }
  }, [productFileIdNumber, displayFileName]);

  return (
    <StyledToolbar>
      <Flex alignItems="center" gap={8} style={{ minWidth: 0, flex: 1 }}>
        <Button
          variant="outlined"
          width="fit-content"
          size="large"
          onClick={() => navigate({ to: '/d', search: { category: 'export' } })}
        >
          <Flex height="100%" alignItems="center" justify="center">
            <ArrowLeft size={20} />
          </Flex>
        </Button>
        <StyledToolbarTitle $isSm>
          {displayFileName || '문서'}
        </StyledToolbarTitle>
      </Flex>
      <Button
        type="button"
        onClick={handleDownload}
        variant="outlined"
        size="medium"
        width="fit-content"
        disabled={!isStatusCompleted}
      >
        <Flex direction="row" gap={6} alignItems="center">
          <Download size={18} />
          <span>다운로드</span>
        </Flex>
      </Button>
    </StyledToolbar>
  );
}
