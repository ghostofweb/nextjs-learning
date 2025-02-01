import React, { useState } from 'react'
import axios from 'axios'

export default function page (){

  const [user,setUser] = useState({
    email:"",
    password:"",
    username:"",
  })

  const [buttonDisable,setButtonDisable] = useState(false)
  const [loading,setLoading] = useState(true)

  const onSignup = async ()=>{
    try {
      
    } catch (error) {
      console.log("Signup Failed")
    }
  }
  return(
    <div>
    hello world
    </div>
  )
}
