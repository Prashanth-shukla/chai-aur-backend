import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken, changeCurrentPassword, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { veriftJWT } from "../middlewares/auth.middleware.js";
const router=Router()


router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

    router.route("/login").post(loginUser)

    // secured routes
    router.route("/logout").post(veriftJWT,logoutUser)

    router.route("/refresh-token").post(refreshAccessToken)

    router.route("/change-password").post(veriftJWT,
        changeCurrentPassword)
    router.route("/current-user").get(veriftJWT,
        getCurrentUser)
    router.route("/update-account").patch(veriftJWT,
     updateAccountDetails)
     router.route("/avatar").patch(veriftJWT,upload.single("avatar"),
    updateUserAvatar)
    router.route("/cover-image").patch(veriftJWT,upload.single("/coverImage"),
updateUserCoverImage)
router.route("/c/:username").get(veriftJWT,getUserChannelProfile)

router.route("/history").get(veriftJWT,getWatchHistory)

    
    
    
export default router