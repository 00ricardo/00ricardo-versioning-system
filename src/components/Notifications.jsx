import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setErrors } from '../redux/reducers/files'
import rutils from '00ricardo-utils'
function Notifications() {
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar();
    const { errors, uploadedFiles } = useSelector((state) => state.files)
    useEffect(() => {
        if (rutils.hasValue(errors)) {
            errors.map((e) => {
                enqueueSnackbar(e.message, { variant: e.variant })
                dispatch(setErrors([]))
                return null
            })
        }
        else if (!rutils.hasValue(errors) && rutils.hasValue(uploadedFiles)) {
            enqueueSnackbar('File uploaded successfully!', { variant: 'success' })
        }
    }, [dispatch, errors, uploadedFiles, enqueueSnackbar])

}
export default Notifications
