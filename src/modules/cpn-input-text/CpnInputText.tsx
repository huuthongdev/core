import React, { useState, useEffect, BaseSyntheticEvent, useCallback, useImperativeHandle, createRef } from 'react'

type Props = {
    defaultValue?: string,
    onChange: (value: string) => void,
    onBlur?: ((event?: React.FocusEvent<HTMLInputElement>) => void) | undefined,
    onFocus?: ((event?: React.FocusEvent<HTMLInputElement>) => void) | undefined,
    type?: 'text' | 'textarea' | 'password',
    className?: string,
    disabled?: boolean,
    placeholder?: string,
    id?: string,
    // ============================ Input Related ============================
    onChangeDelay?: number,
}

export const CpnInputText = React.forwardRef((props: Props, ref) => {
    const [, updateState] = React.useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [value, setValue] = useState(props.defaultValue);
    const inputRef: any = createRef();

    let delayCheckTyping: any = null;

    useEffect(() => {
        setValue(props.defaultValue);
    }, [props.defaultValue])

    useImperativeHandle(ref, () => ({
        setValue,
        input: inputRef.current,
    }))

    const handleChange = (e: BaseSyntheticEvent) => {
        if (!props.onChangeDelay) {
            const text = e.target.value;
            setValue(text);
            props.onChange(text);
        } else {
            clearTimeout(delayCheckTyping);
            const temp = e.target.value;
            setValue(temp);
            const input = inputRef.current;

            delayCheckTyping = setTimeout(() => {
                if (input.value === temp) {
                    props.onChange(temp);
                    forceUpdate();
                }
            }, props.onChangeDelay);
        }
    }

    if (props.type === 'textarea') return <textarea
        id={props.id}
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
        placeholder={props.placeholder}
    />

    return <input
        id={props.id}
        ref={inputRef}
        value={value || ''}
        readOnly={props.disabled}
        className="CpnInputText"
        type={props.type || 'text'}
        onFocus={(e) => {
            if (props.onFocus) props.onFocus(e);
        }}
        onBlur={e => {
            if (props.onBlur) props.onBlur(e);
        }}
        onChange={handleChange}
        placeholder={props.placeholder}
        autoComplete="off"
    />
})

CpnInputText.defaultProps = {
    disabled: false,
}