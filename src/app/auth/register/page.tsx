'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (!agree) {
      setError('You must agree to the Terms of Use');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/auth/login');
    } catch (error: any) {
      setError(error.message);
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
          <h2 className="text-4xl font-extrabold text-green-900 mb-6 text-left">Create an account</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            <div className="flex space-x-3">
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="block w-1/2 px-4 py-3 border border-gray-300 rounded-lg text-green-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-white"
                placeholder="First Name"
              />
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="block w-1/2 px-4 py-3 border border-gray-300 rounded-lg text-green-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-white"
                placeholder="Last Name"
              />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-green-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-white"
              placeholder="Username"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-green-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-white"
              placeholder="Password"
            />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-green-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-white"
              placeholder="Confirm Password"
            />
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-green-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 bg-white"
              placeholder="Email"
            />
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-green-900">
                I accept and agree to the{' '}
                <a href="#" className="underline text-lime-700">Terms of Use</a>.
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-green-900 bg-yellow-300 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-green-900">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-lime-700 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
