//require mongoose library
const mongoose=require('mongoose');

module.exports={
    connect: DB_HOST=>{

        //-----these are deprecated in new version of mongodb----
        // Use the Mongo driver's updated URL string parser
        //mongoose.set('useNewUrlParser', true);
        // Use `findOneAndUpdate()` in place of findAndModify()
        //mongoose.set('findAndModify', false);
        // Use `createIndex()` in place of `ensureIndex()`
        //mongoose.set('useCreateIndex', true);
        // Use the new server discovery & monitoring engine
        //mongoose.set('useUnifiedTopology', true);
        mongoose.connect(DB_HOST);

        mongoose.connection.on('error', err => {
            console.error(err);
            console.log(
                ' MongoDB Connection error. Please make sure MongoDB is running :(.'
            );
            process.exit();
        });
    },
    close:()=>{
mongoose.connection.close();
    }
};
