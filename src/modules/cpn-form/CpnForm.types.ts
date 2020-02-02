import { FormikProps } from "formik"
import { ReactElement } from "react"
import { IButtonProps } from "../types"

export interface ICpnFormStructureItem {
    isVisible?: boolean,
    label: string,
    name: string,
    col?: number,
    validate?: any,
    defaultValue?: any,
    input: (state: ICpnFormInput, formProps: FormikProps<any>) => ReactElement,
    disabled?: boolean,
    onChange?: (value: any) => void,
}

export interface ICpnFormInput {
    onChange: (value: any) => void,
    onFocus: () => void,
    onBlur: () => void,
    defaultValue?: any,
    className?: string,
    disabled?: boolean,
}

export interface CpnInputProps {
    onChange: (value: any) => void;
    formProps: FormikProps<any>,
    fieldProps: ICpnFormStructureItem,
    defaultValue?: any,
    className?: string,
    disabled?: boolean,
    // ============================ Input Related ============================
    label?: string,
    errorMessage?: string,
    input: (state: ICpnFormInput, formProps: FormikProps<any>) => ReactElement,
}

export interface CpnFormProps {
    handleSubmit: (values: any) => Promise<any>,
    structure: ICpnFormStructureItem[],
    className?: string,
    labelSubmit?: string,
    buttonClose?: IButtonProps,
    isDebug?: boolean,
}