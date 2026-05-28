import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // ALIGNMENT FIX: Use null instead of "" for an unauthenticated user object
  userData: null, 
};

export const userSlice = createSlice({
  name: "editUser",
  initialState,
  reducers: {
    addUserData: (state, action) => {
      state.userData = action.payload;
    },
    // Optional but recommended: A dedicated logout reducer
    clearUserData: (state) => {
      state.userData = null;
    }
  },
});

export const { addUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;