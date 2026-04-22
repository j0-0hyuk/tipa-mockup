import ReactPixel from 'react-facebook-pixel';
import TagManager from 'react-gtm-module';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

interface PurchaseData {
  items: Array<{
    price_id: string;
    quantity?: number;
    totals?: {
      unit_total?: number;
    };
    price?: {
      unit_price?: number;
      name?: string;
    };
  }>;
  totals: {
    total: string | number;
  };
  currency_code?: string;
  transaction_id?: string;
}

interface TrackPurchaseParams {
  data: PurchaseData;
  content_type: 'subscription' | 'credit' | 'seasonpass';
  transaction_id?: string;
}

export const trackPurchase = ({ data, content_type, transaction_id }: TrackPurchaseParams) => {
  try {
    const currencyCode = data.currency_code || 'USD';
    const isKRW = currencyCode === 'KRW';
    const convertAmount = (amount: number) => (isKRW ? amount : amount / 100);

    const value = convertAmount(Number(data?.totals?.total ?? 0));

    const contents = data.items.map((item) => ({
      id: item.price_id,
      quantity: Number(item.quantity ?? 1),
      item_price: convertAmount(
        Number(item?.totals?.unit_total ?? item?.price?.unit_price ?? 0)
      )
    }));

    // GTM 초기화 (purchase 이벤트는 아래 GA4 ecommerce 블록으로 통합)
    if (import.meta.env.VITE_ENVIRONMENT === 'prod') {
      TagManager.dataLayer({
        dataLayer: {
          content_type
        }
      });
    }

    // Meta Pixel
    ReactPixel.track('Purchase', {
      value,
      currency: String(currencyCode),
      contents,
      content_type,
      num_items: contents.reduce((s, c) => s + Number(c.quantity || 0), 0)
    });
  } catch (e) {
    console.warn(`[TrackPurchase] ${content_type} tracking failed:`, e);
  }

  try {
    const currencyCode = data.currency_code || 'USD';
    const isKRW = currencyCode === 'KRW';
    const convertAmount = (amount: number) => (isKRW ? amount : amount / 100);

    // GA4 ecommerce 표준 스키마 (prod 환경에서만 전송)
    // GTM 호환: value/currency/transaction_id를 최상위에도 배치 (GTM 변수 매핑 대응)
    if (import.meta.env.VITE_ENVIRONMENT === 'prod') {
      window.dataLayer?.push({
        event: 'purchase',
        transaction_id: transaction_id ?? data.transaction_id,
        value: convertAmount(Number(data?.totals?.total ?? 0)),
        currency: String(currencyCode),
        ecommerce: {
          transaction_id: transaction_id ?? data.transaction_id,
          value: convertAmount(Number(data?.totals?.total ?? 0)),
          currency: String(currencyCode),
          items: data.items.map((item) => ({
            item_id: item.price_id,
            item_name: item.price?.name ?? item.price_id,
            price: convertAmount(
              Number(item?.totals?.unit_total ?? item?.price?.unit_price ?? 0)
            ),
            quantity: Number(item.quantity ?? 1)
          }))
        }
      });
    }
  } catch (e) {
    console.warn(`[GA4] ${content_type} Purchase track failed:`, e);
  }
};
