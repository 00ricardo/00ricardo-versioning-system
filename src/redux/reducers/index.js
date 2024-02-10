import { combineReducers } from 'redux';
import configuration from './configuration';
import versioningSystem from './versioningSystem'
import files from './files';
const rootReducer = combineReducers({
    configuration: configuration,
    versioningSystem: versioningSystem,
    files: files
});

export default rootReducer;
