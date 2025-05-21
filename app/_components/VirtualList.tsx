'use client';

import { cn } from '@/_lib/css-utils';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface Props {
  className?: string;
  loadMore?: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export interface VirtualListRef {
  resetScroll: () => void;
}

const VirtualList = forwardRef<VirtualListRef, Props>(
  ({ className, loadMore, isLoading, children }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      resetScroll: () => {
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      },
    }));

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries[0].isIntersecting && loadMore?.();
        },
        {
          root: containerRef.current,
          rootMargin: '0px 0px 200px 0px',
          threshold: 0,
        }
      );

      if (endRef.current) {
        observer.observe(endRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className={cn('h-full w-full overflow-y-auto', className)}
      >
        {children}

        {isLoading && (
          <span className="mt-2 flex items-center justify-center text-sm opacity-50">
            Loading...
          </span>
        )}

        <div ref={endRef} className="h-1" />
      </div>
    );
  }
);

export default VirtualList;

