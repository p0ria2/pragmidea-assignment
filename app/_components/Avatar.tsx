import { UserRoundIcon } from 'lucide-react';

interface Props {
  imageUrl?: string | null;
  fallback?: string;
}

export default function Avatar({ imageUrl, fallback }: Props) {
  return (
    <div className="relative size-8 overflow-hidden rounded-full border">
      {imageUrl ? (
        <img src={imageUrl} alt="User avatar" />
      ) : (
        <div className="bg-muted flex h-full w-full items-center justify-center">
          {fallback ? (
            <span
              className="text-muted-foreground text-sm"
              data-testid="avatar-fallback"
            >
              {fallback}
            </span>
          ) : (
            <UserRoundIcon className="text-muted-foreground size-fit" />
          )}
        </div>
      )}
    </div>
  );
}

