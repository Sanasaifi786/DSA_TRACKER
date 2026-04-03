import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const verifyJWT = async (req, res, next) => {
    try {
        // Token cookies se lo ya Authorization header se (Bearer <token>)
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Token verify karo
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // User DB se fetch karo (password aur refreshToken exclude karo)
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // User ko request object pe attach karo
        req.user = user;
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token has expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};
