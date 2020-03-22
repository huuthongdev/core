import React, { FC, useState, Fragment } from 'react'

import { useForm } from '.';
import { CpnIcon } from '../cpn-icon';
import { ClassNames } from '..';

import './CpnForm.scss';
import { CpnInputProps, CpnFormProps } from './CpnForm.types';

export const CpnInput: FC<CpnInputProps> = (props) => {
    const [isFocus, setIsFocus] = useState(false);
 
    return <div className={ClassNames({
        CpnInput: true,
        focus: isFocus,
        hasValue: !!props.value,
        error: props.errorMessage,
        disabled: props.disabled,
        [props.className as string]: !!props.className,
    })}>
        {props.label ? <div className="Label">{props.label}</div> : null}

        <div className="Input">
            {props.input({
                onChange: (value: any) => props.onChange(value),
                onFocus: () => setIsFocus(true),
                onBlur: () => setIsFocus(false),
                defaultValue: props.defaultValue,
                disabled: !!props.disabled,
                getValue: props.getValue ? props.getValue : () => false,
                value: props.value,
            })}
        </div>

        {props.errorMessage ? <div className="ErrorMessage">{props.errorMessage}</div> : null}
    </div>
}

export const CpnForm: FC<CpnFormProps> = (props) => {
    const structure = props.structure.filter(v => v.isVisible !== false);

    const {
        getError,
        getValue,
        handleChange,
        handleTouched,
        onSubmit,
        isSubmitting,
    } = useForm({
        structure,
        handleSubmit: props.handleSubmit,
        isDebug: props.isDebug
    });

    return (
        <div className={ClassNames({
            CpnForm: true,
            [props.className as string]: !!props.className
        })}>
            <form onSubmit={onSubmit} className="form">
                <div className="row">
                    {structure.map((fieldProps, key) => {
                        const { col, name, label, isVisible, disabled, onChange, defaultValue, input, isWraped } = fieldProps;

                        const inputProps = {
                            name,
                            label,
                            fieldProps,
                            defaultValue,
                            input,
                            disabled: isSubmitting || disabled,
                            errorMessage: getError(name),
                            value: getValue(name),
                            getValue,
                            onChange: (e: any) => {
                                handleChange(name, e);
                                if (typeof onChange === 'function') onChange(e);
                            },
                            onBlur: () => handleTouched(name),
                        }

                        if (isVisible === false) return null

                        if (isWraped === false) return <div className={`col-${col || 12}`} key={key}>
                            {input({
                                onChange: (value: any) => inputProps.onChange(value),
                                onFocus: () => false,
                                onBlur: () => handleTouched(name),
                                defaultValue: inputProps.defaultValue,
                                disabled: !!inputProps.disabled,
                                getValue: inputProps.getValue,
                                value: getValue(name),
                            })}
                        </div>

                        return <div className={`col-${col || 12}`} key={key}>
                            <CpnInput {...inputProps} />
                        </div>
                    })}
                </div>

                <div className="actions">
                    {(() => {
                        if (isSubmitting) return <div className="loading">
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
            </form>
        </div>
    )
}