import { User } from "../model/user.model.js";

const getUser = async(req,res) =>{
    try {
        const user = await User.findById(req.user._id);
        return res.status(200).json({
            messsage:"User fetched successfully",
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

const updateProfile = async(req,res)=>{
    try {
        const {fullName} = req.body;
        if(!fullName)
        {
            return res.status(400).json({message:"All fields are required"});
        }
        
        const user = await User.findByIdAndUpdate(req.user._id,{
            fullName
        },{new:true});
        return res.status(200).json({
            mesaage:"Profile updated successfully",
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export {getUser,updateProfile};