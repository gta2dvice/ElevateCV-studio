import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Define the EXACT schema expected by your MongoDB 'Resume' model
  resumeData: {
    title: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    address: "",
    phone: "",
    email: "",
    summary: "",
    atsScore: 0,
    themeColor: "#9333ea", // Aligned to CareerForge Purple
    templateName: "ModernTemplate", // Aligned to MongoDB schema
    
    // Crucial: Initialize arrays so .map() functions never crash on load
    experience: [],
    education: [],
    skills: [],
    projects: []
  }
};

export const resumeSlice = createSlice({
  name: "editResume",
  initialState,
  reducers: {
    addResumeData: (state, action) => {
      // Safety net: If the payload is null/empty, keep the safe initial state
      if (action.payload) {
        // Merge the incoming payload with the initial state to guarantee all keys exist
        state.resumeData = { ...initialState.resumeData, ...action.payload };
      }
    },
    // Optional: Add a quick reset action if you need to clear the form later
    clearResumeData: (state) => {
      state.resumeData = initialState.resumeData;
    }
  },
});

export const { addResumeData, clearResumeData } = resumeSlice.actions;

export default resumeSlice.reducer;