import { authenticatedApi } from '@/api/authenticated/instance';
import type { CreateCouponRequest } from '@/schema/api/coupons/createCoupon';
import type { CreateLocalCouponRequest } from '@/schema/api/coupons/createLocalCoupon';
import {
  createTossCouponResponseSchema,
  type CreateTossCouponRequest,
  type CreateTossCouponResponseData
} from '@/schema/api/coupons/createTossCoupon';
import {
  getCouponsResponseSchema,
  type GetCouponsRequest,
  type GetCouponsResponseData,
  type UpdateCouponRequest
} from '@/schema/api/coupons/manageCoupons';

// Paddle 쿠폰 생성 (레거시)
export const createCoupon = async (
  request: CreateCouponRequest
): Promise<void> => {
  await authenticatedApi.post('admin/payment/paddle/coupons', { json: request });
};

// 로컬 쿠폰 생성 (크레딧 쿠폰)
export const createLocalCoupon = async (
  request: CreateLocalCouponRequest
): Promise<void> => {
  await authenticatedApi.post('admin/payment/local-coupons', { json: request });
};

// 토스페이먼츠 쿠폰 생성
export const createTossCoupon = async (
  request: CreateTossCouponRequest
): Promise<CreateTossCouponResponseData> => {
  const response = await authenticatedApi
    .post('admin/payment/coupons', { json: request })
    .json();

  const parsed = createTossCouponResponseSchema.parse(response);
  return parsed.data;
};

// 쿠폰 목록 조회
export const getCoupons = async (
  request: GetCouponsRequest
): Promise<GetCouponsResponseData> => {
  const searchParams: Record<string, string | number> = {
    page: request.page,
    size: request.size
  };

  if (request.type) {
    searchParams.type = request.type;
  }

  if (request.status) {
    searchParams.status = request.status;
  }

  if (request.code?.trim()) {
    searchParams.code = request.code.trim();
  }

  const response = await authenticatedApi
    .get('admin/payment/coupons/page', { searchParams })
    .json();

  const parsed = getCouponsResponseSchema.parse(response);
  return parsed.data;
};

// 쿠폰 수정
export const updateCoupon = async (
  couponId: number,
  request: UpdateCouponRequest
): Promise<void> => {
  await authenticatedApi.patch(`admin/payment/coupons/${couponId}`, {
    json: request
  });
};

// 쿠폰 삭제 (hard delete)
export const deleteCoupon = async (couponId: number): Promise<void> => {
  await authenticatedApi.delete(`admin/payment/coupons/${couponId}`);
};
