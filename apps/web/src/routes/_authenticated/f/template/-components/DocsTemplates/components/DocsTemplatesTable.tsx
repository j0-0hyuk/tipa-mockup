import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type FilterFn,
  type SortingState,
  type VisibilityState,
  useReactTable
} from '@tanstack/react-table';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Pagination, Tooltip, useToast } from '@docs-front/ui';
import {
  Badge,
  TableBody,
  TableBodyRow,
  TableHeader,
  TableHeaderRow
} from '@bichon/ds';
import { SquareArrowOutUpRight, SquarePen, Star } from 'lucide-react';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { getAllTemplateFilesQueryOptions } from '@/query/options/products';
import {
  deleteTemplateInterest,
  postTemplateInterest
} from '@/api/template';
import { useI18n } from '@/hooks/useI18n';
import {
  BusinessCellContent,
  BusinessNameText,
  DeadlineBadgeContainer,
  DeadlineCellContent,
  DeadlineDateContainer,
  DeadlineMissingLink,
  DeadlineText,
  EmptyStateCell,
  EmptyStateText,
  InterestIconButton,
  OrganizingAgencyText,
  PostingIconButton,
  SelectableTableBodyRow,
  SelectIconButton,
  StyledBodyCell,
  StyledHeaderCell,
  StyledTable,
  TableFooter,
  TableFrame,
  TableViewport
} from '@/routes/_authenticated/f/template/-components/DocsTemplates/components/DocsTemplatesTable.style';
import type { ProductFilePathMapContents } from '@/schema/api/products/products';
import { getFileNameFromPath } from '@/utils/file/getFileNameFromPath';

interface DocsTemplatesTableProps {
  templates: ProductFilePathMapContents[];
  page: number;
  search: string;
  sortMode: 'deadline' | 'updated';
  onPageChange: (page: number, options?: { replace?: boolean }) => void;
  emptyStateText?: string;
  onSelect?: (template: ProductFilePathMapContents) => void;
  checkCreditBeforeAction?: (onConfirm?: () => void) => boolean | 'pending';
}

interface TemplateTableRow {
  template: ProductFilePathMapContents;
  isInterested: boolean;
  businessName: string;
  fullFileName: string;
  postingUrl: string | null;
  deadlineSortValue: number | undefined;
  deadlineBadgeSortValue: number;
  hasDeadline: boolean;
  deadlineText: string;
  deadlineBadgeVariant: 'active' | 'warning' | 'neutral';
  deadlineBadgeText: string;
  updatedAtSortValue: number | undefined;
  organizingAgencyText: string;
  searchSource: string;
}

interface ColumnMeta {
  width?: string;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
}

const PAGE_SIZE = 10;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface ParsedTemplateDeadline {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const normalizeSearchSource = (value: string): string =>
  value
    .normalize('NFC')
    .toLowerCase()
    .replace(/[\s_]+/g, '');

const parseTemplateBusinessName = (filePath: string | null): string => {
  const fullFileName = getFileNameFromPath(filePath);
  if (!fullFileName) return '-';

  const businessName = fullFileName.replace(/\.[^/.]+$/, '');
  return businessName || fullFileName;
};

const parseTemplateDeadline = (
  deadline: string | null | undefined
): ParsedTemplateDeadline | null => {
  if (!deadline) return null;

  const trimmed = deadline.trim();
  if (!trimmed) return null;

  const normalized = trimmed.replace(' ', 'T');
  const localDateTimeMatch = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::\d{2}(?:\.\d{1,9})?)?)?(?:Z|[+-]\d{2}:?\d{2})?$/
  );

  if (!localDateTimeMatch) return null;

  const [, year, month, day, hour, minute] = localDateTimeMatch;
  const parsedYear = Number(year);
  const parsedMonth = Number(month);
  const parsedDay = Number(day);
  const parsedHour = hour ? Number(hour) : 0;
  const parsedMinute = minute ? Number(minute) : 0;

  const validateDate = new Date(
    parsedYear,
    parsedMonth - 1,
    parsedDay,
    parsedHour,
    parsedMinute
  );

  if (
    validateDate.getFullYear() !== parsedYear ||
    validateDate.getMonth() !== parsedMonth - 1 ||
    validateDate.getDate() !== parsedDay ||
    validateDate.getHours() !== parsedHour ||
    validateDate.getMinutes() !== parsedMinute
  ) {
    return null;
  }

  return {
    year: parsedYear,
    month: parsedMonth,
    day: parsedDay,
    hour: parsedHour,
    minute: parsedMinute
  };
};

