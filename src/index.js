//require('dotenv').config({path:'./env'})
import dotenv from 'dotenv';
import connectDB from './db/index.js';
dotenv.config({
    path: './env'
})



connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server running  at :${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed bro  ",err);
    
})
























/*
(  async()=>{

    try{
     await   mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     app.on("error",(error)=>{
        console.log("ERROR",error);
        throw error
     })
           
     app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
        

     })
    }
    catch(error){
        console.log("Error", error);
        throw err
        
    }
})()*/