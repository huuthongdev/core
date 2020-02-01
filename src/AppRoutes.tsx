import React, { FC } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { PageNotFoundScreen } from './screens/pageNotFound';
import { CpnWraper } from './components/cpn-wraper';

import { DashboardScreen } from './screens/dashboard'
import { AuthScreen } from './screens/auth/AuthScreen';

export const Routes = {
    dashboard: {
        path: '/',
        component: DashboardScreen,
    },
    auth: {
        path: '/auth',
        component: AuthScreen,
        isWraper: false,
    }
}

const AppRoutes: FC = () => {
    return (
        <Router>
            <Switch>
                {Object.values(Routes).map((item: any, key) => {
                    return <Route
                        key={key}
                        exact
                        path={item.path}
                        component={(props: any) => {
                            if (item.isWraper === false) return <item.component {...props} />
                            return (
                                <CpnWraper>
                                    <item.component {...props} />
                                </CpnWraper>
                            )
                        }}
                    />
                })}
                <Route component={PageNotFoundScreen} />
            </Switch>
        </Router>
    )
}

export default AppRoutes