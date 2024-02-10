// src/reducers/yourReducer.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    open: false,
    numberOfConflicts: 0,
    pendingPreview: true,
    canSave: false,
    canDiscard: false,
    remoteData: '',
    localData: '',
    conflictedData: []
};

// Create a slice with reducers and actions
const versioningSystem = createSlice({
    name: 'versioningSystem',
    initialState,
    reducers: {
        setOpen: (state, action) => {
            state.open = action.payload;
        },
        setNumberOfConflicts: (state, action) => {
            state.numberOfConflicts = action.payload;
        },
        setRemoteData: (state, action) => {
            state.remoteData = action.payload;
        },
        setLocalData: (state, action) => {
            state.localData = action.payload;
        },
        setConflictedData: (state, action) => {
            state.conflictedData = action.payload;
        },
        setCanDiscard: (state, action) => {
            state.canDiscard = action.payload;
        },
        setCanSave: (state, action) => {
            state.canSave = action.payload;
        },
        setPendingPreview: (state, action) => {
            state.pendingPreview = action.payload;
        },
    },
});

// Export the actions
export const { setOpen, setNumberOfConflicts, setRemoteData, setLocalData, setConflictedData,
    setCanDiscard, setCanSave, setPendingPreview } = versioningSystem.actions;

// Export the reducer
export default versioningSystem.reducer;