/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import ReactDiffViewer from 'react-diff-viewer';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Divider } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { setNumberOfConflicts } from '../redux/reducers/versioningSystem';
import { useDispatch } from 'react-redux';
import Chip from '@mui/material/Chip';
import rutils from '00ricardo-utils'
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
const a = 101
const a = 101
const a = 101
const a = 101
const a = 101
const b = 103
const a = 10
const b = 10
const c = () => console.log('foo')

if(a > 10) { console.log('bar')}
console.log('done')
console.log('done1')
console.log('abcc')
`) //! comparisson method
    const [localData, setLocalData] = useState(
        `
const a = 101
const a = 101
const a = 101
const a = 101
const a = 101
const b = 10
const a = 10
const b = 10

const c = () => console.log('foo')

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
    const diffViewerRef = useRef(null) //! reference of conflicted table
    const dispatch = useDispatch()

    const changeMethod = (m) => { setMethod(m) }

    const rowIsConflicted = (row) => {
        let str = row.replaceAll('L-', '')
        str = str.replaceAll('R-', '')
        return conflictedData.includes(str)
    }
    const handleClick = (decision) => {
        const tableElement = document.querySelector('.css-31yr27-diff-container');
        let dec = ''
        if (decision === 'CANCEL') dec = `${decision}`
        else if (selectedRow.startsWith('L')) dec = `${decision}_REMOTE`
        else if (selectedRow.startsWith('R')) dec = `${decision}_LOCAL`
        else dec = 'NONE'
        switch (dec) {
            case 'ACCEPT_REMOTE':
                console.log("Accepting remote changes...")
                let remoteChanges = overrideContent(tableElement, selectedRow);
                setRemoteData(remoteChanges)
                break;
            case 'ACCEPT_LOCAL':
                let localChanges = overrideContent(tableElement, selectedRow);
                setLocalData(localChanges)

                console.log("Accepting local changes...")
                break;
            case 'CANCEL':
                console.log("Canceling...")
                setSelectedRow('')
                break;
            default:
                break;
        }

        //setChangesDraft(changes)
    };

    useEffect(() => {
        const conflictsRowReference = document.getElementsByClassName('css-1f721e2-gutter')
        let lines = []
        Array.from(conflictsRowReference).forEach(row => {
            if (row.classList.length === 2) {
                if (rutils.hasValue(row.innerText)) lines.push(row.innerText)
            }
        });

        dispatch(setNumberOfConflicts(lines.size))
        const cleanConflicts = rutils.getUniqueValues(lines)
        setConflictedData(cleanConflicts)
        //  console.log(cleanConflicts)
    }, [dispatch])

    useEffect(() => {
        console.log(localData)
        console.log(remoteData)
    }, [localData, remoteData])
    const countLines = (tableElement) => {
        const lines = tableElement.querySelectorAll('.css-1n7ec1i-line');

        let leftLines = 0;
        let rightLines = 0;

        lines.forEach((lineElement) => {
            const lineNumberElements = lineElement.querySelectorAll('.css-spajxp-line-number');
            const leftLineNumber = parseInt(lineNumberElements[0].textContent);
            const rightLineNumber = parseInt(lineNumberElements[1].textContent);

            if (!isNaN(leftLineNumber)) {
                leftLines++;
            }

            if (!isNaN(rightLineNumber)) {
                rightLines++;
            }
        });

        return { leftLines, rightLines };
    };

    const overrideContent = (tableElement, line) => {
        const lines = Array.from(tableElement.querySelectorAll('.css-1n7ec1i-line'));
        const lineIndex = parseInt(line.split('-')[1]);

        let overriddenContent = changesDraft;

        lines.forEach((lineElement) => {
            const lineNumberElements = Array.from(lineElement.querySelectorAll('.css-spajxp-line-number'));
            const lineNumber = parseInt(lineNumberElements[0].textContent);
            const emptyLine = Array.from(lineElement.querySelectorAll('.css-14cuhda-empty-gutter'))
            const leftContentElement = Array.from(lineElement.querySelectorAll('.css-1eh9eak-content-text'))[0];
            const leftContent = leftContentElement.textContent.trim();

            const rightContentElement = Array.from(lineElement.querySelectorAll('.css-1eh9eak-content-text'))[1];
            const rightContent = rightContentElement.textContent.trim();

            //console.log("Left", leftContent, lineNumber, emptyLine)
            //console.log("Right", rightContent, lineNumber, emptyLine)

            if (isNaN(lineNumber)) {// * Empty line
                if (emptyLine && line.startsWith('L')) {
                    overriddenContent += leftContent + '\n';
                }
                else if (emptyLine && line.startsWith('R')) {
                    overriddenContent += rightContent + '\n';
                } else {
                    overriddenContent += '\n';
                }
            } else if (lineNumber === lineIndex && line.startsWith('L')) {
                overriddenContent += leftContent + '\n';
            } else if (lineNumber === lineIndex && line.startsWith('R')) {
                overriddenContent += rightContent + '\n';
            } else if (line.startsWith('L')) {
                overriddenContent += leftContent + '\n';
            } else if (line.startsWith('R')) {
                overriddenContent += rightContent + '\n';
            }
            else if (rightContent === '') {
                overriddenContent += '\n';
            } else if (leftContent === '') {
                overriddenContent += '\n';
            }
        });
        return overriddenContent;
    };

    useEffect(() => {
        const tableElement = document.querySelector('.css-31yr27-diff-container');
        if (tableElement) {
            //const overriddenContent = overrideContent(tableElement, 'L-13');
            //const { leftLines, rightLines } = countLines(tableElement);
            /* console.log('Left side lines:', leftLines);
             console.log('Right side lines:', rightLines);*/
            //console.log(overriddenContent);

        }
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
            <Divider />
            {selectedRow && rowIsConflicted(selectedRow) ?
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {selectedRow}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Chip size='small' label={`Accept ${selectedRow.startsWith('L') ? 'remote' : 'local'} changes`} variant="outlined" onClick={() => handleClick('ACCEPT')} />
                        <Chip size='small' label="Cancel" variant="outlined" onClick={() => handleClick('CANCEL')} />
                    </div>
                </div> :
                <></>
            }

            <div style={{ display: 'flex', gap: '1rem' }}>
                <ReactDiffViewer
                    leftTitle={'Remote Data'}
                    rightTitle={'Local Data'}
                    style={{ textDecoration: 'none' }}
                    ref={diffViewerRef}
                    oldValue={remoteData}
                    newValue={localData}
                    splitView={true}
                    compareMethod={method}
                    styles={defaultStyles}
                    onLineNumberClick={(e) => { setSelectedRow(e) }}
                    showDiffOnly={false}
                />
            </div>

        </div>

    )
}

export default ContentDifferencePreview