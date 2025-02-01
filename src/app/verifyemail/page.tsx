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
      await axios.post("api/user/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl'>Verify Email</h1>
      <h2 className='p-4 bg-green'>
        {token ? `${token}` : "no token"}
      </h2>
      {verified && (
        <div>
          Verified
          <Link href="/login">Go to Login</Link>
        </div>
      )}
      {error && (
        <div>
          <h2>Error occurred during verification</h2>
        </div>
      )}
    </div>
  );
}
