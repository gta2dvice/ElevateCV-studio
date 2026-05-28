import axios from "axios";
import { VITE_APP_URL } from "@/config/config";

const axiosInstance = axios.create({
  baseURL: VITE_APP_URL + "/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * @desc Get All Resumes for the Dashboard
 */
export const getAllResumeData = async () => {
  try {
    // ALIGNMENT FIX: You must add "/all" to match resumeRoutes.js[cite: 31]
    const response = await axiosInstance.get("resumes/all"); 
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch resumes");
  }
};

/**
 * @desc Get Single Resume by ID for the Editor
 * This is the function your EditResume.jsx is looking for.
 */
export const getResumeData = async (resumeID) => {
  try {
    // Matches your backend route GET /api/resumes/single?id=xxxx
    const response = await axiosInstance.get(`resumes/single?id=${resumeID}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to load resume");
  }
};

/**
 * @desc Create a New Resume
 */
export const createNewResume = async (data) => {
  try {
    const response = await axiosInstance.post("resumes/", data.data || data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Creation failed");
  }
};

/**
 * @desc Update Existing Resume
 * Aligned with PUT /api/resumes/?id=...
 */
export const updateThisResume = async (resumeID, data) => {
  try {
    // We pass the data directly. Ensure your backend is receiving req.body correctly.
    const response = await axiosInstance.put(`resumes/?id=${resumeID}`, data);
    
    // This MUST return a value for the 'await' in the component to finish
    return response.data; 
  } catch (error) {
    // If you don't 'throw' here, the component 'try' block thinks it succeeded!
    throw error; 
  }
};

/**
 * @desc Delete Resume
 */
export const deleteThisResume = async (resumeID) => {
  try {
    const response = await axiosInstance.delete(`resumes/?id=${resumeID}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Deletion failed");
  }
};