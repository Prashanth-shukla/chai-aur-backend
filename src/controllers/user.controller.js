import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js" 
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { jwt } from "jsonwebtoken";
import mongoose from "mongoose";
const generateAccessAndRefreshTokens=async(userId)=>{
    try{
const user=await User.findById(userId)
const accessToken=user.generateAccessToken()
const refreshToken=user.generateRefreshToken()

user.refreshToken=refreshToken
await user.save({validateBeforeSave:false})
return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"something went wrong")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    // res.status(500).json({
    //     message: "OK"
    // })
    // get user detail from frontend
    //validation - not empty
    // check if user already exit: username, email
    // check for image,check for avatar
    //upload them to cloudinary ,avatar
    //crate user object - create entry in db
    // remove password and refersh token field from response
    // check for user creation
    // return res

    const { fullName, email, username, password } = req.body
    console.log("email:", email);
    console.log("request body->", req.body);
    //     req.body is used in an Express.js application to access the data that is sent in the body 
    //     of an HTTP request, typically in POST or PUT requests. This data is usually sent from the 
    //     client side (e.g., from a web form or a JSON payload in an API request) and is then processed on the server side.

    // Here's why req.body is important and how it is used:

    // Accessing Form Data:

    // When a client sends data via a form submission (with method="POST"), the server can access the
    // submitted form data using req.body.

    // Handling JSON Payloads:

    // For APIs, clients often send data as JSON in the body of the request. Using req.body, the server can parse
    //  and access this JSON data.


    // if(fullName===""){
    //     throw new ApiError(400,"fullname is requried")
    // }

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all filed are required")

    }

    //     Why .some is Used
    //     Validation:
    //     .some is used to perform a quick check on an array of elements to determine if at least one element meets a specified condition.
    //      This is particularly useful for validation checks.
    //     In your code, it's used to ensure that none of the required fields (fullName, email, username, password) 
    //     are empty or contain only whitespace.

    //     An array is created with the values of fullName, email, username, and password extracted from req.body.

    // The .some method iterates over each element in the array.
    // For each element (field), it checks if field?.trim() === "".
    // field?.trim() trims any whitespace from the beginning and end of the string. The optional chaining operator (?.)
    //  ensures that if field is null or undefined, it doesn't throw an error.
    // If the trimmed string is an empty string (""), the condition returns true.
    // Condition Check:

    // If at least one element in the array satisfies the condition (trimmed string is empty), .some returns true.
    // If none of the elements satisfy the condition, .some returns false.

    const exitedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    /*The $or operator performs a logical OR operation on an array of
     one or more <expressions> and selects the documents that satisfy at
      least one of the <expressions>. */

    console.log("exiteduser data:-", exitedUser);

    if (exitedUser) {
        throw new ApiError(409, "user with email or username already exits")
    }

    

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // why optional channing is not working

    const avatarLocalPath = Array.isArray(req.files?.avatar) && req.files.avatar.length > 0 ? req.files.avatar[0].path : undefined;


    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log("req files structure:-", req.files.avatar);

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {

        coverImageLocalPath = req.files.coverImage[0].path
    }

    //     Why req.files is Used
    // File Upload Handling:

    // When a client uploads files (such as images, documents, etc.) through a form or an API request, these 
    // files need to be processed and stored on the server or a cloud storage service.
    // req.files provides access to these uploaded files, allowing the server to handle them appropriately.
    // Middleware for Parsing Multipart Form Data:

    // Express.js does not natively handle multipart/form-data, which is the encoding type used for file uploads. 
    // Middleware like multer is used to parse this type of data and populate req.files with the uploaded file information.
    // This middleware processes the uploaded files and makes them accessible via req.files.
   //console.log("ps ",avatarLocalPath);
   

     if (!avatarLocalPath) {
        throw new ApiError(400, "Avtar file is required")
     }
     
     console.log("avatarLocalpath:-",avatarLocalPath);
     
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    console.log("cloudinary response avtar", avatar);

    if (!avatar) {
        throw new ApiError(400, "Avtar file is required cloudinary")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        " -password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while regestring thr user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registerd")

)
})
// const loginUser=asyncHandler(async(req,res)=>{


// const {email,username,password}=req.body

// if(!(username||password))
// {
//     throw new ApiError(400,"username or password are required")
// }
// const user=await User.findOne({
//     $or: [{ email }, { username }]
// })

// if(!user)
// {
//     throw new ApiError(400,"username or email is not found")
// }

// const isPasswordValid=await user.isPasswordCorrect(password)

// if(!isPasswordValid)
//     {
//         throw new ApiError(400,"Invalid user credentials bro")
//     }
//   const {accessToken,refreshToken}=
//     await generateAccessAndRefreshTokens(user._id)

//    const loggedInUser= User.findById(user._id)
//    select("-password -refreshToken")
//    //select - means we dont want to send that field
//    const options={
//     httpOnly:true,
//     secure:true
//    }
//    return res.status(200)
//    .cookie("accessToken",accessToken, options)
//    .cookie("refreshToken",refreshToken,options)
//    .json(
//     new ApiResponse(
//         200,
//         {
//             user:loggedInUser,accessToken,
//             refreshToken
//         },
//         "User logged in successfully"
//     )
//    )
// })
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
// req body ->data
// username or email
// find the user
// password check
// access and refresh token
//send cookie and response
    if (!(username || email)) {
        throw new ApiError(400, "Username or email and password are required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        throw new ApiError(400, "Username or email not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});

