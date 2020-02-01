import React, { FC, FocusEventHandler, useState, useEffect, useRef } from 'react'
import Select from 'react-select'

import "./CpnInputSelect.scss"
import { ICpnInputSelectOption } from '../types'
import { isEqual } from '../utils/main.utils'
import { ClassNames } from '..'

type Props = {
    options: ICpnInputSelectOption[],
    onChange: (value: any) => void,
    id?: string,
    value?: ICpnInputSelectOption,
    filterOption?: (option: ICpnInputSelectOption) => boolean,
    defaultValue?: any,
    hideSelectedOptions?: boolean,
    noOptionsMessage?: ((obj: { inputValue: string; }) => string | null),
    placeholder?: string,
    className?: string,
    isSearchable?: boolean,
    onBlur?: FocusEventHandler | undefined,
    onFocus?: FocusEventHandler | undefined,
    disabled?: boolean,
    isMulti?: boolean,
    // ============================ Input Related ============================
    label?: string,
    errorMessage?: string,
}

export const CpnInputSelect: FC<Props> = (props) => {
    const [value, setValue] = useState(props.options.find(v => isEqual(v.value, props.defaultValue)) || props.value) as any;
    const innerRef: any = useRef(null);

    useEffect(() => {
        const item = props.options.find(v => isEqual(v.value, props.defaultValue));
        if (item) {
            setValue(item);
            props.onChange(item.value);
        }
        // eslint-disable-next-line
    }, [props.defaultValue, props.options])

    return <Select
        ref={innerRef}
        instanceId={props.label}
        id={props.id}
        inputId={props.id ? props.id + 'input' : undefined}
        className={ClassNames({
            CpnInputSelect: true,
            [props.className as string]: !!props.className,
        })}
        classNamePrefix={ClassNames({
            CpnInputSelect: true,
            [props.className as string]: !!props.className,
        })}
        isSearchable={props.isSearchable}
        placeholder={props.placeholder}
        onChange={(data: any) => {
            if (props.isMulti) props.onChange(data.map((v: any) => v.value));
            else props.onChange(data ? data.value : null)
            setValue(data);
        }}
        defaultValue={props.defaultValue}
        filterOption={props.filterOption}
        noOptionsMessage={props.noOptionsMessage}
        hideSelectedOptions={props.hideSelectedOptions}
        onBlur={e => {
            if (props.onBlur) props.onBlur(e);
        }}
        onFocus={e => {
            if (props.onFocus) props.onFocus(e);
        }}

        options={props.options}
        value={value}
        isClearable
        isDisabled={props.disabled}
        isMulti={props.isMulti}
    />
}

CpnInputSelect.defaultProps = {
    hideSelectedOptions: true,
    isSearchable: true,
    onChange: (item) => item,
    placeholder: '',
    disabled: false,
}