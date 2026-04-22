import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Flex, Button, useToast } from '@bichon/ds';
import {
  PageHeader,
  PageTitle,
  PageDescription,
  FormContainer,
  FormSection,
  FormField,
  Label,
  Input,
  Select,
  TextArea,
  ErrorMessage,
  HelpText,
  CouponTypeToggle,
  CouponTypeButton,
  PageModeToggle,
  PageModeButton,
  ManageToolbar,
  FilterGrid,
  SearchRow,
  TableContainer,
  CouponTable,
  CouponTableHead,
  CouponTableHeaderCell,
  CouponTableBody,
  CouponTableRow,
  CouponTableCell,
  CouponDescriptionText,
  CouponTypeBadge,
  CouponStatusBadge,
  ActionCell,
  ActionButton,
  DangerActionButton,
  EmptyState,
  PaginationContainer,
  PaginationButton,
  PaginationInfo,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalButton
} from '@/routes/_authenticated/coupons/coupons.style';
import {
  createTossCoupon,
  createLocalCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
} from '@/api/authenticated/coupons';
import {
  createTossCouponRequestSchema,
  type CreateTossCouponRequest,
  type CreateTossCouponResponseData
} from '@/schema/api/coupons/createTossCoupon';
import {
  createLocalCouponRequestSchema,
  type CreateLocalCouponRequest
} from '@/schema/api/coupons/createLocalCoupon';
import {
  editCouponFormSchema,
  type CouponListItem,
  type EditCouponFormData,
  type UpdateCouponRequest
} from '@/schema/api/coupons/manageCoupons';
import { PasswordGuard } from '@/components/PasswordGuard/PasswordGuard';
import { useState, useEffect, useMemo, type KeyboardEvent } from 'react';

export const Route = createFileRoute('/_authenticated/coupons')({
  component: CouponsPage
});

type CreateCouponTabType = 'toss' | 'local';
type CouponsPageMode = 'create' | 'manage';
type CouponTypeFilter = 'ALL' | 'TOSS' | 'LOCAL';
type CouponStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

const COUPON_PAGE_SIZE = 30;

// target 옵션 한글 변환
const getTargetLabel = (target: string): string => {
  switch (target) {
    case 'ALL':
      return '전체 상품';
    case 'MONTHLY_PASS':
      return 'Pro 1개월 이용권';
    case 'SEASON_PASS':
      return 'Master 2026';
    default:
      return target;
  }
};

const getCouponTypeLabel = (type: CouponListItem['type']): string => {
  return type === 'LOCAL' ? '크레딧' : '토스';
};

const getCouponStatusLabel = (status: CouponListItem['status']): string => {
  return status === 'ACTIVE' ? '활성' : '비활성';
};

const getCouponDescriptionLabel = (description: CouponListItem['description']): string => {
  if (description == null) {
    return '-';
  }

  const trimmedDescription = description.trim();
  return trimmedDescription.length > 0 ? trimmedDescription : '-';
};

