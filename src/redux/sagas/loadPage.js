/* eslint-disable no-unused-vars */
// src/sagas/yourSagas.js
import { put, takeLatest, delay } from 'redux-saga/effects';
import { setUser, setLoading } from '../reducers/configuration';
import { setOpen } from '../reducers/versioningSystem';
function* stopLoadingSaga() {
    yield put(setLoading({ state: true, message: 'Versioning System Loading...' }));
    // Delay for 2 seconds
    yield delay(2000);
    yield put(setLoading({ state: false, message: '' }));
    yield put(setOpen(true));
}

export function* userListener() {
    yield takeLatest([setUser], stopLoadingSaga);
}

export default userListener