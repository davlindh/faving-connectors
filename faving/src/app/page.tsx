import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Faving</h1>
      <p className="text-xl mb-8">Connect, Collaborate, and Create Amazing Projects</p>
      <div className="flex gap-4">
        <Link href="/projects" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Explore Projects
        </Link>
        <Link href="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Join Now
        </Link>
      </div>
    </main>
  );
}