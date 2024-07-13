import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import {Link , useNavigate} from "react-router-dom"
import PasswordInput from '../../components/input/PasswordInput'
import { validEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import toast, {Toaster} from 'react-hot-toast'
function  Login() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);

  const navigate=useNavigate();

  const handleLogin= async (e)=>{
    e.preventDefault();
    if(!validEmail(email)){
      setError("Pleas Enter a Valid Email Address.");
      return;
    }
    if(!password){
      setError("Pleas Enter Password.");
      return;
    }
    setError("");

    //login api call
    try{
      const response= await axiosInstance.post("/login",{
        email : email,
        password : password,
      });

      if(response.data && response.data.AccessToken){
        localStorage.setItem("token",response.data.AccessToken);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
        toast.success("Login Successfully Completed.")
      }
    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
        toast.error(error.response.data.message)
      }
      else{
        setError("An unexpected error occurred.");
      }
    }
  }
  return (
    <>
      <Toaster/>
      <div className='flex items-center justify-center m-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>
            <input type="text" placeholder='Email' className='input-box' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            {<PasswordInput value={password} onChange={(e)=>setPassword(e.target.value)}/>}
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type='submit' className='btn-primary' >Login</button>
            <p className='text-sm text-center mt-4'>
              Not registerd yet?{" "}
              <Link to="/signup" className="font-medium underline text-primary">Create an Account</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login