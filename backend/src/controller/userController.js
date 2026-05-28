import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // Standard for production

/**
 * @desc    Verify current session
 * @route   GET /api/users/start
 */
const start = asyncHandler(async (req, res) => {
    // req.user is populated by the authMiddleware
    if (!req.user) {
        throw new ApiError(404, "User session not found or expired");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User session verified"));
});

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 */
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    // Validation
    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields (fullName, email, password) are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const newUser = await User.create({
        fullName,
        email,
        password, // Hashing should be handled in user.model.js pre-save hook
    });

    // Remove password from response
    const createdUser = await User.findById(newUser._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User successfully registered"));
});

/**
 * @desc    Login user & get token
 * @route   POST /api/users/login
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate Token
   const jwtToken = generateToken(user._id);

    // Production Cookie Options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    const loggedInUser = await User.findById(user._id).select("-password");

    return res
        .status(200)
        .cookie("token", jwtToken, cookieOptions)
        .json(
            new ApiResponse(
                200, 
                { user: loggedInUser, token: jwtToken }, 
                "User logged in successfully"
            )
        );
});

/**
 * @desc    Logout user / Clear cookie
 * @route   POST /api/users/logout
 */
const logoutUser = asyncHandler(async (req, res) => {
    // Clear cookie regardless of session status for better UX
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res
        .status(200)
        .clearCookie("token", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { start, loginUser, logoutUser, registerUser };