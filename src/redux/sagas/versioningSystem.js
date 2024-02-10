/* eslint-disable no-unused-vars */
// src/sagas/yourSagas.js
import { select, takeLatest, put, delay } from 'redux-saga/effects';
import { setAppStatus, setLoading } from '../reducers/configuration';
function* versioningSystemSaga() {
    const app_status = yield select((state) => state.configuration.appStatus)

    if (app_status === 'PREPARE_PREVIEW') {
        yield put(setLoading({ state: true, message: 'Looking for conflicts...' }))
        /*
        ... logic here ...
        */
        // Delay for 2 seconds
        yield delay(3000);
        yield put(setLoading({ state: true, message: 'Preparing Resolution Environment...' }))

        yield delay(4000);
        yield put(setLoading({ state: false, message: '' }));
        yield put(setAppStatus('PREVIEW'));
    } else if (app_status === 'PREVIEW') {
        return
    } else {
        return
    }
}

export function* versioningSystemListener() {
    yield takeLatest([setAppStatus], versioningSystemSaga);
}

export default versioningSystemListener