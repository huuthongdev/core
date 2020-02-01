import React, { FC, useState, useEffect, BaseSyntheticEvent, useRef, useCallback } from 'react'

type Props = {
    defaultValue?: string,
    onChange: (value: string) => void,
    onBlur?: ((event?: React.FocusEvent<HTMLInputElement>) => void) | undefined,
    onFocus?: ((event?: React.FocusEvent<HTMLInputElement>) => void) | undefined,
    type?: 'text' | 'textarea',
    className?: string,
    disabled?: boolean,
    // ============================ Input Related ============================
    label?: string,
    errorMessage?: string,
    onChangeDelay?: number,
}

export const CpnInputText: FC<Props> = (props) => {
    const [, updateState] = React.useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [value, setValue] = useState(props.defaultValue);
    const inputRef: any = useRef(null);

    let delayCheckTyping: any = null;

    useEffect(() => {
        setValue(props.defaultValue);
    }, [props.defaultValue])

    const handleChange = (e: BaseSyntheticEvent) => {
        if (!props.onChangeDelay) {
            const text = e.target.value;
            setValue(text);
            props.onChange(text);
        } else {
            clearTimeout(delayCheckTyping);
            const temp = e.target.value;
            setValue(temp);

            delayCheckTyping = setTimeout(() => {
                if (inputRef.current.value === temp) {
                    props.onChange(temp);
                    forceUpdate();
                }
            }, props.onChangeDelay);
        }
    }

    if (props.type === 'textarea') return <textarea
        ref={inputRef}
        value={value || ''}
        readOnly={props.disabled}
        className="CpnInputText textarea"
        onFocus={() => {
            if (props.onFocus) props.onFocus();
        }}
        onBlur={() => {
            if (props.onBlur) props.onBlur();
        }}
        onChange={handleChange}
    />

    return <input
        ref={inputRef}
        value={value || ''}
        readOnly={props.disabled}
        className="CpnInputText"
        type="text"
        onFocus={(e) => {
            if (props.onFocus) props.onFocus(e);
        }}
        onBlur={e => {
            if (props.onBlur) props.onBlur(e);
        }}
        onChange={handleChange}
    />
}

CpnInputText.defaultProps = {
    disabled: false,
}