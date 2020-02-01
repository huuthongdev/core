import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducers';
import { isDev, Configs } from '../refs';

const persistConfig = {
    version: 1,
    key: Configs.STORE_KEY,
    storage,
    whitelist: [],
    blacklist: [],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer, isDev ? composeWithDevTools() : undefined)
const persistor = persistStore(store)

export {
    store,
    persistor
}