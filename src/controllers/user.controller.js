import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js" 
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
// const registerUser=asyncHandler(async(req,res)=>{
   

//     //get user details from frontend
//     // validation not empty
//     //check if user already exist
//     //hash password
//     //check for images,avatar
//     //upload them to cloudinary,avatar
//     //save user to database
//     //create user object -- create entry in db
// //remove password,refresh token field
// //chec for user creation
// //return response


// const{fullName,email,username,password}=req.body
// console.log("email: ",email);


// if(
//     [fullName,email,username,password].some((field)=>
//     field?.trim()==="")
// )
// {

//     throw new ApiError(400,"All fields are required")
// }
// const existedUser=await User.findOne({
//     $or:[{username},{email}]
// }
// )
// if (existedUser) {
//     throw new ApiError(409, "User with email or username already exists")
// }
// //console.log(req.files);

// console.log(req.files);

// //const avatarLocalPath = req.files?.avatar[0]?.path;
// const avatarLocalPath =Array.isArray(req.files?.avatar)&&req.files.avatar.length>0?req.files.avatar[0].path:undefined;
// //const coverImageLocalPath = req.files?.coverImage[0]?.path;
// console.log("avatr loacl path:",avatarLocalPath);

// let coverImageLocalPath;
// if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//     coverImageLocalPath = req.files.coverImage[0].path
// }


// // if (!avatarLocalPath) {
// //     throw new ApiError(400, "Avatar file is required")
// // }

// const avatar = await uploadOnCloudinary(avatarLocalPath)
// const coverImage = await uploadOnCloudinary(coverImageLocalPath)
//   console.log("avtar cloudinary:-",av);
  
// if (!avatar) {
//     throw new ApiError(400, "Avatar file is required on cloudinary")
// }


// const user = await User.create({
//     fullName,
//     avatar: avatar.url,
//     coverImage: coverImage?.url || "",
//     email, 
//     password,
//     username: username.toLowerCase()
// })



// const createdUser=await User.findById(user._id).select(
//     "-password -refreshToken"
// )


// if(!createdUser){
//     throw new ApiError(500,"Something went wrong while registering user")
// }

// return res.status(201).json(
//     new ApiResponse(200,createdUser,"User registed successfully")

// )
// }
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

    //     The .some method iterates over each element in the array.
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
export {registerUser}