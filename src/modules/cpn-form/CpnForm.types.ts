import { ReactElement } from "react"
import { IButtonProps } from "../types"

// ======================= External =======================
export interface ICpnFormStructureItem {
    input: (state: ICpnFormInput) => ReactElement,
    label: string,
    name: string,
    isVisible?: boolean,
    col?: number,
    validate?: any,
    defaultValue?: any,
    disabled?: boolean,
    onChange?: (value: any) => void,
    isWraped?: boolean,
}

export interface ICpnFormInput {
    onChange: (value: any) => void,
    onFocus: () => void,
    onBlur: () => void,
    getValue: (name: string) => any,
    defaultValue?: any,
    className?: string,
    disabled?: boolean,
    value: any,
}

// ======================= Internal =======================
export interface CpnInputProps {
    name: string,
    input: (state: ICpnFormInput) => ReactElement,
    onChange: (value: any) => void,
    getValue?: (name: string) => any, 
    defaultValue?: any,
    className?: string,
    disabled?: boolean,
    value?: any,
    label?: string,
    errorMessage?: string,
    getError?: (name: string) => any,
}

export interface CpnFormProps {
    handleSubmit: (values: any) => Promise<any> | void,
    structure: ICpnFormStructureItem[],
    className?: string,
    labelSubmit?: string,
    buttonClose?: IButtonProps,
    isDebug?: boolean,
}