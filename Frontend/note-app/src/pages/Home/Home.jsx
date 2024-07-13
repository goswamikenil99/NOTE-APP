import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import NoteCard from "../../components/Card/NoteCard";
import { MdAdd } from "react-icons/md";
import moment from "moment"
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import toast, {Toaster} from 'react-hot-toast'
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNoteImg from "../../assets/images/add-note-img.svg"
function Home() {
  const [openAddEditModal, setopenAddEditModal] = useState({
    isShow: false,
    type: "add",
    data: null,
  });
  const [allNotes,setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showToastMsg,setShowToastMsg]= useState({
    type : "success",
    message : null,
  });
  const [isSearch,setIsSearch] = useState(false);
  const navigate = useNavigate();

  const handleEdit=(noteDetails)=>{
    setopenAddEditModal({isShow : true , type : "edit" , data : noteDetails});
  }

  //get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      // console.log(response.data.user.fullname);
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      localStorage.clear();
      navigate("/login");
    }
  };

  //get all note
  const getAllNotes = async () => {
    const response = await axiosInstance.get("/get-all-notes");
    try {
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } 
    catch (error) {
      console.log("An unexpected error occured");
    }
  };

  //delete note
  const deleteNote=async (data)=>{
    const noteId=data._id;
    try{
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if(response.data && !response.data.error){
        toast.success("Note Deleted Successfully")
        getAllNotes();
        onClose();
      }
    }catch (error) {
      if(error.response && response.data && response.data.message){
        toast.error(error.response.data.message)
      }
    }
  }

  //search for notes
  const OnSearchNote = async (query)=>{
    try{
      const response = await axiosInstance.get("/search-notes",{
        params : {query}
      });
      if(response.data && response.data.notes){
        if(response.data.notes.length === 0){return toast.error("Note Note Found");}
        toast.success("Notes Found Successfully");
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    }catch(error){
      if(error.response.data && error.response.data.message){
        toast.error("Note Note Found");
      }
    }
  }

  const handleClearSearch = ()=>{
    setIsSearch(false);
    getAllNotes();
  }

  //update is pinned
  const updatePinned = async (item)=>{
    
    const noteId=item._id;
    try{
      const response = await axiosInstance.put("/update-note-pinned/" + item._id, {
        isPinned : !item.isPinned
      });
      if(response.data && response.data.note){
        if(item.isPinned){
          toast.success("Note Un-Pinned Successfully")
        }
        else{
          toast.success("Note Pinned Successfully")
        }
        getAllNotes();
      }
    }catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);
  // console.log(allNotes[0].title);
  // allNotes.map((item)=>(console.log(item.title)))
  return (
    <>
    <Toaster/>
      <Navbar userInfo={userInfo} onSearchNote={OnSearchNote} handleClearSearch={handleClearSearch}/>
      <div className="container px-10">
        {allNotes.length > 0 ? <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item)=>(
            <NoteCard
            key={item._id}
            title={item.title}
            date={moment(item.createdOn).format('Do MMM YYYY')}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit={() => handleEdit(item)}
            onDelete={() => deleteNote(item)}
            onPinNote={() => updatePinned(item)}
          />
          ))}
        </div> : 
        <EmptyCard imgSrc={AddNoteImg} message={`Start Creating Your Firdt Note By Click The 'Add' Button to Put Down Your Thoughts, ideas And Reminders. Lets Get Started!`}/>}
      </div>
      <button
        className="h-16 w-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setopenAddEditModal({
            isShow: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShow}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgb(0,0,0,0.2)",
          },
        }}
        contentLable=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setopenAddEditModal({
              isShow: false,
              type: "add",
              data: null,
            });
          }}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
}

export default Home;
