import * as React from 'react';

import { cn } from '@/_lib/css-utils';
import { LucideIcon } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactElement<React.ComponentProps<LucideIcon>>;
  endIcon?: React.ReactElement<React.ComponentProps<LucideIcon>>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    const StartIcon = startIcon
      ? React.cloneElement(startIcon, {
          className: cn(startIcon.props?.className, 'text-muted-foreground'),
          size: 18,
        })
      : null;

    const EndIcon = endIcon
      ? React.cloneElement(endIcon, {
          className: cn(endIcon.props?.className, 'text-muted-foreground'),
          size: 18,
        })
      : null;

    return (
      <div className="relative w-full">
        {StartIcon && (
          <div className="absolute top-1/2 left-1.5 -translate-y-1/2 transform">
            {StartIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-4 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            startIcon ? 'pl-8' : '',
            endIcon ? 'pr-8' : '',
            className
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
            {EndIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };

