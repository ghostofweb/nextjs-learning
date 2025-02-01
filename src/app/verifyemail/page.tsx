'use client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const verifyUserEmail = async () => {
    try {
      if (!token) return;  // Ensure token exists before making the request
      const response = await axios.post('/api/user/verifyemail', { token });

      // Assuming the API returns a success message or status
      if (response.data.status === 'success') {
        setVerified(true);
        setSuccessMessage('Your email has been successfully verified!');
      } else {
        throw new Error('Verification failed');
      }
    } catch (error: any) {
      setError(true);
      console.error('Error verifying email:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    // Get token from URL query params
    const urlToken = router.query.token as string | undefined;
    if (urlToken) {
      setToken(urlToken);
      verifyUserEmail(); // Call verify when token is available
    }
  }, [router.query]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl'>Verify Email</h1>
      {token ? (
        <h2 className='p-4 bg-green-500 text-white'>
          Token: {token}
        </h2>
      ) : (
        <h2 className='p-4 bg-red-500 text-white'>
          No token found.
        </h2>
      )}
      
      {verified && successMessage && (
        <div className='mt-4'>
          <h3 className='text-green-500'>{successMessage}</h3>
          <Link href="/login" className="mt-4 text-blue-500 hover:underline">
            Go to Login
          </Link>
        </div>
      )}

      {error && (
        <div className='mt-4'>
          <h2 className='text-red-500'>Error verifying email. Please try again.</h2>
        </div>
      )}
    </div>
  );
}
