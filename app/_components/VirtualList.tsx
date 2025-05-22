'use client';

import { cn } from '@/_lib/css-utils';
import { Loader2 } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface Props {
  className?: string;
  loadMore?: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  rootMode?: 'container' | 'viewport';
}

export interface VirtualListRef {
  resetScroll: () => void;
}

const VirtualList = forwardRef<VirtualListRef, Props>(
  (
    {
      className,
      loadMore,
      isLoading,
      children,
      disabled,
      rootMode = 'container',
    },
    ref
  ) => {
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
      if (disabled || !endRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries[0].isIntersecting && loadMore?.();
        },
        {
          root: rootMode === 'container' ? containerRef.current : null,
          rootMargin: '0px 0px 200px 0px',
          threshold: 0,
        }
      );

      observer.observe(endRef.current);

      return () => {
        observer.disconnect();
      };
    }, [disabled, loadMore]);

    return (
      <div ref={containerRef} className={cn('h-full w-full', className)}>
        {children}

        {isLoading && (
          <span className="mt-2 flex items-center justify-center text-sm opacity-50">
            <Loader2 className="text-primary size-4 animate-spin" />
          </span>
        )}

        <div ref={endRef} className="h-1" />
      </div>
    );
  }
);

export default VirtualList;

