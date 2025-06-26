'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-4xl rounded-3xl shadow-lg overflow-hidden">
        {/* Left side */}
        <div className="hidden md:flex flex-col justify-center items-start w-1/2 bg-gradient-to-br from-lime-200 to-yellow-100 p-12 rounded-l-3xl">
          <span className="text-3xl font-bold text-green-800">Spriggly</span>
        </div>
        {/* Right side (form) */}
        <div className="w-full md:w-1/2 bg-[#f7faef] p-10 flex flex-col justify-center rounded-r-3xl">
          <h2 className="text-4xl font-extrabold text-green-900 mb-6 text-left">Welcome Back</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-green-900 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-green-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-white"
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-green-900 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-green-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-white"
                  placeholder="Password"
                />
                <div className="flex justify-end mt-1">
                  <Link href="#" className="text-xs text-lime-600 hover:underline font-medium">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-green-900 bg-yellow-300 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm text-green-900">
            No account yet?{' '}
            <Link href="/register" className="font-semibold text-lime-700 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
