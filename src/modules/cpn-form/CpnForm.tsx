import React, { FC, ReactElement, useState, Fragment } from 'react'

import * as Yup from 'yup';
import { Formik, Form, getIn, FormikProps } from 'formik';
import { OptionsType, OptionTypeBase } from 'react-select';

import './CpnForm.scss';
import { ClassNames } from '..';
import { CpnIcon } from '../cpn-icon';
import { ICpnInputSelectOption, IButtonProps } from '../types';

interface IField {
    isVisible?: boolean,
    label: string,
    name: string,
    col?: number,
    validate?: any,
    defaultValue?: any,
    input: (state: ICpnInputCustomState, formProps: FormikProps<any>) => ReactElement,
    // ============================ Input file ============================
    maxLength?: number,
    // ============================ Currency ============================
    max?: number,
    // ============================ Selects ============================
    options?: ICpnInputSelectOption[],
    loadSyncOptions?: (formProps: FormikProps<any>) => ICpnInputSelectOption[],
    loadOptions?: (inputValue: string, callback: (options: OptionsType<OptionTypeBase>) => void, formProps: FormikProps<any>) => void | Promise<any>,
    disabled?: boolean,
    onChange?: (value: any) => void,
}

interface ICpnInputCustomState {
    onChange: (value: any) => void,
    onFocus: () => void,
    onBlur: () => void,
    defaultValue?: any,
    className?: string,
    disabled?: boolean,
}

type CpnInputProps = {
    onChange: (value: any) => void;
    formProps: FormikProps<any>,
    fieldProps: IField,
    defaultValue?: any,
    className?: string,
    disabled?: boolean,
    // ============================ Input Related ============================
    label?: string,
    errorMessage?: string,
    input: (state: ICpnInputCustomState, formProps: FormikProps<any>) => ReactElement,
}

const CpnInput: FC<CpnInputProps> = (props) => {
    const [isFocus, setIsFocus] = useState(false);

    return <div className={ClassNames({
        CpnInput: true,
        focus: isFocus,
        hasValue: !!props.formProps.values[props.fieldProps.name],
        [props.className as string]: !!props.className,
        error: props.errorMessage,
        disabled: props.disabled,
    })}>
        {props.label ? <div className="Label">{props.label}</div> : null}
        
        <div className="Input">
            {props.input({
                onChange: (value: any) => props.onChange(value),
                onFocus: () => setIsFocus(true),
                onBlur: () => setIsFocus(false),
                defaultValue: props.defaultValue,
                disabled: !!props.disabled,
                className: props.className || '',
            }, props.formProps)}
        </div>

        {props.errorMessage ? <div className="ErrorMessage">{props.errorMessage}</div> : null}
    </div>
}

type CpnFormProps = {
    handleSubmit: (values: any) => Promise<any>,
    structure: IField[],
    className?: string,
    labelSubmit?: string,
    buttonClose?: IButtonProps,
    isDebug?: boolean,
}

export const CpnForm: FC<CpnFormProps> = (props) => {
    const structure = props.structure.filter(v => v.isVisible !== false);

    return (
        <div className={ClassNames({
            CpnForm: true,
            [props.className as string]: !!props.className
        })}>
            <Formik
                enableReinitialize
                initialValues={structure.reduce((output: any, item) => {
                    output[item.name] = item.defaultValue || '';
                    return output;
                }, {})}
                validationSchema={Yup.object().shape(structure.reduce((output: any, item) => {
                    if (item.validate) output[item.name] = item.validate;
                    return output
                }, {}))}
                onSubmit={async (values, { setErrors, setSubmitting }) => {
                    const isUpdateSubmitting = await props.handleSubmit(values)
                        .catch(err => setErrors(err.errors || {}))

                    if (isUpdateSubmitting) setSubmitting(false);
                }}
            >
                {(formProps) => {
                    if (props.isDebug) console.log('Form debug: ', JSON.stringify(formProps, null, 4));

                    return <Form className="form">
                        <div className="row">
                            {structure.map((fieldProps, key) => {
                                const { col, name, label } = fieldProps;

                                const fieldGeneralProps = {
                                    label,
                                    onChange: (e: any) => {
                                        formProps.setFieldValue(name, e);
                                        if (fieldProps.onChange) fieldProps.onChange(e);
                                    },
                                    onFocus: () => formProps.setFieldTouched(name, true),
                                    disabled: formProps.isSubmitting || fieldProps.disabled,
                                    errorMessage: getIn(formProps.touched, name) ? getIn(formProps.errors, name) : '',
                                    defaultValue: fieldProps.defaultValue,
                                }

                                return <div className={`col-${col || 12}`} key={key}>
                                    <CpnInput
                                        {...fieldGeneralProps}
                                        input={fieldProps.input}
                                        fieldProps={fieldProps}
                                        formProps={formProps}
                                    />
                                </div>
                            })}
                        </div>

                        <div className="actions">
                            {(() => {
                                if (formProps.isSubmitting) return <div className="loading">
                                    <CpnIcon.Loading />
                                </div>

                                return <Fragment>
                                    {(() => {
                                        if (!props.buttonClose || !props.buttonClose.onClick) return null

                                        return <button
                                            type="button"
                                            className="buttonClose"
                                            onClick={() => props.buttonClose && props.buttonClose.onClick ? props.buttonClose.onClick() : null}
                                        >
                                            {props.buttonClose.label || 'Close'}
                                        </button>
                                    })()}

                                    <button type="submit">
                                        {props.labelSubmit || 'Submit'}
                                    </button>
                                </Fragment>
                            })()}
                        </div>
                    </Form>
                }}
            </Formik>
        </div>
    )
}