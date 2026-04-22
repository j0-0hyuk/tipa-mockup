import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { blobDownload } from '@/utils/blobDownload';
import { getProductFileStatusPollingOptions } from '@/query/options/products';
import { getProductFileDownload } from '@/api/products/query';
import { getAccountMeQueryOptions } from '@/query/options/account';
import { getFileNameFromPath } from '@/utils/file/getFileNameFromPath';
import { useToast } from '@bichon/ds';
import type { GetProductFileStatusResponse } from '@/schema/api/products/products';

const FAILED_CONFIRMATION_COUNT = 3;
const FAILED_RETRY_DELAYS_MS = [1000, 2000];
type ProductFileStatus = GetProductFileStatusResponse['data']['status'] | undefined;

const getFailedRetryDelay = (failedConfirmationCount: number) =>
  FAILED_RETRY_DELAYS_MS[failedConfirmationCount - 1] ??
  FAILED_RETRY_DELAYS_MS[FAILED_RETRY_DELAYS_MS.length - 1];

function useConfirmedFailedStatus({
  status,
  dataUpdatedAt,
  isFetchedAfterMount,
  refetch
}: {
  status: ProductFileStatus;
  dataUpdatedAt: number;
  isFetchedAfterMount: boolean;
  refetch: () => Promise<unknown>;
}) {
  const [failedConfirmationCount, setFailedConfirmationCount] = useState(0);
  const lastHandledFailedDataUpdatedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== 'FAILED') {
      lastHandledFailedDataUpdatedAtRef.current = null;
      setFailedConfirmationCount((prev) => (prev === 0 ? prev : 0));
      return;
    }

    if (
      !isFetchedAfterMount ||
      lastHandledFailedDataUpdatedAtRef.current === dataUpdatedAt
    ) {
      return;
    }

    lastHandledFailedDataUpdatedAtRef.current = dataUpdatedAt;
    setFailedConfirmationCount((prev) =>
      Math.min(prev + 1, FAILED_CONFIRMATION_COUNT)
    );
  }, [status, dataUpdatedAt, isFetchedAfterMount]);

  useEffect(() => {
    if (
      status !== 'FAILED' ||
      failedConfirmationCount === 0 ||
      failedConfirmationCount >= FAILED_CONFIRMATION_COUNT
    ) {
      return;
    }

    const retryTimeout = window.setTimeout(() => {
      void refetch();
    }, getFailedRetryDelay(failedConfirmationCount));

    return () => {
      window.clearTimeout(retryTimeout);
    };
  }, [status, failedConfirmationCount, refetch]);

  return {
    isStatusFailed:
      status === 'FAILED' &&
      failedConfirmationCount >= FAILED_CONFIRMATION_COUNT,
    isFailedPendingConfirmation:
      status === 'FAILED' &&
      failedConfirmationCount < FAILED_CONFIRMATION_COUNT
  };
}

export function useOutputSection(productFileId: number) {
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const isDownloadingRef = useRef(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const {
    data: statusData,
    error,
    dataUpdatedAt,
    refetch,
    isFetchedAfterMount
  } = useQuery(
    getProductFileStatusPollingOptions(productFileId)
  );

  const status = statusData?.data.status;
  const isStatusCompleted = status === 'COMPLETED';
  const { isStatusFailed, isFailedPendingConfirmation } =
    useConfirmedFailedStatus({
      status,
      dataUpdatedAt,
      isFetchedAfterMount,
      refetch
    });
  const isProcessing =
    status === 'PROGRESS' ||
    status === 'PENDING' ||
    isFailedPendingConfirmation;

  const displayFileName = useMemo(
    () => getFileNameFromPath(statusData?.data.filePath),
    [statusData?.data.filePath]
  );

  const handleDownload = useCallback(async () => {
    if (!productFileId || isDownloadingRef.current) return;

    isDownloadingRef.current = true;
    setIsDownloading(true);

    try {
      const blob = await getProductFileDownload(productFileId);
      const fileName = getFileNameFromPath(statusData?.data.filePath);
      blobDownload(blob, fileName || 'download');
      void queryClient.invalidateQueries(getAccountMeQueryOptions());
      showToast('다운로드 되었습니다.', { duration: 3000, position: 'top' });
    } catch (err) {
      console.error('파일 다운로드 실패:', err);
    } finally {
      isDownloadingRef.current = false;
      setIsDownloading(false);
    }
  }, [
    productFileId,
    statusData?.data.filePath,
    queryClient,
    showToast
  ]);

  useEffect(() => {
    const isProcessingStatus = status === 'PROGRESS';

    if (isProcessingStatus) {
      const totalTime = 720000;
      const targetProgress = 97;
      const intervalTime = totalTime / targetProgress;

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= targetProgress) return targetProgress;
          return prev + 1;
        });
      }, intervalTime);

      return () => clearInterval(progressInterval);
    }
    if (isStatusCompleted) {
      setProgress(100);
    }
  }, [status, isStatusCompleted]);

  return {
    progress,
    statusData,
    error,
    isStatusCompleted,
    isStatusFailed,
    isProcessing,
    displayFileName,
    isDownloading,
    handleDownload
  };
}
