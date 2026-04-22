import {
  forwardRef,
  isValidElement,
  type ComponentRef,
  type PropsWithChildren
} from 'react';
import {
  StyledSkeleton,
  type StyledSkeletonProps
} from '#components/Skeleton/Skeleton.style.ts';

type SkeletonElement = ComponentRef<'span'>;

export type SkeletonProps = PropsWithChildren<StyledSkeletonProps> & {
  loading: boolean;
};

export const Skeleton = forwardRef<SkeletonElement, SkeletonProps>(
  (props, ref) => {
    const { loading, children, ...rest } = props;

    if (!loading) {
      return children;
    }

    return (
      <StyledSkeleton
        ref={ref}
        aria-hidden
        data-inline-skeleton={isValidElement(children) ? undefined : true}
        tabIndex={-1}
        {...rest}
      >
        {children}
      </StyledSkeleton>
    );
  }
);

Skeleton.displayName = 'Skeleton';
