/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { setErrors, setUploadedFiles } from '../redux/reducers/files'
import { Chip } from '@mui/material';
import rutils from '00ricardo-utils'
function DropZone() {
    const { uploadedFiles } = useSelector((state) => state.files)
    const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({ maxFiles: 2, disabled: uploadedFiles.length === 2 });
    const dispatch = useDispatch()

    // ! Loop through the errors and extract distinct ones
    const createErrorSet = (errors) => {
        const uniqueErrors = new Set();
        errors.forEach(item => {
            item.errors.forEach(error => {
                uniqueErrors.add(JSON.stringify({ variant: 'error', message: error.message }));
            });
        });
        return Array.from(uniqueErrors).map(error => JSON.parse(error));
    };

    useEffect(() => {
        if (rutils.hasValue(fileRejections)) {
            const errorSet = createErrorSet([...fileRejections]);
            dispatch(setErrors(errorSet))
        } else if (rutils.hasValue(acceptedFiles)) {
            const temp = [...acceptedFiles]
            if (uploadedFiles.length === 1) temp.push(uploadedFiles[0])
            dispatch(setUploadedFiles(temp))
        }
    }, [dispatch, fileRejections, acceptedFiles])

    const removeFile = (file) => {
        var array = [...uploadedFiles]
        const idx = uploadedFiles.findIndex((uf) => uf.path === file.name)
        if (idx !== -1) array = rutils.removeElement(array, idx)
        dispatch(setUploadedFiles([...array]))
    }

    return (
        <Fragment>
            <section style={{
                border: '1px solid var(--timberwolf)',
                borderStyle: 'dashed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div {...getRootProps({ className: 'dropzone' })} style={{ marginLeft: '20px' }}>
                    <input {...getInputProps()} />
                    <p style={{
                        color: 'var(--timberwolf)'
                    }}>
                        Drag 'n' drop some files here, or click to select files.
                    </p>
                    <small style={{
                        color: 'var(--old-gold)',
                        textDecoration: 'underline',
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        2 files are the maximum number of files you can drop here.
                    </small>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    {uploadedFiles.map((file, idx) => (
                        <Chip
                            key={idx}
                            className='chip-file'
                            label={file.name}
                            onDelete={() => removeFile(file)}
                        />
                    ))}
                </div>
            </section>
        </Fragment>

    )
}

export default DropZone

