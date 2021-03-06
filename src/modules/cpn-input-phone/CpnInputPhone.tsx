import React, { FC, useState, useEffect } from 'react'
import NumberFormat, { FormatInputValueFunction } from 'react-number-format';

type Props = {
    onChange: (value: string) => void,
    disabled?: boolean,
    className?: string,
    areaCode?: string,
    onBlur?: ((event: React.FocusEvent<HTMLInputElement>) => void) | undefined,
    onFocus?: ((event: React.FocusEvent<HTMLInputElement>) => void) | undefined,
    format?: string | FormatInputValueFunction | undefined,
    defaultValue?: number,
}

export const CpnInputPhone: FC<Props> = (props) => {
    const { onChange, disabled } = props;
    const [value, setValue] = useState(props.defaultValue) as any;

    useEffect(() => {
        setValue(props.defaultValue);
    }, [props.defaultValue, setValue])

    return <NumberFormat
        fixedDecimalScale={false}
        className="CpnInputPhone"
        value={value || undefined}
        onValueChange={({ floatValue }) => {
            if (disabled) return;
            const data = floatValue?.toString() || '';

            setValue(data)
            onChange(data);
        }}
        format={`${props.areaCode} ### ### ###`}
        onBlur={(e) => {
            if (props.onBlur) props.onBlur(e)
        }}
        onFocus={e => {
            if (props.onFocus) props.onFocus(e);
        }}
    />
}

CpnInputPhone.defaultProps = {
    className: '',
    areaCode: '+84',
    onChange: (value: string) => value,
    onBlur: () => true,
}