import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Resume from "../models/resume.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc    Test endpoint for Resume API
 * @route   GET /api/resumes/start
 */
const start = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Welcome to Resume Builder API"));
});

/**
 * @desc    Create a new resume entry
 * @route   POST /api/resumes/
 */

// Note: This endpoint initializes a resume document with default/empty values. The frontend can then update it with actual data. --
const createResume = asyncHandler(async (req, res) => {
    const { title, themeColor } = req.body;

    if (!title) {
        throw new ApiError(400, "Title and  are required to initialize a resume.");
    }

    // Initialize with empty strings/arrays as per your UI requirements
   const resume = await Resume.create({
        title,
        themeColor,
        user: req.user._id,
        firstName: "",
        lastName: "",
        email: "",
        summary: "",
        jobTitle: "",
        jobDescription: "", // Added to ensure initialization
        atsScore: 0,        // Added to store the match percentage
        phone: "",
        address: "",
        experience: [],
        education: [],
        skills: [],
        projects: [],
    });

    if (!resume) {
        throw new ApiError(500, "Something went wrong while creating the resume document.");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, resume, "Resume initialized successfully"));
});

/**
 * @desc    Get all resumes for the authenticated user
 * @route   GET /api/resumes/
 */
const getALLResume = asyncHandler(async (req, res) => {
    // Sorting by updatedAt so the user sees their latest work first
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, resumes, "User resumes fetched successfully"));
});

/**
 * @desc    Get a single resume by ID
 * @route   GET /api/resumes/single?id=xxxx
 */
const getResume = asyncHandler(async (req, res) => {
    const { id } = req.query;

    if (!id) {
        throw new ApiError(400, "Resume ID is missing from query parameters.");
    }

    const resume = await Resume.findById(id);

    if (!resume) {
        throw new ApiError(404, "Resume document not found.");
    }

    // Authorization check
    if (resume.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized: You do not own this resume.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, resume, "Resume details retrieved"));
});

/**
 * @desc    Update resume details
 * @route   PUT /api/resumes/?id=xxxx
 */
const updateResume = asyncHandler(async (req, res) => {
    const { id } = req.query;

    if (!id) {
        throw new ApiError(400, "Resume ID is required for updates.");
    }

    // We combine the ID and User check into one query for better performance and security
    const updatedResume = await Resume.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { 
            $set: req.body 
            // Note: Mongoose 'timestamps: true' handles updatedAt automatically
        },
        { new: true, runValidators: true }
    );

    if (!updatedResume) {
        throw new ApiError(404, "Resume not found or you are not authorized to edit it.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedResume, "Resume synced successfully"));
});

/**
 * @desc    Delete a resume
 * @route   DELETE /api/resumes/?id=xxxx
 */
const removeResume = asyncHandler(async (req, res) => {
    const { id } = req.query;

    if (!id) {
        throw new ApiError(400, "Resume ID is required for deletion.");
    }

    const deletedResume = await Resume.findOneAndDelete({
        _id: id,
        user: req.user._id,
    });

    if (!deletedResume) {
        throw new ApiError(404, "Resume not found or unauthorized deletion attempt.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Resume successfully permanently removed"));
});

export {
    start,
    createResume,
    getALLResume,
    getResume,
    updateResume,
    removeResume,
};