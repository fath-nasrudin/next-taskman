import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Taskman</h1>
      <p>Task manager app</p>
      <Link href="/app">Main app</Link>
    </div>
  );
}
