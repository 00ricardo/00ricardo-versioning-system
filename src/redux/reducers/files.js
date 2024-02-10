// src/reducers/yourReducer.js
import { createSlice } from '@reduxjs/toolkit';
// Initial state
const initialState = {
    uploadedFiles: [],
    errors: [],
};

// Create a slice with reducers and actions
const configuration = createSlice({
    name: 'files',
    initialState,
    reducers: {
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
        setUploadedFiles: (state, action) => {
            state.uploadedFiles = action.payload;
        },
    },
});

// Export the actions
export const { setErrors, setUploadedFiles } = configuration.actions;

// Export the reducer
export default configuration.reducer;