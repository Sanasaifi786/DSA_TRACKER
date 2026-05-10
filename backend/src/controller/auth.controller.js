import { User } from "../model/user.model.js";

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
        // MongoDB duplicate key error (email or username already taken)
        if(error.code === 11000){
            const field = Object.keys(error.keyValue)[0]; // "email" or "username"
            return res.status(400).json({message: `${field} already exists. Please use a different one.`});
        }
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

        const {accessToken,refreshToken} = await user.generateAccessAndRefreshToken();
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

const logoutUser = async (req, res) => {
    try {
        // DB se refreshToken hata do (req.user middleware se aata hai)
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: { refreshToken: 1 }  // field delete karo
            },
            { new: true }
        );

        // Cookie options — httpOnly se JS access nahi kar sakti
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "User logged out successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { registerUser, loginUser, logoutUser };