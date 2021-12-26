module.exports={
    //resolve list of notes user requested
    notes:async (user,args,{models})=>{
        return await models.Note.find({_author:user._id}).sort({_id:-1});
    },

    favorites:async (user,args,{models})=>{
        return await models.Note.find({favoritedBy:user._id}).sort({_id:-1});
    }
};