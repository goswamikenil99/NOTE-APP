import React, { useState } from 'react'
import { validEmail } from '../../utils/helper'
import Navbar from '../../components/Navbar'
import {Link , useNavigate} from "react-router-dom"
import PasswordInput from '../../components/input/PasswordInput'
import axiosInstance from '../../utils/axiosInstance'
import toast, {Toaster} from 'react-hot-toast'
function Signup() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);
  const navigate=useNavigate();
  const handleSihpUp= async (e)=>{
    e.preventDefault();
    if(!name){
      setError("Pleas Enter Username.");
      return;
    }
    if(!validEmail(email)){
      setError("Pleas Enter a Valid Email Address.");
      return;
    }
    if(!password){
      setError("Pleas Enter Password.");
      return;
    }
    setError("");

    //sign-up api call

    try{
      const response= await axiosInstance.post("/create-account",{
        fullname : name,
        email : email,
        password : password,
      });

      if(response.data && response.data.error){
        setError(response.data.message);
        toast(response.data.message, {
          icon: '👨‍💼',
        });
        return;
      }

      if(response.data && response.data.AccessToken){
        console.log("hello");
        localStorage.setItem("token",response.data.AccessToken);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
        toast.success("SignUp Successfully Completed.")
      }
    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
        toast.error(error.response.data.message);
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
          <form onSubmit={handleSihpUp}>
            <h4 className="text-2xl mb-7">SignUp</h4>
            <input type="text" placeholder='Name' className='input-box' value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type="text" placeholder='Emai' className='input-box' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            {<PasswordInput value={password} onChange={(e)=>setPassword(e.target.value)}/>}
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type='submit' className='btn-primary' >Create Account</button>
            <p className='text-sm text-center mt-4'>
              Already have an Account?{" "}
              <Link to="/login" className="font-medium underline text-primary">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup