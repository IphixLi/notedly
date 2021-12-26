module.exports=
    {
        notes:async (parent,args,{models})=>{
          return await models.Note.find().limit(100);
        },
        note:async (parent,args,{models})=>{
          return await models.Note.findById(args.id);
        },
        users:async (parent,args,{models})=>{
          //return all users
          return await models.User.find();
        },
        user:async (parent,{username},{models})=>{
          return await models.User.findOne({username});
        },
        me:async (parent,args,{models,user})=>{
          const signeduser=models.User.findById(user.id);
          if(!signeduser){
            throw new Error('you are not signed in')
          }
          return await signeduser
        },
        noteFeed:async (parent,{cursor},{models})=>{
          //set limit to 10
          const limit=10;
          let hasNextPage=false;
          //if cursor not passes default query is empty

          let cursorQuery={};
          //if no cursor
          //query look for notes with ObjectId less than of cursor

          if(cursor){
            cursorQuery={_id:{$lt:cursor}};
          }
          //find limit +1 in our db from newest to oldest

          let notes=await models.Note.find(cursorQuery).sort({_id:-1}).limit(limit+1)

          //if notes exceeds limit set hasnextpage to true and trim notes to limit

          if(notes.length>limit){
            hasNextPage=true;
            notes=notes.slice(0,-1);
          }

          //new cursor will be mongo ObjectId of the last item in feed array
          const newCursor=notes[notes.length-1]._id;

          return{
            notes,
            cursor:newCursor,
            hasNextPage
          };

        }
      }
