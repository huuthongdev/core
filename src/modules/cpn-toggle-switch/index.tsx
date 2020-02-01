import React, { FC, useState, useEffect } from 'react'

import './CpnToggleSwitch.scss';

type Props = {
    value?: boolean,
    onChange: (newValue: boolean) => Promise<boolean> | boolean,
}

export const CpnToggleSwitch: FC<Props> = (props) => {
    const [value, setValue] = useState(props.value);
    const [isLoading, setIsLoading] = useState(false);
    const id = `${Date.now()}`;

    const handleChange = async () => {
        if (isLoading) return;

        setValue(!value);
        setIsLoading(true);

        try {
            const isSuccess = await props.onChange(!value);
            if (!isSuccess) setValue(value);
        } catch (error) {
            setValue(value);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        setValue(!!props.value);
    }, [props.value])

    return (
        <div className="CpnToggleSwitch">
            <input type="checkbox" id={id} checked={value} onChange={handleChange} />
            <label htmlFor={id} className="toggle">
                <span>
                    <svg width="10px" height="10px" viewBox="0 0 10 10">
                        <path d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z" />
                    </svg>
                </span>
            </label>
        </div>
    )
}