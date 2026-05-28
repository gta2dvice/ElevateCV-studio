import { GoogleGenerativeAI } from "@google/generative-ai";
import Resume from "../models/resume.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import pdf from "pdf-parse-new";
import dotenv from "dotenv";
dotenv.config();

// 1. Initialize AI with API Key safety check
if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL: GEMINI_API_KEY is missing in .env file");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Helper: AI Generation with Exponential Backoff
 * Handles Gemini's rate limits (429) or temporary outages (503).
 */
const generateWithRetry = async (model, prompt, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            return result;
        } catch (error) {
            const isRetryable = error.message?.includes("503") || error.message?.includes("429");
            if (isRetryable && i < retries - 1) {
                const delay = Math.pow(2, i) * 1500; 
                await new Promise(res => setTimeout(res, delay));
                continue;
            }
            throw error;
        }
    }
};

/**
 * @desc    ATS Audit: Compare Resume vs Job Description
 */
export const analyzeJobDescription = asyncHandler(async (req, res) => {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
        throw new ApiError(400, "Both Resume data and Job Description are required.");
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "application/json" } 
    });

    const prompt = `
        Act as an ATS (Applicant Tracking System) Specialist. 
        Compare this Resume JSON: ${JSON.stringify(resumeData)} 
        against this Job Description: ${jobDescription}.
        
        Return ONLY valid JSON with these keys:
        {
          "matchPercentage": number,
          "missingSkills": ["skill1", "skill2"],
          "analysis": "Brief summary of fit",
          "suggestions": ["suggestion1", "suggestion2"]
        }
    `;

    const result = await generateWithRetry(model, prompt);
    const data = JSON.parse(result.response.text());

    return res.status(200).json(new ApiResponse(200, data, "ATS Analysis complete"));
});

/**
 * @desc    Extract and Optimize text from uploaded PDF
 */
export const optimizeExistingResume = asyncHandler(async (req, res) => {
    const { title, jobDescription } = req.body;

    if (!req.file) {
        throw new ApiError(400, "Please upload a Resume PDF.");
    }

    // 1. PDF Text Extraction
    const pdfData = await pdf(req.file.buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length < 50) {
        throw new ApiError(400, "The PDF content is too short or unreadable.");
    }

    // 2. AI Processing - Structuring the raw text into your Resume Model format
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
        Convert this raw resume text into a structured JSON object: ${rawText}.
        Optimize the content for this Job Description: ${jobDescription}.
        
        The JSON must strictly follow this structure:
        {
          "firstName": "", "lastName": "", "jobTitle": "", "email": "", "phone": "", "address": "", "summary": "",
          "experience": [{"title": "", "companyName": "", "startDate": "", "endDate": "", "workSummary": ""}],
          "education": [{"universityName": "", "degree": "", "major": "", "startDate": "", "endDate": ""}],
          "skills": [{"name": "", "rating": 0}]
        }
    `;

    const aiResult = await generateWithRetry(model, prompt);
    const optimizedData = JSON.parse(aiResult.response.text());

    // 3. Database Storage - Using the user ID attached by your authMiddleware
    const finalResumeData = {
        ...optimizedData,
        title: title || `Optimized - ${optimizedData.jobTitle || "Resume"}`,
        user: req.user._id, // Set from isUserAvailable middleware
        themeColor: "#9333ea",
    };

    const savedResume = await Resume.create(finalResumeData);

    return res.status(201).json(new ApiResponse(201, { resumeId: savedResume._id }, "Resume forged successfully"));
});

/**
 * @desc    Generate specific resume content (Summary or Bullet Points)
 * @access  Private
 */
export const generateAIContent = asyncHandler(async (req, res) => {
    const { promptType, context } = req.body;

    if (!promptType || !context) {
        throw new ApiError(400, "Prompt type and context are required.");
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "application/json" }
    });

    // Tailor the prompt based on what the user needs
    const prompt = `
        Act as a Professional Resume Writer.
        Task: Generate ${promptType === 'summary' ? 'a professional summary' : '3-5 high-impact bullet points'} based on this context: ${context}.
        Return ONLY valid JSON:
        {
          "content": "string"
        }
    `;

    const result = await generateWithRetry(model, prompt);
    const data = JSON.parse(result.response.text());

    return res.status(200).json(new ApiResponse(200, data, "Content generated successfully"));
});

/**
 * @desc    Refine existing resume JSON data to match a specific JD
 * @access  Private
 */
export const transformResume = asyncHandler(async (req, res) => {
    const { resumeData, jobDescription } = req.body;

    if (!jobDescription) {
        throw new ApiError(400, "Job description is required for refinement.");
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
        Act as a Senior Technical Recruiter.
        Task: Rewrite the following resume data to better align with this Job Description.
        
        Resume Data: ${JSON.stringify(resumeData)}
        Job Description: ${jobDescription}
        
        Constraint: Return ONLY valid JSON with a 'transformedData' key. 
        Maintain the existing structure but optimize the summary and work descriptions.
    `;

    const result = await generateWithRetry(model, prompt);
    const data = JSON.parse(result.response.text());

    return res.status(200).json(new ApiResponse(200, data, "Resume refined successfully"));
});


