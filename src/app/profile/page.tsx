'use client'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function Profilepage() {
  const router = useRouter();
  const [data, setData] = useState<{
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    isAdmin: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserDetails = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setData(res.data.data);
    } catch (error: any) {
      console.error(error.response?.data);
      toast.error('Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      toast.success('Logout successful');
      router.push('/login');
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl">Loading profile...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl">Nothing here</h1>
        <p className="mt-4">
          <Link href="/login" className="text-blue-500">
            Return to login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Profile</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username:
          </label>
          <p className="text-gray-700 break-all">{data.username}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <p className="text-gray-700 break-all">{data.email}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Verified:
          </label>
          <p className="text-gray-700">
            {data.isVerified ? '✅ Verified' : '❌ Not Verified'}
          </p>
          {!data.isVerified && (
            <Link href="/verifyemail" className="text-blue-500 text-sm mt-2 block">
              Resend verification email
            </Link>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

}