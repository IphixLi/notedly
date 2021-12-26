module.exports={
    //resolve autor info
    author:async (note,args,{models})=>{
        return await models.User.findById(note.author);
    },

    //resolved by favoriteBy info
    favoritedBy:async (note,args,{models})=>{
        return await models.User.find({_id:{$in:note.favoritedBy}});
    }
};