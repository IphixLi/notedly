const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            index:{unique:true}
        },
        email:{
            type:String,
            required:true,
            index:{unique:true}
        },
        password:{
            type:String,
            required:true
        },
        avatar:{
            type:String
        }
    },

    //assign CreatedAt and updatedAt timestamps
    {timestamps:true}
);

const User=mongoose.model('User',UserSchema);
module.exports=User;