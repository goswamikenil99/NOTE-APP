import React, { useState } from "react";
import { getInitials } from "../../utils/helper";
const Profileinfo = ({ onLogout , userInfo}) => {
  return (
    <>
      <div className="flex items-center gap-3">
          <button className="text-sm text-white px-10 py-3 transition duration-300 ease-in-out transform hover:text-slate-900 hover:underline-offset-2 hover:scale-105 hover:bg-slate-200 px-3 py-1 rounded bg-blue-500" onClick={onLogout}>
            Logout
          </button>
        </div>
    </>
  );
};

export default Profileinfo;
