// src/reducers/yourReducer.js
import { createSlice } from '@reduxjs/toolkit';
// Get the current date
const currentDate = new Date();

// Extract year, month, and day
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
const day = currentDate.getDate();

// Extract timestamp (hh:mm:ss millisod(6))
const hours = currentDate.getHours();
const minutes = currentDate.getMinutes();
const seconds = currentDate.getSeconds();
const milliseconds = currentDate.getMilliseconds();

// Format timestamp
const timestamp = `${hours}:${minutes}:${seconds}.${milliseconds.toString().padStart(6, '0')}`;

// Format sysdate (dd/mm/yyyy hh:mm:ss)
const sysdate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hours}:${minutes}:${seconds}`;

// Initial state
const initialState = {
    user: '',
    loading: { state: false, message: '' },
    appStatus: 'INIT',
    errors: [],
    test: [],
    datetime: {
        year: year,
        month: month,
        day: day,
        systimestamp: timestamp,
        sysdate: sysdate
    }
};

// Create a slice with reducers and actions
const configuration = createSlice({
    name: 'configuration',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
        setAppStatus: (state, action) => {
            state.appStatus = action.payload;
        },
        setTest: (state, action) => {
            state.test = action.payload;
        }
    },
});

// Export the actions
export const { setUser, setLoading, setErrors, setAppStatus, setTest } = configuration.actions;

// Export the reducer
export default configuration.reducer;