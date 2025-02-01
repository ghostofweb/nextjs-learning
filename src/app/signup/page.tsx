'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: '',
    username: '',
  });

  const [buttonDisable, setButtonDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  // Signup function triggered on form submit
  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      setLoading(true);
      const res = await axios.post('/api/users/signup', user);
      toast.success('Signup Successful!');
      console.log('Response:', res.data);
      router.push('/login');
    } catch (error) {
      console.error('Signup Failed:', error);
      toast.error('Signup Failed!');
    } finally {
      setLoading(false);
    }
  };

  // Enable the button only if all fields have values
  useEffect(() => {
    if (user.email && user.password && user.username) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl mb-4">{loading ? 'Processing...' : 'Signup'}</h1>
      <form onSubmit={onSignup} className="w-full max-w-md">
        {/* Username Field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={user.username}
            placeholder="Username"
            onChange={(e) =>
              setUser({ ...user, username: e.target.value })
            }
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-600 text-black"
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            placeholder="Email"
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-600 text-black"
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={user.password}
            placeholder="Password"
            onChange={(e) =>
              setUser({ ...user, password: e.target.value })
            }
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-600 text-black"
          />
        </div>

        {/* Signup Button */}
        <button
  type="submit"
  disabled={buttonDisable || loading}
  className={`w-full p-2 rounded-lg transition-colors ${loading ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} ${buttonDisable || loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'}`}
>
  {loading ? 'Processing...' : 'Sign Up'}
</button>


      </form>
    </div>
  );
}
