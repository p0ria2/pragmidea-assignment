import { Loader2 } from 'lucide-react';
import { Button } from './button';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof Button> & {
  isLoading?: boolean;
};

export default function LoadingButton({
  isLoading,
  children,
  ...props
}: Props) {
  return (
    <Button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : children}
    </Button>
  );
}