const formatDeadline = (deadline: ParsedTemplateDeadline | null): string => {
  if (!deadline) return '-';

  const yy = String(deadline.year).slice(-2);
  const mm = String(deadline.month).padStart(2, '0');
  const dd = String(deadline.day).padStart(2, '0');
  const hh = String(deadline.hour).padStart(2, '0');
  const min = String(deadline.minute).padStart(2, '0');

  return `${yy}.${mm}.${dd} ${hh}:${min}`;
};

const getDeadlineSortValue = (deadline: ParsedTemplateDeadline | null): number | undefined => {
  if (!deadline) return undefined;
  return Number(
    `${deadline.year}${String(deadline.month).padStart(2, '0')}${String(deadline.day).padStart(2, '0')}${String(deadline.hour).padStart(2, '0')}${String(deadline.minute).padStart(2, '0')}`
  );
};

const getRemainingDays = (deadline: ParsedTemplateDeadline | null): number | null => {
  if (!deadline) return null;

  const deadlineDayUtc = Date.UTC(
    deadline.year,
    deadline.month - 1,
    deadline.day
  );

  const now = new Date();
  const todayDayUtc = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return Math.round((deadlineDayUtc - todayDayUtc) / ONE_DAY_MS);
};

const isDeadlineExpired = (deadline: ParsedTemplateDeadline | null): boolean => {
  if (!deadline) return false;

  const hasTime = deadline.hour !== 0 || deadline.minute !== 0;

  const deadlineTime = hasTime
    ? new Date(
        deadline.year,
        deadline.month - 1,
        deadline.day,
        deadline.hour,
        deadline.minute
      )
    : new Date(
        deadline.year,
        deadline.month - 1,
        deadline.day,
        23,
        59,
        59,
        999
      );

  return Date.now() >= deadlineTime.getTime();
};

const getDeadlineBadgeSortValue = (remainingDays: number | null): number => {
  if (remainingDays === null) return 3; // no deadline
  if (remainingDays < 0) return 2; // closed
  if (remainingDays <= 7) return 0; // warning / imminent
  return 1; // active
};

const parseUpdatedAtSortValue = (
  updatedAt: string | null | undefined
): number | undefined => {
  if (!updatedAt) return undefined;

  const parsed = Date.parse(updatedAt);
  if (!Number.isNaN(parsed)) return parsed;

  const dateOnlyMatch = updatedAt.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!dateOnlyMatch) return undefined;

  const [, year, month, day] = dateOnlyMatch;
  const fallback = Date.parse(`${year}-${month}-${day}T00:00:00`);
  return Number.isNaN(fallback) ? undefined : fallback;
};

const openSafeExternalUrl = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl, window.location.origin);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      window.open(url.toString(), '_blank', 'noopener,noreferrer');
    }
  } catch {
    // Ignore invalid or unsupported URL.
  }
};

const globalFilterFn: FilterFn<TemplateTableRow> = (
  row,
  _columnId,
  filterValue
) => {
  const normalizedFilter = normalizeSearchSource(String(filterValue ?? ''));
  if (!normalizedFilter) return true;

  return row.original.searchSource.includes(normalizedFilter);
};

const getColumnMeta = (meta: unknown): ColumnMeta =>
  typeof meta === 'object' && meta !== null ? (meta as ColumnMeta) : {};

const columnHelper = createColumnHelper<TemplateTableRow>();

interface ToggleTemplateInterestVariables {
  templateFileId: number;
  isInterested: boolean;
}

interface ToggleTemplateInterestContext {
  previousTemplates?: ProductFilePathMapContents[];
}

