/* eslint-disable no-unused-vars */
import React from 'react'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux'; // Import useDispatch from react-redux

function BackdropLoading() {
    const { loading } = useSelector((state) => state.configuration);
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            open={loading.state}
        >
            <CircularProgress style={{ color: 'var(--old-gold)' }} />
            <Typography
                style={{ color: 'var(--timberwolf)' }}
                level="h2"
                fontSize="xl" sx={{ mb: 0.5 }}>
                {loading.message}
            </Typography>
        </Backdrop>
    )
}

export default BackdropLoading