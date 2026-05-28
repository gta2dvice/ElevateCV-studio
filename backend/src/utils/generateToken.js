import jwt from "jsonwebtoken";

/**
 * @desc Generates a signed JWT for user authentication
 * @param {string} id - The MongoDB User ID
 * @returns {string} - Signed JWT
 */
const generateToken = (id) => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET_KEY, 
        {
            expiresIn: process.env.JWT_SECRET_EXPIRES_IN || "1d",
        }
    );
};

export default generateToken;