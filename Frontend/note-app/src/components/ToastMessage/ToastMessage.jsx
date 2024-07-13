import React from 'react'
import toast, {Toaster} from 'react-hot-toast'

const ToastMessage = ({message,type}) => {
    if(message == null){
        return;
    }
    else if(type == "success"){
        toast.success(message);
    }
    else{
        toast.error(message);
    }
  return (
    <div><Toaster/></div>
  )
}

export default ToastMessage