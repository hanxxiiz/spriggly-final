'use client'

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function AuthForm() {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);
  
  const [signUpError, setSignUpError] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const showRegister = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 600); 
    setIsActive(true);
    setSignInError('');
    setSignUpError('');
  };

  const showLogin = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 600); 
    setIsActive(false);
    setSignInError('');
    setSignUpError('');
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignInError('');
    setSignInLoading(true);

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
        setSignInError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setSignInError('An error occurred. Please try again.');
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setSignUpError('Passwords do not match');
      setSignUpLoading(false);
      return;
    }

    if (!agree) {
      setSignUpError('You must agree to the Terms of Use');
      setSignUpLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username, 
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsActive(false);
      setSignUpError('');
      setSignInError('Registration successful! Please sign in.');
    } catch (error: any) {
      setSignUpError(error.message);
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-800 flex items-center justify-center p-5`}>
      <div className={`relative w-full max-w-4xl h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-1000 ${isActive ? 'active' : ''}`}>
        
        {/* SIGNIN FORM */}
        <div className={`absolute ${isActive ? 'right-1/2' : 'right-0'} w-1/2 h-full bg-white flex items-center justify-center text-slate-800 text-center 
          p-10 z-10 transition-all duration-700 ease-in-out delay-1000 max-md:w-full max-md:h-[70%] max-md:bottom-0 max-md:right-0 ${isActive ? 'max-md:bottom-[30%]' : ''}`}>
          <form onSubmit={handleSignIn} className="w-full max-w-sm">
            <h1 className="text-4xl font-bold mb-8 text-slate-800">Sign in</h1>
            
            {signInError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {signInError}
              </div>
            )}
            
            <div className="relative mb-6 max-md:mb-2">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base max-md:text-sm text-slate-800 font-medium placeholder-gray-500"
              />
              <MdEmail className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
            </div>
            
            <div className="relative mb-1">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base max-md:text-sm text-slate-800 font-medium placeholder-gray-500"
              />
              <RiLockPasswordLine className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
            </div>
            
            <div className="text-left ml-4 mb-6 max-md:mb-4">
              <a href="#" className="text-sm max-md:text-xs text-slate-800 hover:text-blue-600 transition-colors">
                Forgot password?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={signInLoading}
              className="w-full h-[48px] text-white font-semibold text-[16px] rounded-xl shadow-lg border-none cursor-pointer 
                      bg-gradient-to-tr from-[#076653] to-[#0c342c] shadow-sm
                      hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      transition-transform duration-300 ease-in-out"             >
              {signInLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* SIGN UP FORM */}
        <div className={`absolute ${isActive ? 'right-1/2 visible' : 'right-0 invisible'} w-1/2 h-full bg-white flex items-center justify-center text-slate-800 text-center p-10 z-10 transition-all duration-700 ease-in-out delay-1000 max-md:w-full max-md:h-[70%] max-md:bottom-0 max-md:right-0 ${isActive ? 'max-md:bottom-[30%] max-md:visible' : 'max-md:invisible'}`}>
          <form onSubmit={handleSignUp} className="w-full max-w-sm">
            <h1 className="max-md:mt-20 text-4xl font-bold mb-6 text-slate-800">Sign up</h1>
            
            {signUpError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {signUpError}
              </div>
            )}
            
            <div className="relative mb-6 max-md:mb-2">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base max-md:text-sm text-slate-800 font-medium placeholder-gray-500"
              />
              <FaUser className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
            </div>
            
            <div className="relative mb-6 max-md:mb-2">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base max-md:text-sm text-slate-800 font-medium placeholder-gray-500"
              />
              <MdEmail className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
            </div>
            
            <div className="relative mb-6 max-md:mb-2">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base max-md:text-sm text-slate-800 font-medium placeholder-gray-500"
              />
              <RiLockPasswordLine className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
            </div>
            
            <div className="relative mb-2">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg border-none outline-none text-base max-md:text-sm text-slate-800 font-medium placeholder-gray-500"
              />
              <RiLockPasswordLine className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-500" />
            </div>
            
            <div className="flex items-center ml-2 mb-6">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agree" className="text-sm max-md:text-xs text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-[#0c342c] hover:text-[#076653]">
                  Terms of Use
                </a>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={signUpLoading}
              className="w-full h-[48px] text-white font-semibold text-[16px] rounded-xl shadow-lg border-none cursor-pointer 
                      bg-gradient-to-tr from-[#076653] to-[#0c342c] shadow-sm
                      hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      transition-transform duration-300 ease-in-out"             >
              {signUpLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        </div>

        {/* Toggle Panel Background */}
        <div className="absolute w-full h-full">
          <div className={`absolute ${isActive ? 'left-1/2' : '-left-[250%]'} w-[300%] h-full 
          bg-gradient-to-bl from-[#e2fbce] via-[#e3ef26] to-[#076653] rounded-[150px] z-20 transition-all duration-1000 ease-in-out 
          max-md:w-full max-md:h-[300%] max-md:rounded-[20vw] max-md:left-0 ${isActive ? 'max-md:top-[80%]' : 'max-md:-top-[270%]'}`}></div>
        </div>


        {/* Toggle Panel Left */}
        <div className={`absolute ${isActive ? '-left-1/2' : 'left-0'} w-1/2 h-full text-white flex flex-col justify-center items-center transition-all duration-700 ease-in-out z-30 ${isActive ? 'delay-500' : 'delay-1000'} max-md:w-full max-md:h-[30%] max-md:top-0 max-md:left-0 ${isActive ? 'max-md:-top-[30%] max-md:invisible' : 'max-md:visible'}`}>
          <h1 className="text-4xl max-md:text-2xl font-bold mb-1 max-md:mb-0 ">Hello, Welcome!</h1>
          <p className="text-base max-md:text-xs mb-5 max-md:mb-2 text-center px-8">Don't have an account?</p>
          <button
            onClick={showRegister}
            className="w-40 h-12 max-md:h-7 max-md:w-25 bg-transparent border-2 border-white rounded-lg cursor-pointer text-base max-md:text-xs  text-white font-semibold hover:bg-white hover:text-[#0c342c] transition-all duration-200"
          >
            Sign up
          </button>
        </div>

        {/* Toggle Panel Right */}
        <div className={`absolute ${isActive ? 'right-0' : '-right-1/2'} w-1/2 h-full text-white flex flex-col justify-center items-center transition-all duration-700 ease-in-out z-30 ${isActive ? 'delay-1000' : 'delay-500'} max-md:w-full max-md:h-[20%] max-md:right-0 max-md:bottom-0 ${isActive ? 'max-md:visible' : 'max-md:invisible'}`}>
          <h1 className="text-4xl max-md:text-2xl font-bold mb-1 max-md:mb-0 ">Welcome Back!</h1>
          <p className="text-base max-md:text-xs mb-5 max-md:mb-2 text-center px-8">Already have an account?</p>
          <button
            onClick={showLogin}
            className="w-40 h-12 max-md:h-7 max-md:w-25 bg-transparent border-2 border-white rounded-lg cursor-pointer text-base max-md:text-xs  text-white font-semibold hover:bg-white hover:text-[#0c342c] transition-all duration-200"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}