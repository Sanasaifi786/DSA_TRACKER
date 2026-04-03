import { User } from "../model/user.model.js";
import express from "express";

const registerUser = async(req,res) =>{
    try{
        const {fullName,username,email,password} = req.body;

        if(!fullName || !username || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }

        const createUser =await User.create({
            fullName,
            username,
            email,
            password
        });
        return res.status(201).json({message:"User created successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

const loginUser = async(req,res) =>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if(!isPasswordCorrect){
            return res.status(401).json({message: "Invalid password"});
        }

        const {accessToken,refreshToken} = user.generateAccessAndRefreshToken();
        console.log(accessToken,refreshToken);
        return res.status(200).json({
            message: "User logged in successfully",
            user,
            accessToken,
            refreshToken
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
        
    }
}

// const logoutUser = asyncHandler(async (req, res) => {
//   // remove cookie and accesToken and refreshToken
//   await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $unset: {
//         refreshToken: 1
//       }
//     },
//     {
//       new: true
//     }
//   )

//   const options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production"
//   }

//   return res.status(200)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .json(new ApiResponse(200, {}, "User Logged Out"))

// })

export {registerUser,loginUser};