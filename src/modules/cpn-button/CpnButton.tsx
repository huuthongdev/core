import React, { FC, useState, CSSProperties, SyntheticEvent } from 'react'

import './CpnButton.scss';
import { CpnIcon } from '../cpn-icon';

export interface ICpnButton {
    isVisible?: boolean,
    label: string,
    onClick?: any,
    isMiddle?: boolean,
    style?: CSSProperties,
    type?: 'button' | 'submit' | 'reset',
    buttonType?: 'success' | 'primary' | 'info' | 'danger' | 'warning' | 'dark' |
    'success-outline' | 'primary-outline' | 'info-outline' | 'danger-outline' | 'warning-outline' | 'dark-outline',
    isLoading?: boolean,
    className?: string,
    disabled?: boolean,
    icon?: () => any,
}

export const CpnButton: FC<ICpnButton> = ({ isVisible, label, type, onClick, isMiddle, style, buttonType, isLoading, className, disabled, icon }) => {
    const [isButtonLoading, setIsButtonLoading] = useState(isLoading);
    let buttonClassName = `CpnButton ${buttonType}`;
    if (isMiddle) buttonClassName += ' middle';
    if (className) buttonClassName += ` ${className}`;
    if (isButtonLoading) buttonClassName += ` loading`;

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
        <div className="CpnButton loading" style={style}>
            <CpnIcon.Loading />
        </div>
    </Wraper>

    return (
        <Wraper>
            {(() => {
                if (onClick) return <button disabled={disabled} style={style} type={type} className={buttonClassName} onClick={handleClick}>
                    {icon ? <div className="icon">
                        {icon()}
                    </div> : null}
                    {label}
                </button>

                return <button disabled={disabled} style={style} type={type} className={buttonClassName}>
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