'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch token directly from query params
  useEffect(() => {
    const urlToken = searchParams.get('token'); // Directly get the token from the query
    if (urlToken) {
      setToken(urlToken);
      verifyUserEmail(urlToken);
    }
  }, [searchParams]);

  const verifyUserEmail = async (token: string) => {
    try {
      const response = await axios.post("api/user/verifyemail", { token });
      
      // Handle success
      if (response.data.status === 'success') {
        setVerified(true);
        setStatusMessage("Your email has been successfully verified!");
      } else {
        setError(true);
        setStatusMessage("Verification failed, please try again.");
      }
    } catch (error: any) {
      setError(true);
      setStatusMessage("An error occurred while verifying the email.");
      console.log(error.response?.data);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl mb-4'>Verify Email</h1>
      <h2 className='p-4 mb-4 bg-green'>
        {token ? `Token: ${token}` : "No token found"}
      </h2>

      {statusMessage && (
        <div className={`mb-4 ${verified ? 'text-green-600' : 'text-red-600'}`}>
          {statusMessage}
        </div>
      )}

      {verified && (
        <div>
          Email Verified!
          <Link href="/login" className='text-blue-500'>
            Go to Login
          </Link>
        </div>
      )}

      {error && (
        <div className='text-red-600'>
          <h2>Error occurred during verification.</h2>
        </div>
      )}
    </div>
  );
}
