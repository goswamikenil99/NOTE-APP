import React, { useState } from 'react'
import Profileinfo from './Card/Profileinfo'
import {useNavigate} from 'react-router-dom'
import SearchBar from './SearchBar/SearchBar';

const Navbar = ({userInfo , onSearchNote , handleClearSearch}) => {
  const navigate=useNavigate();
  const onLogout=()=>{
    localStorage.clear();
    navigate("/login");
  };
  const [SearchQuery,setSearchQuery]=useState("");
  const handleSearch=()=>{
    if(SearchQuery){
      onSearchNote(SearchQuery);
    }
  }
  const onClearSearch=()=>{
    setSearchQuery("");
    handleClearSearch();
  }
  // console.log(userInfo.fullname);
  return (
    <>
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
            <h2 className="text-xl font-medium text-black py-2">Notes</h2>
            <SearchBar
            value={SearchQuery}
            onChange={({target})=>{
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}/>
            <Profileinfo onLogout={onLogout} userInfo={userInfo}/>
        </div>
    </>
  )
}

export default Navbar