import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function Page() {  // Capitalized component name (Next.js best practice)
  const router = useRouter()
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisable, setButtonDisable] = useState(false);
  const [loading, setLoading] = useState(false); // Initially false

  const onSignup = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/users/signup", user); // Send user data
      toast.success("Signup Successful!");
      router.push("/login")
      console.log("Response:", res.data);
    } catch (error) {
      console.error("Signup Failed:", error);
      toast.error("Signup Failed!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0){
     setButtonDisable(false) 
    }else{
      setButtonDisable(true)
    }
  },[])
  return (
    <div>
      <h1>Hello World</h1>
      <button onClick={onSignup} disabled={loading}>
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </div>
  );
}
