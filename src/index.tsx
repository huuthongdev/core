import React, { FC } from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import './index.scss'

import * as serviceWorker from './serviceWorker'
import { store, persistor } from './store'
import AppRoutes from './AppRoutes'
import { CpnAlert } from './refs'

const Root: FC = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <CpnAlert />
                <AppRoutes />
            </PersistGate>
        </Provider>
    )
}

ReactDOM.render(<Root />, document.getElementById('root'));
serviceWorker.unregister();
