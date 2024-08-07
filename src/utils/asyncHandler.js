 const asynkHandler=()=>{}

 (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
 }

export {asynkHandler}
// const asynkHandler=(fn)=>async(req,res,next)=>{
//     try{
// await fn(req,res,next)
//     }

//     catch(error){
//        res.sattus(err.code||500).json({
//         success:false,
//         message:err.message
//        })
       
        
//     }
//}