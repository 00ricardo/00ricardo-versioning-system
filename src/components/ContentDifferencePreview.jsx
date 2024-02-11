/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import ReactDiffViewer from 'react-diff-viewer';
import {
    Toolbar, AppBar, Chip,
    Radio, RadioGroup, FormControlLabel, FormControl,
    Box
} from '@mui/material';
import { setNumberOfConflicts } from '../redux/reducers/versioningSystem';
import { useDispatch } from 'react-redux';
import rutils from '00ricardo-utils'
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const defaultStyles = {
    variables: {
        light: {
            diffViewerBackground: '#fff0',
            diffViewerColor: '#fff',
            addedBackground: '#e6ffed',
            addedColor: '#24292e',
            removedBackground: '#ffd8dc',
            removedColor: '#24292e',
            wordAddedBackground: '#acf2bd',
            wordRemovedBackground: '#fdb8c0',
            addedGutterBackground: '#cdffd8',
            removedGutterBackground: '#fdb8c0',
            gutterBackground: '#ffffff42',
            gutterBackgroundDark: '#9FB1BC',
            highlightBackground: '#fffbdd',
            highlightGutterBackground: '#fff5b1',
            codeFoldGutterBackground: '#fff0',
            codeFoldBackground: '#1e3542',
            emptyLineBackground: '#fafbfc',
            gutterColor: '#000',
            addedGutterColor: '#000',
            removedGutterColor: '#000',
            codeFoldContentColor: '#fff',
            diffViewerTitleBackground: '#9fb1bcab',
            diffViewerTitleColor: '#fff',
            diffViewerTitleBorderColor: '#eee',
        }
    }
}
function ContentDifferencePreview() {
    const [remoteData, setRemoteData] = useState(
        `
const a = 123
const a = 999
const b = 10
const a = 10

const c = () => console.log('tpon')

if(a > 10) {console.log('bar')}
console.log('done')
console.log('done')
console.log('abc')
console.log('hehe')
`) //! comparisson method
    const [localData, setLocalData] = useState(
        `
const a = 123
const a = 101
const b = 10
const a = 10

const c = () => {
console.log('dbri')
}

if(a > 10) {
    console.log('bar')
}
console.log('done')
console.log('done')
console.log('abc')
`) //! comparisson method
    const [method, setMethod] = useState('diffLines') //! comparisson method
    const [conflictedData, setConflictedData] = useState([]) //! aray of conflicted rows ["6","11","12","13","15","14","16"]
    const [changesDraft, setChangesDraft] = useState('')
    const [selectedRow, setSelectedRow] = useState('') //! line selected
    const [modifiedTableElement, setModifiedTableElement] = useState(null);
    const [conflictCounter, setConflictCounter] = useState(0)
    const dispatch = useDispatch()

    const changeMethod = (m) => { setMethod(m) }

    const rowIsConflicted = (row) => {
        return conflictedData.includes(row)
    }
    const handleClick = (decision) => {
        const tableElement = modifiedTableElement //document.querySelector('.css-31yr27-diff-container');
        let dec = ''
        if (decision === 'CANCEL') dec = `${decision}`
        else if (selectedRow.startsWith('L')) dec = `${decision}_REMOTE`
        else if (selectedRow.startsWith('R')) dec = `${decision}_LOCAL`
        else dec = 'NONE'
        switch (dec) {
            case 'ACCEPT_REMOTE':
                const remoteChanges = overrideContent(tableElement, selectedRow);
                setLocalData(remoteChanges.trim())
                break;
            case 'ACCEPT_LOCAL':
                const localChanges = overrideContent(tableElement, selectedRow);
                setRemoteData(localChanges)
                break;
            case 'CANCEL':
                console.log("Canceling...")
                break;
            default:
                break;
        }
        setSelectedRow('')
    };

    useEffect(() => {
        const lineNumberRef = document.getElementsByClassName('css-spajxp-line-number')
        let lines = []
        Array.from(lineNumberRef).forEach(row => {
            const parentClasses = row.parentNode.classList
            let conflictedLine = ''
            if (parentClasses.contains('css-xug0f4-diff-added')) {
                if (rutils.hasValue(row.innerText)) conflictedLine = `R-${row.innerText}`
            } else if (parentClasses.contains("css-19yygrn-diff-removed")) conflictedLine = `L-${row.innerText}`
            lines.push(conflictedLine)
        });

        dispatch(setNumberOfConflicts(lines.size))
        const cleanConflicts_phase1 = rutils.getUniqueValues(lines)
        const cleanConflicts_phase2 = rutils.removeEmptyElements(cleanConflicts_phase1)
        setConflictedData(cleanConflicts_phase2)
    }, [dispatch])


    const overrideContent = (tableElement, line) => {
        const lines = Array.from(tableElement.querySelectorAll('.css-1n7ec1i-line'));
        const lineNumberSelected = parseInt(line.split('-')[1]);
        let overriddenContent = '';

        lines.forEach((lineElement) => {
            let contentForConcat = ''
            // * Common 
            const lineNumberElements = Array.from(lineElement.querySelectorAll('.css-spajxp-line-number'));
            const lineIterator = parseInt(lineNumberElements[0].textContent);
            // * Left Side
            const leftContentElement = Array.from(lineElement.querySelectorAll('.css-1eh9eak-content-text'))[0];
            const leftLineContent = leftContentElement.textContent.trim();
            // * Right Side
            const rightContentElement = Array.from(lineElement.querySelectorAll('.css-1eh9eak-content-text'))[1];
            const rightLineContent = rightContentElement.textContent.trim();

            console.log(`Line selected: ${lineNumberSelected}.\nL-${lineIterator} content: ${leftLineContent}\nR-${lineIterator} content: ${rightLineContent}`)

            if (line.startsWith('L')) contentForConcat = lineNumberSelected === lineIterator ? leftLineContent : rightLineContent
            else if (line.startsWith('R')) contentForConcat = lineNumberSelected === lineIterator ? rightLineContent : leftLineContent

            console.log("Content for concact: ", contentForConcat)
            console.log("lineNumberSelected === lineIterator", lineNumberSelected === lineIterator)
            console.log("line.startsWith('R')", line.startsWith('R'))
            overriddenContent += contentForConcat + '\n'
        });
        return overriddenContent
    };

    const adaptTable = () => {
        const tableElement = document.querySelector('.css-31yr27-diff-container');
        const lines = Array.from(tableElement.querySelectorAll('.css-1n7ec1i-line'));
        const conflictsCounter = Array.from(tableElement.querySelectorAll('.css-19yygrn-diff-removed')).length
        setConflictCounter(conflictsCounter / 3) // ! Must be divided by 3 because conflictsCounter is considering the gutter and the lineNumber

        lines.forEach((lineElement) => {
            const emptyLine = Array.from(lineElement.querySelectorAll('.css-10regm7-empty-line'))
            const emptyGutters = Array.from(lineElement.querySelectorAll('.css-1f721e2-gutter'))
            // * This means that there is empty lines in both sides
            // * Hence, should not be considere
            if (emptyLine.length === 4) {
                emptyLine.forEach((emplin) => {
                    if (emplin.classList.contains('css-1co2bov-marker') || emplin.classList.contains('css-vl0irh-content')) {
                        emplin.classList.remove('css-10regm7-empty-line')
                    }
                })
                emptyGutters.forEach((empgut) => {
                    if (empgut.classList.contains('css-14cuhda-empty-gutter')) empgut.classList.remove('css-14cuhda-empty-gutter')
                })

            }
        })
        const lineNumberElements = Array.from(document.querySelectorAll('.css-spajxp-line-number'));
        let lineGutter = 1
        lineNumberElements.forEach((lineElement, idx) => {
            lineElement.setAttribute('side', idx % 2 !== 0 ? 'R' : 'L')
            lineElement.addEventListener('click', (event) => {
                const side = event.target.attributes.side.value
                const lineNr = event.target.lastChild.data
                const parseLine = `${side}-${lineNr}`
                setSelectedRow(parseLine);
                console.log(parseLine)
            })
            if (idx % 2 === 0 && idx !== 0) lineGutter++;
            lineElement.innerHTML = lineGutter
        })
        setModifiedTableElement(tableElement);
    }

    useEffect(() => {
        adaptTable()
    }, [localData, remoteData])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <AppBar component="nav" style={{ backgroundColor: 'var(--charcoal)' }}>
                <Toolbar style={{ gap: '1rem', justifyContent: 'space-between', padding: '10px 25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', color: conflictCounter > 0 ? 'var(--old-gold' : 'var(--fresh-green)', gap: '0.5rem' }}>
                        {conflictCounter > 0 ?
                            <>
                                <WarningIcon fontSize='large' className='pulse-warning' />
                                <span>{`${conflictCounter} ${conflictCounter !== 1 ? 'Conflicts' : 'Conflict'}`} Found</span>
                            </>
                            : <>
                                <CheckCircleIcon fontSize='large' style={{ color: 'var(--fresh-green)' }} />
                                <span>Conflicts resolved</span>
                            </>
                        }
                    </div>
                    <Box sx={{ display: { xs: 'none', sm: 'block', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' } }}>
                        <FormControl>
                            <RadioGroup
                                sx={{
                                    "& .MuiRadio-root.Mui-checked": {
                                        color: 'var(--old-gold)'
                                    }
                                }}
                                row
                                value={method}
                                onChange={(e) => changeMethod(e.target.value)}
                            >
                                <FormControlLabel
                                    value='diffLines'
                                    control={<Radio />}
                                    label="Lines Difference"
                                />
                                <FormControlLabel
                                    value='diffChars'
                                    control={<Radio />}
                                    label="Character Differences"
                                />
                                <FormControlLabel
                                    value='diffWords'
                                    control={<Radio />}
                                    label="Words Difference"
                                />
                            </RadioGroup>
                        </FormControl>
                        {selectedRow && rowIsConflicted(selectedRow) ?
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '15px' }}>
                                {selectedRow}
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Chip style={{ color: '#fff' }} size='small' label={`Accept ${selectedRow.startsWith('L') ? 'remote' : 'local'} changes`} variant="outlined" onClick={() => handleClick('ACCEPT')} />
                                    <Chip style={{ color: '#fff' }} size='small' label="Cancel" variant="outlined" onClick={() => handleClick('CANCEL')} />
                                </div>
                            </div> :
                            <></>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
            <div style={{ paddingTop: '20px' }}>
                <ReactDiffViewer
                    leftTitle={'Remote Data'}
                    rightTitle={'Local Data'}
                    style={{ textDecoration: 'none' }}
                    oldValue={remoteData}
                    newValue={localData}
                    splitView={true}
                    compareMethod={method}
                    styles={defaultStyles}
                    showDiffOnly={false}
                />
            </div>
        </div>
    )
}

export default ContentDifferencePreview