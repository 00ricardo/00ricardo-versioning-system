/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Divider from '@mui/material/Divider';
import ContentDifferencePreview from './ContentDifferencePreview'
import NothingToCompare from './NothingToCompare'
import { useSelector, useDispatch } from 'react-redux';
import { setAppStatus } from '../redux/reducers/configuration'

import rutils from '00ricardo-utils'
function VersioningSystemDialog() {
    const { loading, appStatus } = useSelector((state) => state.configuration)
    const { uploadedFiles } = useSelector((state) => state.files)
    const { open, canSave, canDiscard, conflictedData } = useSelector((state) => state.versioningSystem)
    const dispatch = useDispatch()

    const startComparison = () => {
        dispatch(setAppStatus('PREPARE_PREVIEW'))
    }

    const PaperComponent = (props) => {
        return (
            <Draggable
                handle="#draggable-dialog-title"
                cancel={'[class*="MuiDialogContent-root"]'}
            >
                <Paper {...props} />
            </Draggable>
        );
    }

    useEffect(() => {
        console.log(conflictedData)
    }, [conflictedData])

    return (
        <Fragment>
            <Dialog
                open={!loading.state && open}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                sx={{
                    "& .MuiDialog-paper": {
                        background: 'var(--charcoal)',
                        minWidth: '650px',
                        maxWidth: '1065px',
                        minHeight: '300px',
                        maxHeight: '600px',
                        height: '600px'
                    }
                }}
            >
                <DialogTitle
                    style={{ cursor: 'move', color: 'var(--white)' }}
                >
                    Versioning System
                </DialogTitle>
                <Divider style={{ borderColor: 'var(--white)' }} />
                <DialogContent>
                    {appStatus === 'INIT' && <NothingToCompare />}
                    {appStatus === 'PREVIEW' && <ContentDifferencePreview />}
                    {appStatus === 'RESOLVED' && <>Conflicts solved...</>}
                </DialogContent>
                <DialogActions>
                    {appStatus !== 'INIT' ?
                        <Fragment>
                            <Button
                                disabled={!canDiscard}
                                onClick={() => { }}
                                variant="outlined"
                                className="discard-btn" >
                                Discard changes
                            </Button>
                            <Button
                                disabled={!canSave}
                                onClick={() => { }}
                                variant="outlined"
                                className="save-btn">
                                Save changes
                            </Button>
                        </Fragment> :
                        <Button
                            onClick={() => startComparison()}
                            variant="outlined"
                            className="save-btn"
                            disabled={uploadedFiles.length !== 2}>
                            Start Comparison
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        </Fragment >
    )
}
export default VersioningSystemDialog