const formatDateTimeDisplay = (dateTime: string | null | undefined): string => {
  if (!dateTime) {
    return '-';
  }

  const parsedDate = new Date(dateTime);
  if (Number.isNaN(parsedDate.getTime())) {
    return '-';
  }

  return parsedDate.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const toDateTimeLocal = (isoDateTime: string | null | undefined): string | null => {
  if (!isoDateTime) {
    return null;
  }

  const parsedDate = new Date(isoDateTime);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const localDate = new Date(parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const parseNullableNumber = (value: unknown): number | null => {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isNaN(numericValue) ? null : numericValue;
};

const parseNullableDateTime = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length === 0 ? null : trimmedValue;
};

const getBenefitLabel = (coupon: CouponListItem): string => {
  if (coupon.type === 'LOCAL') {
    return coupon.credit != null
      ? `크레딧 ${coupon.credit.toLocaleString()} 지급`
      : '크레딧 쿠폰';
  }

  if (coupon.benefitType === 'DURATION') {
    return coupon.durationMonths != null
      ? `${coupon.durationMonths}개월 무료`
      : '기간 무료';
  }

  if (coupon.discountType === 'AMOUNT') {
    return coupon.amount != null
      ? `${coupon.amount.toLocaleString()}원 할인`
      : '정액 할인';
  }

  if (coupon.discountType === 'PERCENT') {
    return coupon.percent != null
      ? `${coupon.percent}% 할인`
      : '정률 할인';
  }

  return '-';
};

const getValidityLabel = (coupon: CouponListItem): string => {
  const startsAtLabel = coupon.startsAt ? formatDateTimeDisplay(coupon.startsAt) : '즉시';
  const endsAtLabel = coupon.endsAt ? formatDateTimeDisplay(coupon.endsAt) : '무기한';

  return `${startsAtLabel} ~ ${endsAtLabel}`;
};

function CouponsPage() {
  const navigate = useNavigate();
  const [pageMode, setPageMode] = useState<CouponsPageMode>('create');
  const [createCouponTab, setCreateCouponTab] = useState<CreateCouponTabType>('toss');
  const [createdCoupon, setCreatedCoupon] = useState<CreateTossCouponResponseData | null>(null);

  // 목록 조회 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [couponTypeFilter, setCouponTypeFilter] = useState<CouponTypeFilter>('ALL');
  const [couponStatusFilter, setCouponStatusFilter] = useState<CouponStatusFilter>('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 수정/삭제 모달 상태
  const [editingCoupon, setEditingCoupon] = useState<CouponListItem | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<CouponListItem | null>(null);
  const [deleteConfirmCode, setDeleteConfirmCode] = useState('');

  const toast = useToast();
  const queryClient = useQueryClient();

  const invalidateCouponList = () => {
    queryClient.invalidateQueries({ queryKey: ['coupons', 'list'] });
  };

  // 토스페이먼츠 쿠폰 폼
  const {
    register: registerToss,
    handleSubmit: handleSubmitToss,
    formState: { errors: errorsToss },
    watch: watchToss,
    reset: resetToss,
    setValue: setValueToss
  } = useForm<CreateTossCouponRequest>({
    resolver: zodResolver(createTossCouponRequestSchema),
    defaultValues: {
      benefitType: 'DISCOUNT',
      type: 'AMOUNT',
      target: 'ALL',
      status: 'ACTIVE',
      maxUses: 100
    }
  });

  // 로컬 쿠폰 폼
  const {
    register: registerLocal,
    handleSubmit: handleSubmitLocal,
    formState: { errors: errorsLocal },
    reset: resetLocal
  } = useForm<CreateLocalCouponRequest>({
    resolver: zodResolver(createLocalCouponRequestSchema)
  });

  // 수정 폼
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit
  } = useForm<EditCouponFormData>({
    resolver: zodResolver(editCouponFormSchema),
    defaultValues: {
      description: '',
      status: 'ACTIVE',
      startsAt: null,
      endsAt: null,
      maxUses: null,
      amount: null,
      percent: null,
      durationMonths: null,
      credit: null
    }
  });

  // 토스페이먼츠 쿠폰 생성 mutation
  const createTossCouponMutation = useMutation({
    mutationFn: createTossCoupon,
    onSuccess: (response) => {
      setCreatedCoupon(response);
      toast.showToast('쿠폰이 성공적으로 생성되었습니다.', {
        duration: 3000
      });
      resetToss();
      invalidateCouponList();
    },
    onError: (error: Error) => {
      toast.showToast(`쿠폰 생성에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
    }
  });

  // 로컬 쿠폰 생성 mutation
  const createLocalCouponMutation = useMutation({
    mutationFn: createLocalCoupon,
    onSuccess: () => {
      toast.showToast('로컬 쿠폰이 성공적으로 생성되었습니다.', {
        duration: 3000
      });
      resetLocal();
      invalidateCouponList();
    },
    onError: (error: Error) => {
      toast.showToast(`로컬 쿠폰 생성에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
    }
  });

  // 쿠폰 목록 조회
  const {
    data: couponsData,
    isLoading: isLoadingCoupons,
    isFetching: isFetchingCoupons,
    isError: isCouponsError,
    error: couponsError,
    refetch: refetchCoupons
  } = useQuery({
    queryKey: [
      'coupons',
      'list',
      currentPage,
      couponTypeFilter,
      couponStatusFilter,
      searchQuery
    ],
    queryFn: () =>
      getCoupons({
        page: currentPage,
        size: COUPON_PAGE_SIZE,
        type: couponTypeFilter === 'ALL' ? undefined : couponTypeFilter,
        status: couponStatusFilter === 'ALL' ? undefined : couponStatusFilter,
        code: searchQuery || undefined
      }),
    enabled: pageMode === 'manage'
  });

  const updateCouponMutation = useMutation({
    mutationFn: ({
      couponId,
      request
    }: {
      couponId: number;
      request: UpdateCouponRequest;
    }) => updateCoupon(couponId, request),
    onSuccess: () => {
      toast.showToast('쿠폰이 수정되었습니다.', {
        duration: 3000
      });
      setEditingCoupon(null);
      resetEdit();
      invalidateCouponList();
    },
    onError: (error: Error) => {
      toast.showToast(`쿠폰 수정에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
    }
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (couponId: number) => deleteCoupon(couponId),
    onSuccess: () => {
      toast.showToast('쿠폰이 삭제되었습니다.', {
        duration: 3000
      });
      setDeletingCoupon(null);
      setDeleteConfirmCode('');
      invalidateCouponList();
    },
    onError: (error: Error) => {
      toast.showToast(`쿠폰 삭제에 실패했습니다: ${error.message}`, {
        duration: 5000
      });
    }
  });

  // datetime-local 값을 ISO-8601 형식으로 변환 (KST 타임존 추가)
  const formatDateTimeToISO = (dateTime: string | null | undefined): string | null => {
    if (!dateTime?.trim()) return null;
    return `${dateTime}:00+09:00`;
  };

  const onSubmitToss = (data: CreateTossCouponRequest) => {
    if (data.benefitType === 'DISCOUNT') {
      const requestData: CreateTossCouponRequest = {
        ...data,
        amount: data.type === 'AMOUNT' && data.amount ? Math.round(data.amount) : null,
        percent: data.type === 'PERCENT' && data.percent ? Math.round(data.percent) : null,
        durationMonths: null,
        startsAt: formatDateTimeToISO(data.startsAt),
        endsAt: formatDateTimeToISO(data.endsAt)
      };
      setCreatedCoupon(null);
      createTossCouponMutation.mutate(requestData);
    } else {
      const requestData: CreateTossCouponRequest = {
        ...data,
        type: undefined,
        amount: null,
        percent: null,
        durationMonths: data.durationMonths ? Math.round(data.durationMonths) : null,
        target: 'MONTHLY_PASS',
        startsAt: formatDateTimeToISO(data.startsAt),
        endsAt: formatDateTimeToISO(data.endsAt)
      };
      setCreatedCoupon(null);
      createTossCouponMutation.mutate(requestData);
    }
  };

  const onSubmitLocal = (data: CreateLocalCouponRequest) => {
    createLocalCouponMutation.mutate(data);
  };

  const openEditModal = (coupon: CouponListItem) => {
    if (coupon.usedCount > 0) {
      return;
    }

    setEditingCoupon(coupon);
    resetEdit({
      description: coupon.description ?? '',
      status: coupon.status,
      startsAt: toDateTimeLocal(coupon.startsAt),
      endsAt: toDateTimeLocal(coupon.endsAt),
      maxUses: coupon.maxUses ?? null,
      amount: coupon.amount ?? null,
      percent: coupon.percent ?? null,
      durationMonths: coupon.durationMonths ?? null,
      credit: coupon.credit ?? null
    });
  };

  const closeEditModal = () => {
    setEditingCoupon(null);
    resetEdit();
  };

  const openDeleteModal = (coupon: CouponListItem) => {
    setDeletingCoupon(coupon);
    setDeleteConfirmCode('');
  };

  const closeDeleteModal = () => {
    setDeletingCoupon(null);
    setDeleteConfirmCode('');
  };

  const onSubmitEdit = (formData: EditCouponFormData) => {
    if (!editingCoupon) {
      return;
    }

    if (editingCoupon.usedCount > 0) {
      toast.showToast('이미 사용된 쿠폰은 수정할 수 없습니다.', {
        duration: 4000
      });
      closeEditModal();
      return;
    }

    const request: UpdateCouponRequest = {
      description: formData.description?.trim() || undefined,
      status: formData.status,
      startsAt: formatDateTimeToISO(formData.startsAt),
      endsAt: formatDateTimeToISO(formData.endsAt),
      maxUses: formData.maxUses ?? null
    };

    if (editingCoupon.type === 'LOCAL') {
      if (formData.credit == null) {
        toast.showToast('크레딧 값을 입력해주세요.', {
          duration: 4000
        });
        return;
      }

      request.credit = Math.round(formData.credit);
    } else if (editingCoupon.benefitType === 'DURATION') {
      if (formData.durationMonths == null) {
        toast.showToast('무료 기간(개월)을 입력해주세요.', {
          duration: 4000
        });
        return;
      }

      request.durationMonths = Math.round(formData.durationMonths);
    } else if (editingCoupon.discountType === 'PERCENT') {
      if (formData.percent == null) {
        toast.showToast('할인율(%)을 입력해주세요.', {
          duration: 4000
        });
        return;
      }

      request.percent = Math.round(formData.percent);
    } else if (editingCoupon.discountType === 'AMOUNT') {
      if (formData.amount == null) {
        toast.showToast('할인 금액(원)을 입력해주세요.', {
          duration: 4000
        });
        return;
      }

      request.amount = Math.round(formData.amount);
    }

    updateCouponMutation.mutate({
      couponId: editingCoupon.id,
      request
    });
  };

  const onConfirmDelete = () => {
    if (!deletingCoupon) {
      return;
    }

    deleteCouponMutation.mutate(deletingCoupon.id);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setCurrentPage(0);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(0);
  };

  const benefitType = watchToss('benefitType');
  const couponType = watchToss('type');

  // 랜덤 코드 생성 함수
  const generateRandomCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 생성 탭 변경 시 생성 폼 초기화
  useEffect(() => {
    if (createCouponTab === 'toss') {
      resetLocal();
      setCreatedCoupon(null);
    } else {
      resetToss();
      setCreatedCoupon(null);
    }
  }, [createCouponTab, resetToss, resetLocal]);

  // 혜택 타입 변경 시 관련 필드 초기화
  useEffect(() => {
    if (benefitType === 'DISCOUNT') {
      setValueToss('durationMonths', null);
      setValueToss('type', 'AMOUNT');
    } else {
      setValueToss('type', undefined);
      setValueToss('amount', null);
      setValueToss('percent', null);
      setValueToss('target', 'MONTHLY_PASS');
    }
  }, [benefitType, setValueToss]);

  // 쿠폰 타입 변경 시 금액/퍼센트 필드 초기화
  useEffect(() => {
    if (benefitType !== 'DISCOUNT') return;
    if (couponType === 'AMOUNT') {
      setValueToss('percent', null);
    } else {
      setValueToss('amount', null);
    }
  }, [couponType, benefitType, setValueToss]);

  const couponPage = couponsData?.couponPage;
  const couponList = couponPage?.content ?? [];
  const totalPages = couponPage?.totalPages ?? 0;
  const totalElements = couponPage?.totalElements ?? 0;
  const couponsErrorMessage =
    couponsError instanceof Error ? couponsError.message : '잠시 후 다시 시도해 주세요.';

  const paginationButtons = useMemo(() => {
    if (totalPages <= 1) {
      return [];
    }

    const buttons: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        buttons.push(i);
      }
      return buttons;
    }

    const start = Math.min(
      Math.max(0, currentPage - Math.floor(maxVisiblePages / 2)),
      totalPages - maxVisiblePages
    );
    const end = start + maxVisiblePages - 1;

    for (let i = start; i <= end; i++) {
      buttons.push(i);
    }

    return buttons;
  }, [currentPage, totalPages]);

  return (
    <PasswordGuard
      description="쿠폰 페이지에 접근하려면 관리자 패스워드가 필요합니다."
      onCancel={() => navigate({ to: '/main' })}
    >
      <Flex direction="column" gap={24}>
        <PageHeader>
          <PageTitle>쿠폰 관리</PageTitle>
          <PageDescription>
            쿠폰 발급과 쿠폰 목록 조회/수정/삭제를 한 곳에서 관리합니다.
          </PageDescription>
        </PageHeader>

        <FormSection>
          <Label>작업 모드</Label>
          <PageModeToggle>
            <PageModeButton
              type="button"
              $active={pageMode === 'create'}
              onClick={() => setPageMode('create')}
            >
              발급
            </PageModeButton>
            <PageModeButton
              type="button"
              $active={pageMode === 'manage'}
              onClick={() => setPageMode('manage')}
            >
              관리
            </PageModeButton>
          </PageModeToggle>
        </FormSection>

        {pageMode === 'create' ? (
          <FormContainer>
            <form
              onSubmit={
                createCouponTab === 'local'
                  ? handleSubmitLocal(onSubmitLocal)
                  : handleSubmitToss(onSubmitToss)
              }
            >
              <Flex direction="column" gap={24}>
                <FormSection>
                  <Label>쿠폰 타입</Label>
                  <CouponTypeToggle>
                    <CouponTypeButton
                      type="button"
                      $active={createCouponTab === 'toss'}
                      onClick={() => setCreateCouponTab('toss')}
                    >
                      토스페이먼츠 쿠폰
                    </CouponTypeButton>
                    <CouponTypeButton
                      type="button"
                      $active={createCouponTab === 'local'}
                      onClick={() => setCreateCouponTab('local')}
                    >
                      크레딧 쿠폰
                    </CouponTypeButton>
                  </CouponTypeToggle>
                </FormSection>

                {createCouponTab === 'local' ? (
                  <>
                    <FormField>
                      <Label htmlFor="couponCode">쿠폰 코드</Label>
                      <Flex gap={8} alignItems="center">
                        <Input
                          id="couponCode"
                          placeholder="쿠폰 코드를 입력하세요"
                          {...registerLocal('couponCode')}
                        />
                        <Button
                          type="button"
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const randomCode = generateRandomCode();
                            resetLocal({ couponCode: randomCode });
                          }}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          랜덤 생성
                        </Button>
                      </Flex>
                      {errorsLocal.couponCode && (
                        <ErrorMessage>{errorsLocal.couponCode.message}</ErrorMessage>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="credit">크레딧</Label>
                      <Input
                        id="credit"
                        type="number"
                        min="1"
                        placeholder="크레딧 양을 입력하세요"
                        {...registerLocal('credit', { valueAsNumber: true })}
                      />
                      {errorsLocal.credit && (
                        <ErrorMessage>{errorsLocal.credit.message}</ErrorMessage>
                      )}
                    </FormField>
                  </>
                ) : (
                  <>
                    <FormField>
                      <Label htmlFor="code">쿠폰 코드 *</Label>
                      <Flex gap={8} alignItems="center">
                        <Input id="code" placeholder="예: DOCS-2026" {...registerToss('code')} />
                        <Button
                          type="button"
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setValueToss('code', generateRandomCode());
                          }}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          랜덤 생성
                        </Button>
                      </Flex>
                      {errorsToss.code && (
                        <ErrorMessage>{errorsToss.code.message}</ErrorMessage>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="description">설명</Label>
                      <TextArea
                        id="description"
                        placeholder="쿠폰에 대한 설명을 입력하세요"
                        {...registerToss('description')}
                      />
                      {errorsToss.description && (
                        <ErrorMessage>{errorsToss.description.message}</ErrorMessage>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="benefitType">혜택 타입 *</Label>
                      <Select id="benefitType" {...registerToss('benefitType')}>
                        <option value="DISCOUNT">할인 쿠폰</option>
                        <option value="DURATION">기간 무료 쿠폰</option>
                      </Select>
                    </FormField>

                    {benefitType === 'DISCOUNT' ? (
                      <>
                        <FormField>
                          <Label htmlFor="type">할인 타입 *</Label>
                          <Select id="type" {...registerToss('type')}>
                            <option value="AMOUNT">정액 할인 (원)</option>
                            <option value="PERCENT">정률 할인 (%)</option>
                          </Select>
                          {errorsToss.type && (
                            <ErrorMessage>{errorsToss.type.message}</ErrorMessage>
                          )}
                        </FormField>

                        {couponType === 'AMOUNT' ? (
                          <FormField>
                            <Label htmlFor="amount">할인 금액 (원) *</Label>
                            <Input
                              id="amount"
                              type="number"
                              min="1"
                              placeholder="예: 20000"
                              {...registerToss('amount', { valueAsNumber: true })}
                            />
                            {errorsToss.amount && (
                              <ErrorMessage>{errorsToss.amount.message}</ErrorMessage>
                            )}
                          </FormField>
                        ) : (
                          <FormField>
                            <Label htmlFor="percent">할인율 (%) *</Label>
                            <Input
                              id="percent"
                              type="number"
                              min="1"
                              max="100"
                              placeholder="예: 10"
                              {...registerToss('percent', { valueAsNumber: true })}
                            />
                            {errorsToss.percent && (
                              <ErrorMessage>{errorsToss.percent.message}</ErrorMessage>
                            )}
                          </FormField>
                        )}

                        <FormField>
                          <Label htmlFor="target">적용 대상 *</Label>
                          <Select id="target" {...registerToss('target')}>
                            <option value="ALL">{getTargetLabel('ALL')}</option>
                            <option value="MONTHLY_PASS">{getTargetLabel('MONTHLY_PASS')}</option>
                            <option value="SEASON_PASS">{getTargetLabel('SEASON_PASS')}</option>
                          </Select>
                          {errorsToss.target && (
                            <ErrorMessage>{errorsToss.target.message}</ErrorMessage>
                          )}
                        </FormField>
                      </>
                    ) : (
                      <>
                        <FormField>
                          <Label htmlFor="durationMonths">무료 기간 (개월) *</Label>
                          <Input
                            id="durationMonths"
                            type="number"
                            min="1"
                            placeholder="예: 3"
                            {...registerToss('durationMonths', { valueAsNumber: true })}
                          />
                          <HelpText>1개월 = 30일로 계산됩니다</HelpText>
                          {errorsToss.durationMonths && (
                            <ErrorMessage>{errorsToss.durationMonths.message}</ErrorMessage>
                          )}
                        </FormField>

                        <FormField>
                          <Label htmlFor="target">적용 대상</Label>
                          <Input id="target" value={getTargetLabel('MONTHLY_PASS')} disabled />
                          <HelpText>
                            기간 쿠폰은 Pro 1개월 이용권에만 적용 가능합니다
                          </HelpText>
                        </FormField>
                      </>
                    )}

                    <FormField>
                      <Label htmlFor="maxUses">최대 사용 횟수 *</Label>
                      <Input
                        id="maxUses"
                        type="number"
                        min="1"
                        placeholder="예: 100"
                        {...registerToss('maxUses', { valueAsNumber: true })}
                      />
                      {errorsToss.maxUses && (
                        <ErrorMessage>{errorsToss.maxUses.message}</ErrorMessage>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="status">상태</Label>
                      <Select id="status" {...registerToss('status')}>
                        <option value="ACTIVE">활성</option>
                        <option value="INACTIVE">비활성</option>
                      </Select>
                      <HelpText>기본값: 활성</HelpText>
                      {errorsToss.status && (
                        <ErrorMessage>{errorsToss.status.message}</ErrorMessage>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="startsAt">시작일 (선택)</Label>
                      <Input id="startsAt" type="datetime-local" {...registerToss('startsAt')} />
                      <HelpText>입력하지 않으면 즉시 사용 가능합니다</HelpText>
                      {errorsToss.startsAt && (
                        <ErrorMessage>{errorsToss.startsAt.message}</ErrorMessage>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="endsAt">종료일 (선택)</Label>
                      <Input id="endsAt" type="datetime-local" {...registerToss('endsAt')} />
                      <HelpText>입력하지 않으면 영구적으로 사용 가능합니다</HelpText>
                      {errorsToss.endsAt && (
                        <ErrorMessage>{errorsToss.endsAt.message}</ErrorMessage>
                      )}
                    </FormField>
                  </>
                )}

                <Button
                  type="submit"
                  variant="filled"
                  size="medium"
                  disabled={
                    createCouponTab === 'local'
                      ? createLocalCouponMutation.isPending
                      : createTossCouponMutation.isPending
                  }
                >
                  {createCouponTab === 'local'
                    ? createLocalCouponMutation.isPending
                      ? '생성 중...'
                      : '크레딧 쿠폰 생성'
                    : createTossCouponMutation.isPending
                      ? '생성 중...'
                      : '쿠폰 생성'}
                </Button>

                {createdCoupon && (
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#d1fae5',
                      borderRadius: '8px',
                      border: '1px solid #10b981'
                    }}
                  >
                    <p style={{ margin: 0, color: '#065f46', fontWeight: 600 }}>
                      쿠폰이 생성되었습니다!
                    </p>
                    <p style={{ margin: '8px 0 0 0', color: '#065f46' }}>
                      ID: {createdCoupon.id}
                    </p>
                    <p style={{ margin: '4px 0 0 0', color: '#065f46' }}>
                      코드: {createdCoupon.code}
                    </p>
                  </div>
                )}
              </Flex>
            </form>
          </FormContainer>
        ) : (
          <FormContainer>
            <Flex direction="column" gap={16}>
              <ManageToolbar>
                <FilterGrid>
                  <FormField>
                    <Label htmlFor="couponTypeFilter">쿠폰 종류</Label>
                    <Select
                      id="couponTypeFilter"
                      value={couponTypeFilter}
                      onChange={(event) => {
                        setCouponTypeFilter(event.target.value as CouponTypeFilter);
                        setCurrentPage(0);
                      }}
                    >
                      <option value="ALL">전체</option>
                      <option value="TOSS">토스</option>
                      <option value="LOCAL">크레딧</option>
                    </Select>
                  </FormField>

                  <FormField>
                    <Label htmlFor="couponStatusFilter">상태</Label>
                    <Select
                      id="couponStatusFilter"
                      value={couponStatusFilter}
                      onChange={(event) => {
                        setCouponStatusFilter(event.target.value as CouponStatusFilter);
                        setCurrentPage(0);
                      }}
                    >
                      <option value="ALL">전체</option>
                      <option value="ACTIVE">활성</option>
                      <option value="INACTIVE">비활성</option>
                    </Select>
                  </FormField>
                </FilterGrid>

                <SearchRow>
                  <Input
                    placeholder="쿠폰 코드로 검색"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    onKeyDown={handleSearchKeyDown}
                  />
                  <Button type="button" variant="filled" size="small" onClick={handleSearch}>
                    검색
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    size="small"
                    onClick={handleClearSearch}
                  >
                    초기화
                  </Button>
                </SearchRow>
              </ManageToolbar>

              <TableContainer>
                {isLoadingCoupons ? (
                  <EmptyState>쿠폰 목록을 불러오는 중입니다...</EmptyState>
                ) : isCouponsError ? (
                  <Flex direction="column" gap={8} alignItems="flex-start">
                    <EmptyState>쿠폰 목록 조회에 실패했습니다.</EmptyState>
                    <HelpText>{couponsErrorMessage}</HelpText>
                    <Button
                      type="button"
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        void refetchCoupons();
                      }}
                    >
                      다시 시도
                    </Button>
                  </Flex>
                ) : couponList.length === 0 ? (
                  <EmptyState>조건에 맞는 쿠폰이 없습니다.</EmptyState>
                ) : (
                  <CouponTable>
                    <CouponTableHead>
                      <tr>
                        <CouponTableHeaderCell>코드</CouponTableHeaderCell>
                        <CouponTableHeaderCell>설명</CouponTableHeaderCell>
                        <CouponTableHeaderCell>종류</CouponTableHeaderCell>
                        <CouponTableHeaderCell>혜택</CouponTableHeaderCell>
                        <CouponTableHeaderCell>상태</CouponTableHeaderCell>
                        <CouponTableHeaderCell>사용량</CouponTableHeaderCell>
                        <CouponTableHeaderCell>유효기간</CouponTableHeaderCell>
                        <CouponTableHeaderCell>생성일</CouponTableHeaderCell>
                        <CouponTableHeaderCell>액션</CouponTableHeaderCell>
                      </tr>
                    </CouponTableHead>
                    <CouponTableBody>
                      {couponList.map((coupon) => {
                        const descriptionLabel = getCouponDescriptionLabel(coupon.description);

                        return (
                          <CouponTableRow key={coupon.id}>
                            <CouponTableCell>{coupon.code}</CouponTableCell>
                            <CouponTableCell>
                              <CouponDescriptionText
                                title={descriptionLabel !== '-' ? descriptionLabel : undefined}
                              >
                                {descriptionLabel}
                              </CouponDescriptionText>
                            </CouponTableCell>
                            <CouponTableCell>
                              <CouponTypeBadge $type={coupon.type}>
                                {getCouponTypeLabel(coupon.type)}
                              </CouponTypeBadge>
                            </CouponTableCell>
                            <CouponTableCell>{getBenefitLabel(coupon)}</CouponTableCell>
                            <CouponTableCell>
                              <CouponStatusBadge $status={coupon.status}>
                                {getCouponStatusLabel(coupon.status)}
                              </CouponStatusBadge>
                            </CouponTableCell>
                            <CouponTableCell>
                              {coupon.usedCount.toLocaleString()}/
                              {coupon.maxUses == null ? '무제한' : coupon.maxUses.toLocaleString()}
                            </CouponTableCell>
                            <CouponTableCell>{getValidityLabel(coupon)}</CouponTableCell>
                            <CouponTableCell>{formatDateTimeDisplay(coupon.createdAt)}</CouponTableCell>
                            <CouponTableCell>
                              <ActionCell>
                                <ActionButton
                                  type="button"
                                  disabled={coupon.usedCount > 0}
                                  onClick={() => openEditModal(coupon)}
                                  title={
                                    coupon.usedCount > 0
                                      ? '이미 사용된 쿠폰은 수정할 수 없습니다'
                                      : undefined
                                  }
                                >
                                  수정
                                </ActionButton>
                                <DangerActionButton
                                  type="button"
                                  disabled={deleteCouponMutation.isPending}
                                  onClick={() => openDeleteModal(coupon)}
                                >
                                  삭제
                                </DangerActionButton>
                              </ActionCell>
                            </CouponTableCell>
                          </CouponTableRow>
                        );
                      })}
                    </CouponTableBody>
                  </CouponTable>
                )}
              </TableContainer>

              {isFetchingCoupons && !isLoadingCoupons && (
                <HelpText>최신 쿠폰 목록을 동기화하고 있습니다...</HelpText>
              )}

              {totalPages > 0 && (
                <PaginationContainer>
                  <PaginationButton
                    type="button"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  >
                    이전
                  </PaginationButton>
                  {paginationButtons.map((page) => (
                    <PaginationButton
                      key={page}
                      type="button"
                      $active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page + 1}
                    </PaginationButton>
                  ))}
                  <PaginationButton
                    type="button"
                    disabled={totalPages === 0 || currentPage === totalPages - 1}
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  >
                    다음
                  </PaginationButton>
                  <PaginationInfo>
                    {totalElements.toLocaleString()}개 중 {currentPage + 1}/{Math.max(totalPages, 1)}
                  </PaginationInfo>
                </PaginationContainer>
              )}
            </Flex>
          </FormContainer>
        )}

        {editingCoupon && (
          <ModalOverlay onClick={closeEditModal}>
            <ModalContent
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-coupon-modal-title"
              tabIndex={-1}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  closeEditModal();
                }
              }}
            >
              <ModalHeader>
                <ModalTitle id="edit-coupon-modal-title">쿠폰 수정</ModalTitle>
                <ModalCloseButton
                  type="button"
                  aria-label="쿠폰 수정 모달 닫기"
                  onClick={closeEditModal}
                >
                  ×
                </ModalCloseButton>
              </ModalHeader>

              <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
                <ModalBody>
                  <Flex direction="column" gap={16}>
                    <FormField>
                      <Label htmlFor="edit-code">쿠폰 코드</Label>
                      <Input id="edit-code" value={editingCoupon.code} disabled />
                    </FormField>

                    <FormField>
                      <Label htmlFor="edit-description">설명</Label>
                      <TextArea id="edit-description" {...registerEdit('description')} />
                      {errorsEdit.description && (
                        <ErrorMessage>{errorsEdit.description.message}</ErrorMessage>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="edit-status">상태</Label>
                      <Select id="edit-status" {...registerEdit('status')}>
                        <option value="ACTIVE">활성</option>
                        <option value="INACTIVE">비활성</option>
                      </Select>
                      {errorsEdit.status && (
                        <ErrorMessage>{errorsEdit.status.message}</ErrorMessage>
                      )}
                    </FormField>

                    {editingCoupon.type === 'LOCAL' && (
                      <FormField>
                        <Label htmlFor="edit-credit">크레딧 *</Label>
                        <Input
                          id="edit-credit"
                          type="number"
                          min="1"
                          placeholder="예: 10000"
                          {...registerEdit('credit', {
                            setValueAs: parseNullableNumber
                          })}
                        />
                        {errorsEdit.credit && (
                          <ErrorMessage>{errorsEdit.credit.message}</ErrorMessage>
                        )}
                      </FormField>
                    )}

                    {editingCoupon.type === 'TOSS' &&
                      editingCoupon.benefitType === 'DURATION' && (
                        <FormField>
                          <Label htmlFor="edit-durationMonths">무료 기간 (개월) *</Label>
                          <Input
                            id="edit-durationMonths"
                            type="number"
                            min="1"
                            placeholder="예: 3"
                            {...registerEdit('durationMonths', {
                              setValueAs: parseNullableNumber
                            })}
                          />
                          {errorsEdit.durationMonths && (
                            <ErrorMessage>{errorsEdit.durationMonths.message}</ErrorMessage>
                          )}
                        </FormField>
                      )}

                    {editingCoupon.type === 'TOSS' &&
                      editingCoupon.benefitType === 'DISCOUNT' &&
                      editingCoupon.discountType === 'AMOUNT' && (
                        <FormField>
                          <Label htmlFor="edit-amount">할인 금액 (원) *</Label>
                          <Input
                            id="edit-amount"
                            type="number"
                            min="1"
                            placeholder="예: 20000"
                            {...registerEdit('amount', {
                              setValueAs: parseNullableNumber
                            })}
                          />
                          {errorsEdit.amount && (
                            <ErrorMessage>{errorsEdit.amount.message}</ErrorMessage>
                          )}
                        </FormField>
                      )}

                    {editingCoupon.type === 'TOSS' &&
                      editingCoupon.benefitType === 'DISCOUNT' &&
                      editingCoupon.discountType === 'PERCENT' && (
                        <FormField>
                          <Label htmlFor="edit-percent">할인율 (%) *</Label>
                          <Input
                            id="edit-percent"
                            type="number"
                            min="1"
                            max="100"
                            placeholder="예: 10"
                            {...registerEdit('percent', {
                              setValueAs: parseNullableNumber
                            })}
                          />
                          {errorsEdit.percent && (
                            <ErrorMessage>{errorsEdit.percent.message}</ErrorMessage>
                          )}
                        </FormField>
                      )}

                    <FormField>
                      <Label htmlFor="edit-maxUses">최대 사용 횟수</Label>
                      <Input
                        id="edit-maxUses"
                        type="number"
                        min="1"
                        placeholder="비우면 제한 없음"
                        {...registerEdit('maxUses', {
                          setValueAs: parseNullableNumber
                        })}
                      />
                      {errorsEdit.maxUses && (
                        <ErrorMessage>{errorsEdit.maxUses.message}</ErrorMessage>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="edit-startsAt">시작일</Label>
                      <Input
                        id="edit-startsAt"
                        type="datetime-local"
                        {...registerEdit('startsAt', {
                          setValueAs: parseNullableDateTime
                        })}
                      />
                      {errorsEdit.startsAt && (
                        <ErrorMessage>{errorsEdit.startsAt.message}</ErrorMessage>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="edit-endsAt">종료일</Label>
                      <Input
                        id="edit-endsAt"
                        type="datetime-local"
                        {...registerEdit('endsAt', {
                          setValueAs: parseNullableDateTime
                        })}
                      />
                      {errorsEdit.endsAt && (
                        <ErrorMessage>{errorsEdit.endsAt.message}</ErrorMessage>
                      )}
                    </FormField>
                  </Flex>
                </ModalBody>

                <ModalFooter>
                  <ModalButton type="button" onClick={closeEditModal}>
                    취소
                  </ModalButton>
                  <ModalButton
                    type="submit"
                    $variant="primary"
                    disabled={updateCouponMutation.isPending}
                  >
                    {updateCouponMutation.isPending ? '수정 중...' : '저장'}
                  </ModalButton>
                </ModalFooter>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}

        {deletingCoupon && (
          <ModalOverlay onClick={closeDeleteModal}>
            <ModalContent
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-coupon-modal-title"
              tabIndex={-1}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  closeDeleteModal();
                }
              }}
            >
              <ModalHeader>
                <ModalTitle id="delete-coupon-modal-title">쿠폰 삭제</ModalTitle>
                <ModalCloseButton
                  type="button"
                  aria-label="쿠폰 삭제 모달 닫기"
                  onClick={closeDeleteModal}
                >
                  ×
                </ModalCloseButton>
              </ModalHeader>

              <ModalBody>
                <Flex direction="column" gap={12}>
                  <p style={{ margin: 0, color: '#374151', lineHeight: 1.5 }}>
                    이 작업은 되돌릴 수 없습니다. 아래 입력창에 <strong>{deletingCoupon.code}</strong>
                    를 정확히 입력하면 hard delete 됩니다.
                  </p>

                  <FormField>
                    <Label htmlFor="delete-confirm-code">쿠폰 코드 확인</Label>
                    <Input
                      id="delete-confirm-code"
                      placeholder="쿠폰 코드를 입력하세요"
                      value={deleteConfirmCode}
                      onChange={(event) => setDeleteConfirmCode(event.target.value)}
                    />
                  </FormField>
                </Flex>
              </ModalBody>

              <ModalFooter>
                <ModalButton type="button" onClick={closeDeleteModal}>
                  취소
                </ModalButton>
                <ModalButton
                  type="button"
                  $variant="danger"
                  disabled={
                    deleteCouponMutation.isPending ||
                    deleteConfirmCode.trim() !== deletingCoupon.code
                  }
                  onClick={onConfirmDelete}
                >
                  {deleteCouponMutation.isPending ? '삭제 중...' : '영구 삭제'}
                </ModalButton>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </Flex>
    </PasswordGuard>
  );
}
