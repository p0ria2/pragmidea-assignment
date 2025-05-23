import Link from 'next/link';

export default function TopNavbar() {
  return (
    <div className="h-top-nav bg-primary text-primary-foreground sticky top-0 z-10 flex items-center justify-between px-4 shadow">
      <h1 className="text-2xl font-bold">
        <Link href="/">Pragma Flights</Link>
      </h1>
    </div>
  );
}

