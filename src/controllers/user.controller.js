import {asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/Apierror.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user =  await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}





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
        [fullname , email , username , password].some((field)=> field?.trim() === "")
    ) {
        throw new ApiError(400, "All Fields Are Required")
    }


    const existedUser = await  User.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists");
    }

    console.log("req.files : ", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

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
        coverImage : coverImage?.url || "",
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

const loginUser = asyncHandler( async (req , res) => {
    /* 
        workflow for login user
        1, get username/email and password from the req.body
        2, validate non empty
        3, check if user exists with the given email/username
        4, if exists, comapre with the hased password in database
        5, correct password -> generaate access token and refresh token 
        // 6, save refresh token in database for the user
        // 7, return response with  cookies including access token and refresh token and user details (except password and refresh token)
    */

        const {  email , username , password } = req.body

        if ( !username || !email) {
            throw new ApiError(400, "Username and Email is required") // even for login we are asking them for both username and email, but we can also ask for either of them, but for now we are asking for both.
        }

        const user = await User.findOne({
            $or : [{username}, {email}] 
        })

        if(!user){
            throw new ApiError(404, "User not found with the given email or username")
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if(!isPasswordValid){
            throw new ApiError(401, "Invalid user credentials")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken"    )
        // if database calls feels heavy above we may update our current object as well.


        const options = {
            httpOnly : true,
            secure : true,
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                loggedInUser, accessToken, refreshToken
            }, "User logged in successfully")
        )

})

const logoutUser = asyncHandler( async (req , res) => {
            /* 
            workflow for logout user
            1, get user id
            2, find the user in database
            3, if user exists, remove the refresh/access token from the database
            4, clear the cookies in response
            5, return response.
            */

            // verifyJWT  added req.user to req so access here

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new : true,
        }
    ) 

    const options = {
        httpOnly : true,
        secure : true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))



})

export {
    registerUser,
    loginUser, 
    logoutUser,
};
// export {loginUser};