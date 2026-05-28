import { configureStore } from "@reduxjs/toolkit";
import resumeReducers from "../features/resume/resumeFeatures";
import userReducers from "../features/user/userFeatures";

// ALIGNMENT FIX: Export a single, unified store
export const store = configureStore({
  reducer: {
    editResume: resumeReducers, // Access via state.editResume
    editUser: userReducers,     // Access via state.editUser
  },
});

export default store;