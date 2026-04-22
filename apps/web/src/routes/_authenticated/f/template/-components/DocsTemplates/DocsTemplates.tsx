import { Dialog, Flex, Tooltip } from '@docs-front/ui';
import {
  StyledDocsTemplatesDescription,
  StyledUploadModalDescription,
  StyledRequestTemplateContainer,
  StyledRequestTemplateText,
  StyledRequestTemplateLink
} from '@/routes/_authenticated/f/template/-components/DocsTemplates/DocsTemplates.style';
import { Download } from 'lucide-react';
import { useTheme } from '@emotion/react';
import DocsTemplatesTable from '@/routes/_authenticated/f/template/-components/DocsTemplates/components/DocsTemplatesTable';
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type KeyboardEvent
} from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useModal } from '@/hooks/useModal';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { getAllTemplateFilesQueryOptions } from '@/query/options/products';
import FileDropzone from '@/routes/_authenticated/f/template/-components/FileDropzone/FileDropzone';
import {
  SegmentedControlItem,
  SegmentedControlRoot,
  TextField
} from '@bichon/ds';
import { useDebounceValue } from 'usehooks-ts';
import { useBreakPoints } from '@/hooks/useBreakPoints';

interface DocsTemplatesProps {
  page: number;
  search?: string;
  sort?: 'deadline' | 'updated';
  checkCreditBeforeAction?: (onConfirm?: () => void) => boolean | 'pending';
}

const SEARCH_DEBOUNCE_MS = 250;

type TemplateSortMode = 'deadline' | 'updated';

const normalizeSearchQuery = (value: string | undefined): string =>
  (value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();

export function DocsTemplates({
  page,
  search,
  sort,
  checkCreditBeforeAction
}: DocsTemplatesProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isMobile } = useBreakPoints();
  const modal = useModal();
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());
  const sortMode: TemplateSortMode =
    sort === 'updated' ? 'updated' : 'deadline';
  const normalizedSearch = useMemo(
    () => normalizeSearchQuery(search),
    [search]
  );
  const [searchInput, setSearchInput] = useState(normalizedSearch);
  const [debouncedSearchInput] = useDebounceValue(
    searchInput,
    SEARCH_DEBOUNCE_MS
  );

  const { data: allTemplates = [] } = useQuery(
    getAllTemplateFilesQueryOptions()
  );

  useEffect(() => {
    setSearchInput(normalizedSearch);
  }, [normalizedSearch]);

  const handleCommitSearch = useCallback(
    (nextSearchRaw: string, replace = true) => {
      const nextSearch = normalizeSearchQuery(nextSearchRaw);
      if (nextSearch === normalizedSearch) {
        return;
      }

      navigate({
        to: '/f/template',
        search: (prev) => ({
          ...prev,
          page: 1,
          search: nextSearch.length > 0 ? nextSearch : undefined
        }),
        replace
      });
    },
    [navigate, normalizedSearch]
  );

  useEffect(() => {
    handleCommitSearch(debouncedSearchInput, true);
  }, [debouncedSearchInput, handleCommitSearch]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchInput(event.target.value);
    },
    []
  );

  const handleSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
        event.preventDefault();
      }
    },
    []
  );

  const handleSortModeChange = useCallback(
    (nextSort: string) => {
      if (nextSort !== 'deadline' && nextSort !== 'updated') {
        return;
      }
      if (nextSort === sortMode) {
        return;
      }

      navigate({
        to: '/f/template',
        search: (prev) => ({
          ...prev,
          page: 1,
          sort: nextSort
        }),
        replace: true
      });
    },
    [navigate, sortMode]
  );

  const handleUploadClick = () => {
    if (!me.hasProAccess) return;
    modal.openModal(({ isOpen, onClose }) => (
      <Dialog isOpen={isOpen} onClose={onClose}>
        <Dialog.title>양식 직접 업로드</Dialog.title>
        <Dialog.content>
          <Flex direction="column" gap="16px">
            <StyledUploadModalDescription>
              사업계획서 양식 파일을 업로드하면 해당 양식 기반으로 문서가
              생성됩니다.
            </StyledUploadModalDescription>
            <FileDropzone
              checkCreditBeforeAction={checkCreditBeforeAction}
            />
          </Flex>
        </Dialog.content>
      </Dialog>
    ));
  };

  const handlePageChange = useCallback(
    (newPage: number, options?: { replace?: boolean }) => {
      navigate({
        to: '/f/template',
        search: (prev) => ({
          ...prev,
          page: newPage,
          search: normalizedSearch.length > 0 ? normalizedSearch : undefined,
          sort: sortMode
        }),
        replace: options?.replace ?? false
      });
    },
    [navigate, normalizedSearch, sortMode]
  );

  const handleRequestTemplateClick = () => {
    window.ChannelIO?.('showMessenger');
  };

  const emptyStateText = normalizedSearch
    ? '해당하는 양식을 찾을 수 없습니다. 다른 키워드로 검색해 보세요.'
    : '등록된 양식이 없습니다.';

  return (
    <Flex direction="column" width="100%" gap="10px">
      <Flex
        justify="space-between"
        alignItems="center"
        direction={isMobile ? 'column' : 'row'}
        width="100%"
        gap="32px"
      >
        <TextField
          width="100%"
          searchField
          placeholder="지원사업명 · 주관기관 검색"
          value={searchInput}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
        />
        <Flex
          gap="8px"
          alignItems="center"
          width="100%"
          direction="row"
          justify="flex-end"
        >
          <Tooltip
            content={!me.hasProAccess ? 'Pro 플랜 기능입니다' : ''}
            side="top"
          >
            <Flex
              gap="4px"
              justify="center"
              alignItems="center"
              style={{
                cursor: me.hasProAccess ? 'pointer' : 'not-allowed',
                opacity: me.hasProAccess ? 1 : 0.5
              }}
              onClick={handleUploadClick}
            >
              <Download
                size={16}
                strokeWidth={1.4}
                color={theme.color.textGray}
              />
              <StyledDocsTemplatesDescription>
                양식 직접 업로드
              </StyledDocsTemplatesDescription>
            </Flex>
          </Tooltip>
          <SegmentedControlRoot
            size="small"
            value={sortMode}
            onValueChange={handleSortModeChange}
          >
            <SegmentedControlItem value="deadline">
              마감임박순
            </SegmentedControlItem>
            <SegmentedControlItem value="updated">
              최신순
            </SegmentedControlItem>
          </SegmentedControlRoot>
        </Flex>
      </Flex>
      <Suspense>
        <DocsTemplatesTable
          templates={allTemplates}
          page={page}
          search={normalizedSearch}
          sortMode={sortMode}
          onPageChange={handlePageChange}
          emptyStateText={emptyStateText}
          checkCreditBeforeAction={checkCreditBeforeAction}
        />
      </Suspense>
      <StyledRequestTemplateContainer>
        <StyledRequestTemplateText>
          원하는 양식이 없으신가요?
        </StyledRequestTemplateText>
        <StyledRequestTemplateLink onClick={handleRequestTemplateClick}>
          양식 신청하기
        </StyledRequestTemplateLink>
      </StyledRequestTemplateContainer>
    </Flex>
  );
}
