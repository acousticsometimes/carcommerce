"use client";

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import { AuthContext } from '../authorization/AuthContext'; // Adjust path as needed

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, permissions } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const { access_token } = response.data;
      if (response.data.success) {
        // Login and set the token and permissions in context
        login(access_token);
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  useEffect(() => {
    // Redirect based on permissions once they’re available
    if (permissions) {
      if (permissions.sub.has_admin_permission) {
        router.push('/pages/admin/dashboard');
      } else if (permissions.sub.has_listing_permission) {
        router.push('/pages/agent/dashboard');
      } else if (permissions.sub.has_sell_permission) {
        router.push('/pages/seller/dashboard');
      } else if (permissions.sub.has_buy_permission) {
        router.push('/pages/buyer/dashboard');
      } else {
        setError('Invalid permissions. Please contact IT administrator.');
      }
    }
  }, [permissions, router]); // Watch for permissions to change and redirect
  
  return (
    <div className='flex justify-center items-center h-screen bg-[#f0f0f7] font-rajdhaniSemiBold'>
      <div className='w-96 p-6 border-solid border-4 border-[#f75049]'>
        <h1 className='text-[#f75049] text-2xl'>LOGIN</h1>
        <form onSubmit={handleLogin}>
          <div className='mt-4'>
            <div className='flex justify-between items-center mb-4'>
              <label htmlFor="email" className='text-[#f75049] mr-4'>EMAIL </label>
              <input
                type="email"
                id="email"
                placeholder="enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='border px-2 py-1 focus:outline-none bg-[#f75049] placeholder-[#f0f0f7] text-[#f0f0f7] border-[#f75049] w-2/3'
              />
            </div>
            <div className='flex justify-between items-center mb-4'>
              <label htmlFor="password" className='text-[#f75049] mr-4'>PASSWORD </label>
              <input
                type="password"
                id="password"
                placeholder="enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='border px-2 py-1 focus:outline-none bg-[#f75049] placeholder-[#f0f0f7] text-[#f0f0f7] border-[#f75049] w-2/3'
              />
            </div>
            <button type="submit" className='bg-[#f75049]/60 text-[#f75049] py-1 px-2 hover:bg-[#f75049] hover:text-[#f0f0f7] border-solid border-2 border-[#f75049]'>Login</button>
          </div>
        </form>
        {error && <p className='text-red-500 mt-4'>{error}</p>}
        <p className='absolute bottom-0 left-0 p-4 text-[#f75049]'>THIS PAGE IS UNDER DEVELOPMENT</p>
      </div>
    </div>
  );
}