const logoutUser=asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
       }

       return res.status(200)
       .clearCookie("accessToken",options)
       .clearCookie("refreshToken",options)
       .json(
        new ApiResponse(
            200,
            {
                message:"User logged out successfully"
                },
                "User logged out successfully"
                )
            )
    /* -> clearCookie means that user going to log out from its account */


})

const refreshAccessToken=asyncHandler(async (req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken

if(!incomingRefreshToken)
    throw new ApiError(401,"Unauthorized request")

try
{
    const decodedToken=jwt.verify(
    incomingRefreshToken,
 process.env.REFRESH_TOKEN_SECRET
)
const user= await User.findById(decodedToken?._id)
if(!user)
    throw new ApiError(401,"Invalid refresh token")

if(incomingRefreshToken!== user?.refreshToken){
    throw new ApiError(401,"refresh token is expired or used")
}


const options={
    httpOnly:true,
    secure:true
}

 const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",newRefreshToken,options)
.json(
    new ApiResponse(
        200,
        {
            accessToken,refreshToken:newRefreshToken
        },"Access token refreshed successfully"
    )
        
)}
catch(error){
    throw new ApiError(401,error?.message||"Unauthorized request")
}
})


const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    const user=await User.findById(req.user?._id)
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
        
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    return res.status(200)
    .json(new ApiResponse(200,{},"password changed successfully"))
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200,req.user,"current user fetched successfully"))
})


const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullName,email}=req.body

    if(!(fullName||email)){
        throw new ApiError(400,"All fields are required")
    }

 const user=User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,email
                }
        },
{new:true}

    ).select("-password")
    return res.status(200)
    .json(new ApiResponse(200,user,"account details updated successfully"))

})

const updateUserAvatar=asyncHandler(async(req,res)=>{
const avatarLocalPath=req.file?.path

if(!avatarLocalPath)
    throw new ApiError(400,"Avatar file is missing")

const avatar=await uploadOnCloudinary(avatarLocalPath)

if(!avatar.url)
    throw new ApiError(400,"Error while uploading on avatar")

const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:{
            avatar:avatar.url
        }    
    },
    {new:true}
).select("-password")
return res.status(200)
.json(new ApiResponse(200,user,"avatar updated successfully"))
}
)

const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path
    
    if(!coverImageLocalPath)
        throw new ApiError(400,"cover image file is missing")
    
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    
    if(!coverImage.url)
        throw new ApiError(400,"Error while uploading on cover image")
    
 const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }    
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"Cover image updated successfully"))
    }
    )


    const getUserChannelProfile=asyncHandler(async(req,res)=>{
const {username}=req.param
if(!username?.trim()){
    throw new ApiError(400,"username is missing")
}

const channel=await User.aggregate([
    {
    $match: {
        username:username?.toLowerCase()
}
    },
    {
    $lookup:{
        from:"Subscription",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
    }
},
{
$lookup:{
    from:"Subscription",
    localField:"_id",
    foreignField:"subscriber",
    as:"subscribedTo"
}
},
{
   $addFields:{
    subscribersCount:{$size:"$subscribers"},
    channelsSubscribedToCount:{
        $size:"$subscribedTo"
    },
    isSunscribed:{
     $cond:{
        if:{
            $in:[req.user?._id,"$subscribers.subscriber"]
        },
        then:true,
        else:false

     }   
    }

   }
},
{
    $project:{
        fullName:1,
        username:1,
        subscribersCount:1,
        isSunscribed:1,
        avatar:1,
        coverImage:1,
        email:1
    }

}



])
if(!channel?.length){
throw new ApiError(404,"Channel not found")
}

return res.status(200)
.jason(
    new ApiResponse(200,channel[0],"User channel fetched successfully")
)
    })


    const getWatchHistory=asyncHandler(async(req,res)=>{
        const user=await User.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(req.user?._id)
                }

            },
            {
                $lookup:{
                    from:"videos",
                    localField:"watchHistory",
                    foreignField:"_id",
                    as:"watchHistory",
                    pipeline:[

                        {
                            $lookup:{
                                from:"user",
                                localField:"owner",
                                foreignField:"_id",
                                as:"owner",
                                pipeline:[
                                    {
                                    $project:{
                                        fullName:1,
                                        username:1,
                                        avatar:1
                                    }
                                    }
                                ]
                                

                            }
                        },
                        {
                            $addfField:{
                                owner:{
                                    first:"$owner"
                                }
                            }
                        }
                    ]
               }
           }
        ])

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch hisory fetched successfully"
            )
        )
       
    })
export {registerUser,
    loginUser,logoutUser,refreshAccessToken,getCurrentUser,
    changeCurrentPassword,updateUserAvatar,updateAccountDetails,
    updateUserCoverImage,getUserChannelProfile,getWatchHistory
}
