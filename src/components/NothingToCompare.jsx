
import { Alert, Typography } from '@mui/material'
import DropZone from './DropZone'
function NothingToCompare() {
    return (
        <div style={{
            gap: '1rem',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Alert
                variant="outlined"
                className='save-btn'
                sx={{
                    '& .MuiAlert-icon': {
                        color: 'var(--fresh-green)'
                    }
                }}>
                <Typography level="h5" >There are not information to compare. Upload two files to check conflicts. </Typography>
            </Alert>
            <DropZone />
        </div>

    )
}

export default NothingToCompare