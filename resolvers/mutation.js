const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');

const {
    AuthenticationError,
    ForbiddenError,
}=require('apollo-server-express');
require('dotenv').config();

const gravatar=require('../utils/gravatar');


module.exports={
  newNote:async (parent,args,{models,user})=>{
      //throw error if no user on context
      if(!user){
          throw new AuthenticationError("you must be signed in to create note")
      }
      return await models.Note.create({
        content:args.content,
        //reference author's mongo id
        author:mongoose.Types.ObjectId(user.id),
    });
  },
  deleteNote:async (parent,{id},{models,user})=>{
    if(!user){
        throw AuthenticationError('you must be signed in to delete note');
    }

    const note=await models.Note.findById(id);
    //if note id and note Id doesn't match throw forbidden error
    if(note&&String(note.author)!==user.id){
        throw ForbiddenError("you don't have access to this note");
    }

    try {
        await note.remove();
        return true;
    }catch(err){
        return false
    }
},
  deleteAll:async (parent,{author},{models})=>{
      try{
          await models.Note.deleteMany({_author:author});
          return true;
      }catch(err){
          return false;
      }
  },
  changeAuthor:async(parent,{author,NewAuthor},{models})=>{
       try {
           await models.Note.updateMany(
              {_author:author},
            {$set:{author:NewAuthor}             
            });
            return true;
        }catch(err){
            return false;
        }
  },
  updateNote:async (parent,{content,id},{models})=>{
    if(note&&String(note.author)!==user.id){
        throw ForbiddenError("you don't have access to update  this note");
    }
      return await models.Note.findOneAndUpdate(
      {
          _id:id,
      },
      {
          $set:{
              content
          }
      },
      {
          new:true
      }  
      );
  },

  //user authentication
  signUp:async (parent,{username,email,password},{models})=>{
      //normalize email address
      email=email.trim().toLowerCase();
      //hash the password
      const hashed=await bcrypt.hash(password,10);
      //create th gravatar url
      const avatar=gravatar(email);

      try{
          const user=await models.User.create({
              username,
              email,
              avatar,
              password:hashed
          });
          return jwt.sign({id:user._id},process.env.JWT_SECRET);
      }catch(err){
          console.log(err);
          throw new Error('Error creating account');
      }
  },

  signIn:async (parent,{username,email,password},{models})=>{
      //normalize email address
      if (email){
          email=email.trim().toLowerCase();
      }
    const user=await models.User.findOne({
        $or:[{email},{username}]
    });

    //authentication error when no user is found
    if(!user){
        throw AuthenticationError('error signing in');
    }

    //if passwords doesn't match
    const valid=await bcrypt.compare(password,user.password);
    if(!valid){
        throw new AuthenticationError('Password does not match');
    }

    //create and return json web token

    return jwt.sign({id:user._id},process.env.JWT_SECRET);
  },

  toggleFavorite:async (parent,{id},{models,user})=>{
      if(!user){
          throw new AuthenticationError();
      }

      //check if user already favorite a note
      let noteCheck=await models.Note.findById(id);
      const hasUser=noteCheck.favoritedBy.indexOf(user.id);

      //pull them from list and reduce count by 1

      if(hasUser>=0){
          return await models.Note.findByIdAndUpdate(
              id,{
              $pull:{
                  favoritedBy:mongoose.Types.ObjectId(user.id)
              },
              $inc:{
                  favoriteCount:-1
              }
            },
            {
                new:true
            }
          );
      }else{
          return await models.Note.findByIdAndUpdate(
              id,{
                $pull:{
                    favoritedBy:mongoose.Types.ObjectId(user.id)
                },
                $inc:{
                    favoriteCount:1
                }
              },
              {
                  new:true
              }
          )
      }
  },

  }