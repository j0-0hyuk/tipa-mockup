import { useMemo } from 'react';
import { IconButton } from '#components/IconButton/IconButton.tsx';
import {
  PaginationContainer,
  PaginationPages,
  StyledPaginationButton
} from '#components/Pagination/Pagination.style.ts';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';

const DOTS = '...';

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPage,
  onPageChange,
  siblingCount = 1
}: PaginationProps) {
  const paginationRange = useMemo(() => {
    if (totalPage <= 1) return [];

    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPage) {
      return range(1, totalPage);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPage);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPage - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPage;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPage];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPage - rightItemCount + 1, totalPage);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  }, [totalPage, currentPage, siblingCount]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      onPageChange(currentPage + 1);
    }
  };

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  return (
    <PaginationContainer>
      <IconButton
        type="button"
        variant="text"
        size="small"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={24} />
      </IconButton>

      <PaginationPages>
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <IconButton
                key={`dots-${index}`}
                type="button"
                variant="text"
                size="small"
                disabled
              >
                <Ellipsis size={24} strokeWidth={1.5} />
              </IconButton>
            );
          }

          const isCurrent = pageNumber === currentPage;

          return (
            <StyledPaginationButton
              key={pageNumber}
              type="button"
              $active={isCurrent}
              onClick={() => onPageChange(pageNumber as number)}
            >
              <span className="pagination-button-inner">{pageNumber}</span>
            </StyledPaginationButton>
          );
        })}
      </PaginationPages>

      <IconButton
        type="button"
        variant="text"
        size="small"
        onClick={handleNextPage}
        disabled={currentPage === totalPage}
      >
        <ChevronRight size={24} />
      </IconButton>
    </PaginationContainer>
  );
}
