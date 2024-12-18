import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="mt-8 text-center text-muted-foreground">
      <h2 className="text-xl">Not Found</h2>
      <p>Project not found</p>
      <Link href="/app" className="text-red-500">
        Return Home
      </Link>
    </div>
  );
}
