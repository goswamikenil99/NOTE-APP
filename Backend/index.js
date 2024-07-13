require("dotenv").config();
const config=require("./config.json");
const mongoose=require("mongoose")
const User=require("./models/user.model");
const Note=require("./models/note.modal");
mongoose.connect(config.connectionString);

const express = require("express");
const cors = require("cors");
const app = express();
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./utiles");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.get("/",(req,res)=>{
    res.json({data : "hello"});
});

//create Account
app.post("/create-account",async(req,res)=>{
    const {fullname,email,password}=req.body;
    if(!fullname){
        return res.status(400).json({
            error : true,
            message : "Full name require",
        });
    }
    if(!email){
        return res.status(400).json({
            error : true,
            message : "Email require",
        });
    }
    if(!password){
        return res.status(400).json({
            error : true,
            message : "Password require",
        });
    }
    const isUser=await User.findOne({email : email});
    if(isUser){
        return res.json({
            error : true,
            message : "User already exist",
        });
    }
    const user=new User({
        fullname,
        email,
        password,
    });
    await user.save();

    const AccessToken=jwt.sign({ user },process.env.ACCESS_TOKEN,{
        expiresIn : "30m"
    });
    return res.json({
        error : false,
        user,
        AccessToken,
        message : "Registration Successfully",
    });
});

//Login

app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    if(!email){
        return res.status(400).json({
            error : true,
            message : "Email require",
        });
    }
    if(!password){
        return res.status(400).json({
            error : true,
            message : "Password require",
        });
    }
    const isUser=await User.findOne({email : email});
    if(!isUser){
        return res.status(400).json({
            error : true,
            message : "User Not found",
        });
    }
    if(isUser.email == email && isUser.password==password){
        const user=isUser;
        console.log(user._id);
        const AccessToken=jwt.sign({user},process.env.ACCESS_TOKEN,{
            expiresIn : "36000m"
        });
        return res.json({
            error : false,
            email,
            AccessToken,
            message : "login Successfully",
        });
    }
    else{
        return res.status(400).json({
            error : true,
            message : "invalid credentials",
        });
    }

});

//add note

app.post("/add-note",authenticateToken,async (req,res)=>{
    const {title,content,tags} = req.body;
    const {user} = req.user;

    if(!title){
        return res.status(400).json({
            error:true,
            message : "Title Is Require"
        });
    }
    if(!content){
        return res.status(400).json({
            error:true,
            message : "Content Is Require"
        });
    }
    try{
        const note = new Note({
            title,
            content,
            tags : tags || [],
            userId : user._id,
        });
        await note.save();
        return res.json({
            error : false,
            note,
            message : "Note Added Successfully"
        });
    }catch(error){
        res.status(500).json({
            error : true,
            message : "Internal server Error",
        });
    }
});


//edit note

app.put("/edit-note/:noteId",authenticateToken,async (req,res)=>{
    const noteId=req.params.noteId;
    const {title,content,tags,isPinned} = req.body;
    const {user} = req.user;

    if(!title && !content && !tags){
        return res.status(400).json({
            error:true,
            message : "No Change require"
        });
    }
    try{
        const note=await Note.findOne({_id : noteId , userId : user._id});
        if(!note){
            return res.status(400).json({
                error : true,
                mwssage : "Note not Found",
            });
        }
        if(title) note.title=title;
        if(content) note.content=content;
        if(tags) note.tags=tags;
        if(isPinned) note.isPinned=isPinned;
        await note.save();
        return res.json({
            error : false,
            note,
            message : "Note Updated Successfully",
        });
    }catch(error){
        res.status(500).json({
            error : true,
            message : "Internal server Error",
        });
    }
});

//get-app-notes
app.get("/get-all-notes",authenticateToken,async (req,res)=>{
    const {user}=req.user;
    try{
        const notes=await Note.find({userId : user._id}).sort({isPinned : -1});
        return res.json({
            error : false,
            notes,
            meaasge : "all notes retrive successfully",
        });
    }catch(error){
        return res.status(500).json({
            error : true,
            message : "Internal Server Error",
        });
    }
})

//delete notes
app.delete("/delete-note/:noteId",authenticateToken,async(req,res)=>{
    const {user} =req.user;
    const noteId=req.params.noteId;
    try{
        const note=await Note.findOne({_id : noteId , userId : user._id});
        if(!note){
            return res.status(400).json({
                error : true,
                message : "Note Note Found"
            })
        }
        await note.deleteOne({_id : noteId , userId : user._id});
        return res.json({
            error : false,
            meaasge : "note deleted",
        });
    }catch(error){
        return res.status(500).json({
            error : true,
            message : "Internal Server Error",
        });
    }
})

//Update ispinned value

app.put("/update-note-pinned/:noteId",authenticateToken,async (req,res)=>{
    const noteId=req.params.noteId;
    const {isPinned} = req.body;
    const {user} = req.user;

    
    try{
        const note=await Note.findOne({_id : noteId , userId : user._id});
        if(!note){
            return res.status(400).json({
                error : true,
                mwssage : "Note not Found",
            });
        }
        note.isPinned=isPinned;
        await note.save();
        return res.json({
            error : false,
            note,
            message : "Note Updated Successfully",
        });
    }catch(error){
        res.status(500).json({
            error : true,
            message : "Internal server Error",
        });
    }
});

//get User

app.get("/get-user",authenticateToken,async (req,res)=>{
    const {user} = req.user;
    console.log(user._id);
    const isUser = await User.findOne({ _id : user._id});
    if(!isUser){
        return res.status(401);
    }
    console.log(isUser.fullname);
    return res.json({
        error : false,
        user : isUser,
        message : "Yes",
    });
})

//search Notes

app.get("/search-notes",authenticateToken,async (req,res)=>{
    const {user} = req.user;
    const {query} = req.query;

    if(!query){
        return res.status(400).json({
            error:true,
            message : "Search query is required"
        });
    }
    try{
        const matchingNotes=await Note.find({
            userId : user._id,
            $or : [
                {title : {$regex : new RegExp(query , "i")}},
                {content : {$regex : new RegExp(query , "i")}},
            ],
        });
        return res.json({
            error : false,
            notes : matchingNotes,
            message : "Note matching the search query retrieved successfully",
        })

    }catch(error){
        return res.status(400).json({
            error:true,
            message : "Internal Servar Error",
        })
    }
})


app.listen(8000);
module.exports=app;

// mongodb+srv://testuser:Test123@cluster0.jgt2r5l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"