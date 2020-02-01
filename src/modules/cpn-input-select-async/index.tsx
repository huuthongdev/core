import React, { FC, FocusEventHandler, useState, useEffect, useRef } from 'react'
import AsyncSelect from 'react-select/async';
import { OptionTypeBase, OptionsType } from 'react-select';

import { ClassNames } from '..'

import './CpnInputSelectAsync.scss';

interface Item {
    value: any,
    label: string,
}

type Props = {
    onChange: (value: any) => void;
    id?: string,
    filterOption?: (option: Item) => boolean,
    defaultValue?: Item | null,
    hideSelectedOptions?: boolean,
    noOptionsMessage?: ((obj: {
        inputValue: string;
    }) => string | null),
    placeholder?: string,
    className?: string,
    isSearchable?: boolean,
    loadOptions: (inputValue: string, callback: (options: OptionsType<OptionTypeBase>) => void) => void | Promise<any>,
    loadingMessage?: ((obj: { inputValue: string; }) => string | null) | undefined,
    onBlur?: FocusEventHandler | undefined,
    onFocus?: FocusEventHandler | undefined,
    disabled?: boolean,
}

export const CpnInputSelectAsync: FC<Props> = (props) => {
    const [value, setValue] = useState(props.defaultValue) as any;
    const innerRef: any = useRef(null);

    useEffect(() => {
        if (props.defaultValue) setValue(props.defaultValue);
    }, [props.defaultValue, setValue])

    return <AsyncSelect
        ref={innerRef}
        id={props.id}
        inputId={props.id ? props.id + 'input' : undefined}
        className={ClassNames({
            CpnInputSelectAsync: true,
            [props.className as string]: !!props.className,
        })}
        classNamePrefix={ClassNames({
            CpnInputSelectAsync: true,
            [props.className as string]: !!props.className,
        })}
        isSearchable={props.isSearchable}
        placeholder={props.placeholder}
        onChange={(data: any) => {
            setValue(data);
            props.onChange(data ? data.value : null)
        }}
        
        value={value}
        filterOption={props.filterOption}
        noOptionsMessage={props.noOptionsMessage}
        hideSelectedOptions={props.hideSelectedOptions}
        onBlur={e => {
            if (props.onBlur) props.onBlur(e);
        }}
        onFocus={e => {
            if (props.onFocus) props.onFocus(e);
        }}

        loadOptions={props.loadOptions}
        loadingMessage={props.loadingMessage}
        isDisabled={props.disabled}
    />
}

CpnInputSelectAsync.defaultProps = {
    hideSelectedOptions: true,
    isSearchable: true,
    onChange: (item) => item,
    placeholder: '',
    noOptionsMessage: () => 'Bạn hãy nhập từ khoá tìm kiếm.',
    loadingMessage: () => 'Đang tìm kiếm.',
    disabled: false,
}