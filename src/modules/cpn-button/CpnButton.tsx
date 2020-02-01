import React, { FC, useState, CSSProperties, SyntheticEvent } from 'react'

import './CpnButton.scss';
import { CpnIcon } from '../../refs';

type Props = {
    isVisible?: boolean,
    label: string,
    onClick?: any,
    isMiddle?: boolean,
    style?: CSSProperties,
    type?: 'button' | 'submit' | 'reset',
    buttonType?: 'danger' | 'success' | 'primary' | 'dark' | 'info' | 'outlineDark',
    isLoading?: boolean,
}

export const CpnButton: FC<Props> = ({ isVisible, label, type, onClick, isMiddle, style, buttonType, isLoading }) => {
    const [isButtonLoading, setIsButtonLoading] = useState(isLoading);
    let className = `CpnButton ${buttonType}`;
    if (isMiddle) className += ' middle';

    // ============================ Functions ============================
    const handleClick = async (e?: SyntheticEvent) => {
        if (e) e.preventDefault();
        setIsButtonLoading(true);
        await onClick();
        setIsButtonLoading(false);
    }

    const Wraper: any = (props: any) => {
        if (isMiddle) return <div className="CpnButton_Wraper_Middle">
            {props.children}
        </div>
        return props.children
    }

    if (!isVisible) return null

    if (isButtonLoading || isLoading) return <Wraper>
        <div style={style}>
            <CpnIcon.Loading />
        </div>
    </Wraper>

    return (
        <Wraper>
            {(() => {
                if (onClick) return <button style={style} type={type} className={className} onClick={handleClick}>
                    {label}
                </button>

                return <button style={style} type={type} className={className}>
                    {label}
                </button>
            })()}
        </Wraper>
    )
}

CpnButton.defaultProps = {
    isVisible: true,
    isMiddle: true,
    type: 'button',
    buttonType: 'primary',
}