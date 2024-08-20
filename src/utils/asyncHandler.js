const asyncHandler = (requestHandler) => {
   return (req, res, next) => {
       Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
   }
}
// Promise:Represents the completion of an asynchronous operation


export {asyncHandler}
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