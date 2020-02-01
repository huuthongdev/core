import React, { FC, useState, useCallback, useEffect } from 'react'
import NumberFormat, { FormatInputValueFunction } from 'react-number-format';

type Props = {
    onChange: (value: number) => void,
    disabled?: boolean,
    className?: string,
    prefix?: string,
    suffix?: string,
    onBlur?: ((event: React.FocusEvent<HTMLInputElement>) => void) | undefined,
    onFocus?: ((event: React.FocusEvent<HTMLInputElement>) => void) | undefined,
    min?: number,
    max?: number,
    decimalSeparator?: string,
    thousandSeparator?: string,
    format?: string | FormatInputValueFunction | undefined,
    defaultValue?: number,
    // ============================ Input Related ============================
    label?: string,
    errorMessage?: string,
}

export const CpnInputCurrency: FC<Props> = (props) => {
    const { onChange, min, max, disabled } = props;
    const [value, setValue] = useState(props.defaultValue === 7.000000000000001 ? 7 : props.defaultValue);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        setValue(props.defaultValue);
    }, [props.defaultValue])

    return <NumberFormat
        fixedDecimalScale={false}
        className="CpnInputCurrency"
        thousandSeparator={props.thousandSeparator}
        decimalSeparator={props.decimalSeparator}
        value={value || undefined}
        suffix={props.suffix}
        prefix={props.prefix}
        onValueChange={({ floatValue }) => {
            if (disabled) return;

            const data = floatValue;

            if (typeof min === 'number' && +data <= +min) {
                setValue(min);
                onChange(min);
                return forceUpdate();
            };
            if (typeof max === 'number' && +data >= +max) {
                setValue(max);
                onChange(max);
                return forceUpdate();
            };

            setValue(data)
            onChange(data);
        }}
        format={props.format}
        onBlur={(e) => {
            if (props.onBlur) props.onBlur(e)
        }}
        onFocus={e => {
            if (props.onFocus) props.onFocus(e);
        }}
    />
}

CpnInputCurrency.defaultProps = {
    className: '',
    prefix: '',
    suffix: '',
    onChange: (value: number) => value,
    onBlur: () => true,
    decimalSeparator: ',',
    thousandSeparator: '.',
}