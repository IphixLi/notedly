//require mongoose library
const mongoose=require('mongoose');

//define note's database schema
const noteSchema=new mongoose.Schema(
    {
        content:{
            type:String,
            required:true
        },
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        favoriteCount:{
            type:Number,
            default:0
        },
        favoritedBy:[
            {type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
        ]   
    },
    //assign createAt and updatedAt fields
   { timestamps:true}
);

//define Note' 'model with Schema
const Note=mongoose.model('Note',noteSchema);

//export module
module.exports=Note;