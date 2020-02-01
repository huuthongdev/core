import React, { FC, CSSProperties } from 'react'

import './CpnBox.scss'

type Props = {
    name: string,
    style?: CSSProperties,
}

export const CpnBox: FC<Props> = (props) => {
    return (
        <div className="CpnBox" style={props.style}>
            <div className="name">{props.name}</div>
            <div className="content">
                {props.children}
            </div>
        </div>
    )
}