export default function DocsTemplatesTable({
  templates,
  page,
  search,
  sortMode,
  onPageChange,
  emptyStateText,
  onSelect,
  checkCreditBeforeAction
}: DocsTemplatesTableProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useI18n(['main']);
  const queryClient = useQueryClient();
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());
  const templateFilesAllQueryOptions = getAllTemplateFilesQueryOptions();
  const templateFilesAllQueryKey = templateFilesAllQueryOptions.queryKey;
  const [pendingInterestTemplateId, setPendingInterestTemplateId] = useState<
    number | null
  >(null);

  const updateTemplateInterestInCache = useCallback(
    (templateFileId: number, isInterested: boolean) => {
      queryClient.setQueryData<ProductFilePathMapContents[]>(
        templateFilesAllQueryKey,
        (previousTemplates) =>
          previousTemplates?.map((template) =>
            template.productFileId === templateFileId
              ? { ...template, isInterested }
              : template
          ) ?? previousTemplates
      );
    },
    [queryClient, templateFilesAllQueryKey]
  );

  const toggleTemplateInterestMutation = useMutation<
    { isInterested: boolean },
    Error,
    ToggleTemplateInterestVariables,
    ToggleTemplateInterestContext
  >({
    mutationFn: ({ templateFileId, isInterested }) =>
      isInterested
        ? deleteTemplateInterest(templateFileId)
        : postTemplateInterest(templateFileId),
    onMutate: async ({ templateFileId, isInterested }) => {
      setPendingInterestTemplateId(templateFileId);
      await queryClient.cancelQueries({
        queryKey: templateFilesAllQueryKey
      });

      const previousTemplates = queryClient.getQueryData<
        ProductFilePathMapContents[]
      >(templateFilesAllQueryKey);

      updateTemplateInterestInCache(templateFileId, !isInterested);

      return { previousTemplates };
    },
    onError: (error, _variables, context) => {
      if (context?.previousTemplates) {
        queryClient.setQueryData(
          templateFilesAllQueryKey,
          context.previousTemplates
        );
      }

      toast.open({
        content: `관심 설정 변경에 실패했습니다: ${error.message}`,
        duration: 3000,
        position: 'top'
      });
    },
    onSuccess: (response, { templateFileId }) => {
      updateTemplateInterestInCache(templateFileId, response.isInterested);
    },
    onSettled: () => {
      setPendingInterestTemplateId(null);
      void queryClient.invalidateQueries(templateFilesAllQueryOptions);
    }
  });

  const tableData = useMemo<TemplateTableRow[]>(
    () =>
      templates.map((template) => {
        const businessName = parseTemplateBusinessName(template.filePath);
        const fullFileName =
          getFileNameFromPath(template.filePath) ||
          `template_${template.productFileId}`;
        const postingUrl = template.templateMeta?.postingUrl ?? null;
        const templatePrompt = template.templateMeta?.templatePrompt ?? '';
        const deadline = parseTemplateDeadline(
          template.templateMeta?.deadline
        );
        const expired = isDeadlineExpired(deadline);
        const remainingDays = getRemainingDays(deadline);
        const organizingAgency =
          template.templateMeta?.organizingAgency?.trim() || null;

        return {
          template,
          isInterested: Boolean(template.isInterested),
          businessName,
          fullFileName,
          postingUrl,
          deadlineSortValue: getDeadlineSortValue(deadline),
          deadlineBadgeSortValue: expired ? 2 : getDeadlineBadgeSortValue(remainingDays),
          hasDeadline: deadline !== null,
          deadlineText: formatDeadline(deadline),
          deadlineBadgeVariant:
            remainingDays === null
              ? 'neutral'
              : expired || remainingDays < 0
              ? 'neutral'
              : remainingDays <= 7
              ? 'warning'
              : 'active',
          deadlineBadgeText:
            remainingDays !== null
              ? expired || remainingDays < 0
                ? '마감'
                : remainingDays === 0
                ? 'D-DAY'
                : `D-${remainingDays}`
              : '',
          updatedAtSortValue: parseUpdatedAtSortValue(
            template.createdAtRaw || template.createdAt
          ),
          organizingAgencyText: organizingAgency ?? '-',
          searchSource: normalizeSearchSource(
            `${businessName} ${templatePrompt} ${organizingAgency ?? ''}`
          )
        };
      }),
    [templates]
  );

  const sorting = useMemo<SortingState>(
    () =>
      sortMode === 'updated'
        ? [
            { id: 'isInterested', desc: true },
            { id: 'updatedAtSortValue', desc: true }
          ]
        : [
            { id: 'isInterested', desc: true },
            { id: 'deadlineBadgeSortValue', desc: false },
            { id: 'deadlineSortValue', desc: false }
          ],
    [sortMode]
  );

  const columnVisibility = useMemo<VisibilityState>(
    () => ({
      updatedAtSortValue: false,
      deadlineBadgeSortValue: false
    }),
    []
  );

  const handleSelectTemplate = useCallback(
    (selectedTemplate: TemplateTableRow) => {
      const template = selectedTemplate.template;
      onSelect?.(template);

      const proceedWithSelection = () => {
        toast.open({
          content: t('main:fillForm.template.selected'),
          duration: 3000,
          position: 'top'
        });

        navigate({
          to: '/f/prompt/$productFileId',
          params: {
            productFileId: String(template.productFileId)
          },
          search: {
            fileName: selectedTemplate.fullFileName
          }
        });
      };

      if (checkCreditBeforeAction && me.hasProAccess) {
        const canProceed = checkCreditBeforeAction(proceedWithSelection);
        if (canProceed === false || canProceed === 'pending') {
          return;
        }
      }

      proceedWithSelection();
    },
    [checkCreditBeforeAction, me, navigate, onSelect, t, toast]
  );

  const handleToggleTemplateInterest = useCallback(
    (template: ProductFilePathMapContents) => {
      if (toggleTemplateInterestMutation.isPending) {
        return;
      }

      if (pendingInterestTemplateId === template.productFileId) {
        return;
      }

      toggleTemplateInterestMutation.mutate({
        templateFileId: template.productFileId,
        isInterested: Boolean(template.isInterested)
      });
    },
    [
      pendingInterestTemplateId,
      toggleTemplateInterestMutation
    ]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('isInterested', {
        id: 'isInterested',
        header: '관심',
        meta: { width: '6.25%', align: 'center' },
        cell: (info) => {
          const { template, isInterested } = info.row.original;
          const isPending = toggleTemplateInterestMutation.isPending;

          return (
            <Tooltip side="top" content={isInterested ? '관심 해제' : '관심 등록'}>
              <InterestIconButton
                type="button"
                variant="text"
                size="large"
                aria-label={`${isInterested ? '관심 해제' : '관심 등록'}: ${info.row.original.businessName}`}
                disabled={isPending}
                $active={isInterested}
                onClick={(event) => {
                  event.stopPropagation();
                  handleToggleTemplateInterest(template);
                }}
              >
                <Star
                  size={16}
                  style={{
                    strokeWidth: 1.8,
                    fill: isInterested ? 'currentColor' : 'transparent'
                  }}
                />
              </InterestIconButton>
            </Tooltip>
          );
        }
      }),
      columnHelper.accessor('businessName', {
        header: '사업명',
        meta: { width: '50%', align: 'left', headerAlign: 'center' },
        cell: (info) => {
          const postingUrl = info.row.original.postingUrl;

          return (
            <BusinessCellContent>
              <BusinessNameText>{info.getValue() || '-'}</BusinessNameText>
              {postingUrl ? (
                <Tooltip side="top" content="공고 보기">
                  <PostingIconButton
                    type="button"
                    variant="text"
                    size="small"
                    aria-label="공고 보기"
                    onClick={(event) => {
                      event.stopPropagation();
                      openSafeExternalUrl(postingUrl);
                    }}
                  >
                    <SquareArrowOutUpRight
                      size={16}
                      style={{ strokeWidth: 2.5 }}
                    />
                  </PostingIconButton>
                </Tooltip>
              ) : null}
            </BusinessCellContent>
          );
        }
      }),
      columnHelper.accessor('deadlineSortValue', {
        header: '마감일시',
        sortUndefined: 'last',
        meta: { width: '18.75%', align: 'center', headerAlign: 'center' },
        cell: (info) => {
          const {
            hasDeadline,
            deadlineText,
            deadlineBadgeVariant,
            deadlineBadgeText,
            postingUrl
          } = info.row.original;

          if (!hasDeadline) {
            const normalizedPostingUrl = postingUrl?.trim();
            const hasPostingUrl = Boolean(normalizedPostingUrl);

            return (
              <DeadlineCellContent $hasDeadline={false}>
                <DeadlineMissingLink
                  type="button"
                  variant="text"
                  aria-label={hasPostingUrl ? '공고 링크 새 탭 열기' : '공고 링크 없음'}
                  aria-disabled={!hasPostingUrl}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!normalizedPostingUrl) {
                      return;
                    }
                    openSafeExternalUrl(normalizedPostingUrl);
                  }}
                >
                  직접 확인 필요
                </DeadlineMissingLink>
              </DeadlineCellContent>
            );
          }

          return (
            <DeadlineCellContent $hasDeadline>
              <DeadlineDateContainer>
                <DeadlineText>{deadlineText}</DeadlineText>
              </DeadlineDateContainer>
              <DeadlineBadgeContainer>
                {hasDeadline ? (
                  <Badge size="medium" variant={deadlineBadgeVariant}>
                    {deadlineBadgeText}
                  </Badge>
                ) : null}
              </DeadlineBadgeContainer>
            </DeadlineCellContent>
          );
        }
      }),
      columnHelper.accessor('organizingAgencyText', {
        id: 'organizingAgency',
        header: '주관기관',
        enableSorting: false,
        meta: { width: '18.75%', align: 'center' },
        cell: (info) => (
          <OrganizingAgencyText>{info.getValue()}</OrganizingAgencyText>
        )
      }),
      columnHelper.accessor('updatedAtSortValue', {
        id: 'updatedAtSortValue',
        header: '',
        sortUndefined: 'last',
        cell: () => null
      }),
      columnHelper.accessor('deadlineBadgeSortValue', {
        id: 'deadlineBadgeSortValue',
        header: '',
        sortUndefined: 'last',
        cell: () => null
      }),
      columnHelper.display({
        id: 'select',
        header: '',
        meta: { width: '6.25%', align: 'center' },
        cell: (info) => (
          <Tooltip side="top" content="선택">
            <SelectIconButton
              type="button"
              variant="text"
              size="small"
              aria-label={`템플릿 선택: ${info.row.original.businessName}`}
              onClick={(event) => {
                event.stopPropagation();
                handleSelectTemplate(info.row.original);
              }}
            >
              <SquarePen size={24} style={{ strokeWidth: 1.8 }} />
            </SelectIconButton>
          </Tooltip>
        )
      })
    ],
    [
      handleSelectTemplate,
      handleToggleTemplateInterest,
      toggleTemplateInterestMutation.isPending
    ]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter: search,
      sorting,
      columnVisibility,
      pagination: {
        pageIndex: Math.max(page - 1, 0),
        pageSize: PAGE_SIZE
      }
    },
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    enableSortingRemoval: false
  });

  const totalPages = table.getPageCount();
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const isEmpty = table.getPrePaginationRowModel().rows.length === 0;
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  useEffect(() => {
    if (page !== safePage) {
      onPageChange(safePage, { replace: true });
    }
  }, [onPageChange, page, safePage]);

  return (
    <>
      <TableViewport>
        <TableFrame>
          <StyledTable>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableHeaderRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const meta = getColumnMeta(header.column.columnDef.meta);
                    return (
                      <StyledHeaderCell
                        key={header.id}
                        $align={meta.headerAlign ?? meta.align}
                        style={{ width: meta.width }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </StyledHeaderCell>
                    );
                  })}
                </TableHeaderRow>
              ))}
            </TableHeader>
            <TableBody>
              {isEmpty ? (
                <TableBodyRow>
                  <EmptyStateCell colSpan={visibleColumnCount}>
                    {emptyStateText && (
                      <EmptyStateText>{emptyStateText}</EmptyStateText>
                    )}
                  </EmptyStateCell>
                </TableBodyRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <SelectableTableBodyRow
                    key={row.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`템플릿 선택: ${row.original.businessName}`}
                    onClick={() => handleSelectTemplate(row.original)}
                    onKeyDown={(
                      event: ReactKeyboardEvent<HTMLTableRowElement>
                    ) => {
                      if (event.target !== event.currentTarget) {
                        return;
                      }

                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleSelectTemplate(row.original);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = getColumnMeta(cell.column.columnDef.meta);
                      return (
                        <StyledBodyCell key={cell.id} $align={meta.align}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </StyledBodyCell>
                      );
                    })}
                  </SelectableTableBodyRow>
                ))
              )}
            </TableBody>
          </StyledTable>
        </TableFrame>
      </TableViewport>
      {totalPages > 1 && (
        <TableFooter>
          <Pagination
            currentPage={safePage}
            totalPage={totalPages}
            onPageChange={onPageChange}
          />
        </TableFooter>
      )}
    </>
  );
}
