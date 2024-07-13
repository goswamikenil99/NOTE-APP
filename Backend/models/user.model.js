const mongoose=require("mongoose");
const schema=mongoose.Schema;
const userSchema=new schema({
    fullname:{type : String},
    email:{type : String},
    password:{type : String},
    createdOn:{type : Date , default : new Date().getTime() },
});
module.exports=mongoose.model("user",userSchema);