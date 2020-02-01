import React, { FC } from 'react'

import './CpnWraper.scss'
import { CpnNavigator } from '../cpn-navigator'

export const CpnWraper: FC = (props) => {
    return (
        <div className="CpnWraper">
            <CpnNavigator />

            {props.children}
        </div>
    )
}