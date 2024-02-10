// src/sagas.js
import { all, fork } from 'redux-saga/effects';
import loadPage from './loadPage'; // Import your specific sagas
import versioningSystem from './versioningSystem';
// Root Saga
// ! Sagas are processes that runs in the background every time a reducer is called
function* rootSaga() {
    yield all(
        [
            fork(loadPage),
            fork(versioningSystem)
        ]);
}

export default rootSaga;
