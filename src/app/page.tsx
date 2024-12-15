import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen p-4 text-center flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-red-500">Taskman</h1>
      <p>A task manager app to help you manage your day</p>
      <Link href="/app" className="text-red-500">
        Go to App
      </Link>
    </div>
  );
}
