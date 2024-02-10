import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducers/index.js'
import sagas from './sagas/index.js'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
})

// then run the saga
sagaMiddleware.run(sagas)

export default store;