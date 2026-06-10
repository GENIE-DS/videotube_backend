import {asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/Apierror.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req , res) => {
    
    /*
    // steps i think will be needed to register user ,
    // when someone registers 
    1, check if they already exists
    2, check all the details they are giving are in valid formate
    3, add those to database.

    // well what  tutorial suggests
    1, get user details from frontend / postman
    2, validation , non empty 
    3, check if user already exixts : usernam , email
    4, check for emails/ avatars (as required in this case)
    5, upload them to cloudinary, avatar
    6, create user object - create entry in db.
    7, remove password and refresh token field from response 
    8, check for user creation (probablu done 1 step above)
    9, return response.
    */

    const { fullname , email, username , password } = req.body
    console.log("email : ", email);

    // if (fullname ==="") {
    //     throw new ApiError(400, "full name is required")
    // }

    if (
        [fullname , email , username , password].some(()=> field?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields Are Required")
    }


    const existedUser = User.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }


    const user =  await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage.url || "",
        email,
        password,
        username : username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser , "user registered Sucessfully")
    )

})


export {registerUser};