/**
 * @desc    Generate a tailored cover letter from internal data or uploaded PDF
 * @route   POST /api/ai/generate-cover-letter
 */
export const generateCoverLetter = asyncHandler(async (req, res) => {
    let { resumeInfo, jobDescription } = req.body;
    let resumeText = "";

    // 1. Handle PDF Upload vs Internal Resume Data
    if (req.file) {
        // Extract text from external PDF
        const pdfData = await pdf(req.file.buffer);
        resumeText = pdfData.text;
        
        if (!resumeText || resumeText.trim().length < 50) {
            throw new ApiError(400, "The uploaded PDF is unreadable or too short.");
        }
    } else {
        // Use internal CareerForge resume data
        if (typeof resumeInfo === 'string') {
            resumeInfo = JSON.parse(resumeInfo);
        }
        
        if (!resumeInfo) {
            throw new ApiError(400, "Resume data is required.");
        }

        // Convert structured JSON to a readable string for the AI prompt
        resumeText = `
            Name: ${resumeInfo.firstName} ${resumeInfo.lastName}
            Role: ${resumeInfo.jobTitle}
            Summary: ${resumeInfo.summary}
            Experience: ${JSON.stringify(resumeInfo.experience)}
            Skills: ${JSON.stringify(resumeInfo.skills)}
        `;
    }

    if (!jobDescription) {
        throw new ApiError(400, "Job Description is required for tailoring.");
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview" 
    });

    const prompt = `
        As an expert Executive Career Coach, write a high-conversion cover letter.
        
        SOURCE RESUME CONTENT:
        ${resumeText}

        TARGET JOB DESCRIPTION:
        ${jobDescription}

        REQUIREMENTS:
        1. Professional and authoritative tone.
        2. Specifically match the candidate's strengths to the JD requirements.
        3. Keep it under 300 words.
        4. Return ONLY the letter content without any markdown formatting or meta-talk.
    `;

    // 2. Generate content with retry logic for reliability
    const result = await generateWithRetry(model, prompt);
    const content = result.response.text();

    return res
        .status(200)
        .json(new ApiResponse(200, { content }, "Cover letter forged successfully"));
});


// backend/controllers/aiController.js

export const getSkillSuggestions = async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    
    const prompt = `Identify the top 10 skills for a ${jobTitle} based on this JD: ${jobDescription}. 
    Return ONLY a JSON array of strings. No extra text.`;

     const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // CLEANING LOGIC: Remove markdown blocks if they exist
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const suggestions = JSON.parse(cleanJson);

    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    console.error("AI Skill Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};