'use client'

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function AuthForm() {
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);
  
  const [signUpError, setSignUpError] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const showRegister = () => {
    setIsActive(true);
    setSignInError('');
    setSignUpError('');
  };

  const showLogin = () => {
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

  // FOR GOOGLE SIGN IN !!! TO BE IMPLEMENTED !!!
  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/dashboard',
      });
    } catch (error) {
      setSignInError('Failed to sign in with Google');
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        background: 'linear-gradient(to right, #06231d, #0c342c, #076653)',
      }}
    >
      <div className={`relative w-[900px] h-[600px] max-md:h-calc(100vh) bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] m-5 overflow-hidden transition-all duration-[600ms] ease-in-out ${isActive ? 'active' : ''}`}>
        
        {/* SIGN IN FORM */}
        <div className={`absolute w-1/2 max-md:bottom-0 h-full max-md:w-full max-md:h-[70%] flex items-center justify-center text-[#333] text-center p-10 z-[1] transition-all duration-[600ms] ease-in-out ${
          isActive ? 'right-full invisible max-md:right-0 max-md:bottom-[30%]' : 'right-0 visible'
        }`}>
          <form onSubmit={handleSignIn}>
            <h1 className="text-[36px] font-bold my-2">Sign in</h1>
            
            {signInError && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <div className="text-sm text-red-700">{signInError}</div>
              </div>
            )}
            
            <div className="relative my-2">
              <MdEmail className="absolute right-10 top-1/2 -translate-y-1/2 text-[20px] text-[#888]" />
              <input
                id="signin-email"
                name="email"
                type="email"
                required
                className="w-full pt-[13px] pr-[50px] pb-[13px] pl-[20px] bg-[#eee] border-none rounded-xl outline-none text-[16px] text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
                placeholder="Email"
              />
            </div>
            
            <div className="relative my-2">
              <RiLockPasswordLine className="absolute right-10 top-1/2 -translate-y-1/2 text-[20px] text-[#888]" />
              <input
                id="signin-password"
                name="password"
                type="password"
                required
                className="w-full pt-[13px] pr-[50px] pb-[13px] pl-[20px] bg-[#eee] border-none rounded-xl outline-none text-[16px] text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
                placeholder="Password"
              />
            </div>
            
            <div className="w-full text-right mt-[-30px] mb-[15px] ">
              <a href="#" className="text-[14.5px] text-[#333] no-underline hover:underline">
                Forgot password?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={signInLoading}
              className="w-full h-[48px] text-white font-semibold text-[16px] rounded-xl shadow-lg border-none cursor-pointer 
                      bg-gradient-to-tr from-[#076653] to-[#0c342c] shadow-sm
                      hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      transition-transform duration-300 ease-in-out"
            >
              {signInLoading ? 'Signing in...' : 'Sign in'}
            </button>
            
            <div className="flex items-center gap-4 my-2">
              <div className="h-px flex-1 bg-[#ccc]"></div>
              <p className="text-[14.5px] text-[#888]">or</p>
              <div className="h-px flex-1 bg-[#ccc]"></div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:scale-105 
                      transition-transform duration-300 ease-in-out cursor-pointer"
            >
              <FcGoogle className="text-2xl" />
              <span className="text-sm font-medium text-gray-700">
                Sign in with Google
              </span>
            </button>
          </form>
        </div>

        {/* SIGN UP FORM */}
        <div className={`absolute w-1/2 max-md:bottom-0 h-full max-md:w-full max-md:h-[70%] flex items-center justify-center text-[#333] text-center p-10 z-[1] transition-all duration-[600ms] ease-in-out ${
          isActive ? 'left-0 opacity-100 max-md:left-0 max-md:bottom-[30%] pointer-events-auto visible' : 'left-0 opacity-0 invisible pointer-events-none'
        }`}>
          <form onSubmit={handleSignUp}>
            <h1 className="text-[36px] font-bold my-2">Sign up</h1>
            
            {signUpError && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <div className="text-sm text-red-700">{signUpError}</div>
              </div>
            )}
            
            <div className="relative my-2">
              <FaUser className="absolute right-10 top-1/2 -translate-y-1/2 text-[20px] text-[#888]" />
              <input
                id="signup-username"
                name="username"
                type="text"
                required
                className="w-full pt-[13px] pr-[50px] pb-[13px] pl-[20px] bg-[#eee] border-none rounded-xl outline-none text-[16px] text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
                placeholder="Username"
              />
            </div>
            
            <div className="relative my-2">
              <MdEmail className="absolute right-10 top-1/2 -translate-y-1/2 text-[20px] text-[#888]" />
              <input
                id="signup-email"
                name="email"
                type="email"
                required
                className="w-full pt-[13px] pr-[50px] pb-[13px] pl-[20px] bg-[#eee] border-none rounded-xl outline-none text-[16px] text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
                placeholder="Email"
              />
            </div>
            
            <div className="relative my-2">
              <RiLockPasswordLine className="absolute right-10 top-1/2 -translate-y-1/2 text-[20px] text-[#888]" />
              <input
                id="signup-password"
                name="password"
                type="password"
                required
                className="w-full pt-[13px] pr-[50px] pb-[13px] pl-[20px] bg-[#eee] border-none rounded-xl outline-none text-[16px] text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
                placeholder="Password"
              />
            </div>
            
            <div className="relative my-2">
              <RiLockPasswordLine className="absolute right-10 top-1/2 -translate-y-1/2 text-[20px] text-[#888]" />
              <input
                id="signup-confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full pt-[13px] pr-[50px] pb-[13px] pl-[20px] bg-[#eee] border-none rounded-xl outline-none text-[16px] text-[#333] font-medium placeholder:text-[#888] placeholder:font-normal"
                placeholder="Confirm Password"
              />
            </div>
            
            <div className="flex items-center justify-start my-3 px-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="h-4 w-4 text-[#076653] focus:ring-[#076653] border-gray-300 rounded mr-2"
              />
              <label htmlFor="terms" className="text-sm text-[#333]">
                I accept and agree to the{' '}
                <a href="#" className="underline text-[#076653] hover:text-[#0c342c]">Terms of Use</a>.
              </label>
            </div>
            
            <button
              type="submit"
              disabled={signUpLoading}
              className="w-full h-[48px] my-2 text-white font-semibold text-[16px] rounded-xl shadow-lg border-none cursor-pointer 
                      bg-gradient-to-tr from-[#076653] to-[#0c342c] shadow-sm
                      hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      transition-transform duration-300 ease-in-out"          
            >
              {signUpLoading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        </div>

        {/* TOGGLE BOX */}
        <div className={`absolute w-full h-full transition-all duration-[1800ms] ease-in-out
          before:absolute before:content-[''] before:w-[300%] before:h-full before:bg-gradient-to-bl before:from-[#e2fbce] before:via-[#e3ef26] before:to-[#076653] before:rounded-[150px] before:z-[2] before:transition-all before:duration-[1800ms] before:ease-in-out
          max-md:before:left-0  max-md:before:top-[-270%]  max-md:before:w-full  max-md:before:h-[300%]  max-md:before:rounded-[20vw]  ${
          isActive 
            ? 'before:left-1/2 max-md:before:left-0 max-md:before:top-[70%]' 
            : 'before:left-[-250%]'
        }`}>
          
          {/* TOGGLE LEFT PANEL*/}
          <div className={`absolute w-1/2 max-md:w-full h-full max-md:h-[30%] max-md:right-0 max-md:bottom-0 text-white flex flex-col justify-center items-center z-[2] transition-all duration-[600ms] ease-in-out ${
            isActive 
              ? 'right-0 opacity-100 delay-[1200ms] max-md:bottom-0 ' 
              : 'right-[-50%] opacity-0 delay-[600ms]' 
          }`}>
            <h1 className="text-4xl max-md:text-3xl font-bold my-1 text-white">Welcome back!</h1>
            <p className="my-1 text-sm max-md:text-xs text-center ">Already have an account?</p>
            <button 
              type="button" 
              onClick={showLogin}
              className="w-[160px] h-[46px] max-md:w-28 max-md:h-10 bg-transparent border-2 border-white shadow-none rounded-xl text-white hover:bg-white hover:text-[#0c342c] transition-all duration-300 cursor-pointer"
            >
              Sign in
            </button>
          </div>

          {/* TOGGLE RIGHT PANEL*/}
          <div className={`absolute w-1/2 max-md:w-full h-full max-md:h-[30%] max-md:top-0 text-white flex flex-col justify-center items-center z-[2] transition-all duration-[600ms] ease-in-out ${
            isActive 
              ? 'left-[-50%] opacity-0 delay-[600ms] max-md:left-0 max-md:top-[-30%]' 
              : 'left-0 opacity-100 delay-[1200ms]'
          }`}>
            <h1 className="text-4xl max-md:text-3xl font-bold m-1 text-white">Welcome!</h1>
            <p className="my-1 text-sm max-md:text-xs text-center ">Don't have an account?</p>
            <button 
              type="button" 
              onClick={showRegister}
              className="w-[160px] h-[46px] max-md:w-28 max-md:h-10 bg-transparent border-2 border-white shadow-none rounded-xl text-white hover:bg-white hover:text-[#0c342c] transition-all duration-300 cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}