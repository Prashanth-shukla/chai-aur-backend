import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from './app.js';


dotenv.config({ path: './.env' });
// by config .env file it can be accessed by any where in file
console.log('Cloudinary Config in index.js file:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
});