import React, { useState } from 'react'
import TagInput from '../../components/input/TagInput'
import { MdAdd, MdClose } from "react-icons/md";
import axiosInstance from '../../utils/axiosInstance';
import toast, {Toaster} from 'react-hot-toast'

const AddEditNotes = ({noteData,type,onClose,getAllNotes}) => {
  const [title,settitle]=useState(noteData?.title || "");
  const [content,seContent]=useState(noteData?.content ||"");
  const [tags,setTags]=useState(noteData?.tags || []);
  const [error,setError]=useState(null);
  const handleAddNote=()=>{
    console.log(title)
    if(!title){
      setError("Please enter the title");
      toast.error("Please enter the title")
      return;
    }
    if(!content){
      setError("Please enter the content");
      toast.error("Please enter the content")
      return;
    }
    setError("");
    if(type==="edit"){
      editNote();
    }
    else{
      addNewNote();
    }
  };

  //add-note
  const addNewNote= async ()=>{
    try{
      const response = await axiosInstance.post("/add-note",{
        title,
        content,
        tags,
      });
      if(response.data && response.data.note){
        toast.success("Note Add Successfully")
        getAllNotes();
        onClose();
      }
    }catch(error){
      if(error.response && response.data && response.data.message){
        setError(error.response.data.message);
        toast.error(error.response.data.message)
      }
    }
  };

  //edit-note
  const editNote=async ()=>{
    const noteId=noteData._id;
    try{
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });
      if(response.data && response.data.note){
        toast.success("Note Edited Successfully")
        getAllNotes();
        onClose();
      }
    }catch(error){
      if(error.response && response.data && response.data.message){
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      }
    }
  };
  return (
    <div className='relative'>
      <Toaster/>
      <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50">
            <MdClose className="text-xl text-slate-400"/>
        </button>
        <div className='flex flex-col gap-2'>
            <label className='input-lable '>TITLE</label>
            <input type="text" className='text-2xl text-slate-950 outline-none ' placeholder='Go To Gym At 5' 
            value={title} 
            onChange={(e)=>{settitle(e.target.value)}}/>
        </div>
        <div className='flex flex-col gap-2 mt-4'>
            <label className='input-lable'>CONTENT</label>
            <textarea type="text"
            className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
            placeholder='Content'
            rows={10}
            value={content} 
            onChange={(e)=>{seContent(e.target.value)}}/>
        </div>
        <div className='mt-3' >
            <label className='input-lable'>TAGS</label>
            <TagInput tags={tags} setTags={setTags}/>
        </div>
        {error && <p className='text-red-500 text-xs pr-4 '>{error}</p>}
        <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>{type === "edit" ? "UPDATE" : "ADD"}</button>
    </div>
  );
}

export default AddEditNotes