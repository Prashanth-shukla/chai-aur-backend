// import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs"


//     // Configuration
//     cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY, 
//         api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
//     });

//     const uploadOnCloudinary = async(localfilePath)=>{
        
//         try {
//             if(!localfilePath) return null;
//             //upoload the file on cloudinary
//             console.log("localfilePathcludinary:-",localfilePath);
            
//             const response = await cloudinary.uploader.upload
//             (
//                 localfilePath,{
//                     resource_type:"auto"// accept all type of resourse pdf image,etc
//                 }
//             )
//             //file has beeen uploaded succesfull
//             console.log("file is uploaded on cloudinary");
//             console.log("cloudinary response:", response);
//             fs.unlinkSync(localfilePath)
//             return response;
           
//         } catch (error) {
//             fs.unlinkSync(localfilePath)
//             // remove the locally saved temporay file as the upload operation got failed and do it synchronously(imeeditly)

//             return null;
//         }
//     }

//     export {uploadOnCloudinary}
import dotenv from 'dotenv';
dotenv.config();
    import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
//console.log(process.env);

console.log('Cloudinary Config in cloudinary.js file:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localfilePath) => {
    try {
        if (!localfilePath || !fs.existsSync(localfilePath)) {
            throw new Error('File not found at specified path.');
        }

        console.log("Uploading file from path:", localfilePath);
        
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto" // Accepts all types of resources: pdf, image, etc.
        });

        console.log("File uploaded successfully to Cloudinary");
        console.log("Cloudinary response:", response);

        fs.unlinkSync(localfilePath);
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message);
        if (fs.existsSync(localfilePath)) {
            fs.unlinkSync(localfilePath); // Remove the file only if it exists
        }
        return null;
    }
};

export { uploadOnCloudinary };
