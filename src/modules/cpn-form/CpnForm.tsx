import React, { FC, useState, Fragment } from 'react'

import { useForm } from '.';
import { CpnIcon } from '../cpn-icon';
import { ClassNames, ObjectUtils } from '..';

import './CpnForm.scss';
import { CpnInputProps, CpnFormProps } from './CpnForm.types';

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

export const CpnForm: FC<CpnFormProps> = (props) => {
    const structure = props.structure.filter(v => v.isVisible !== false);

    const formProps = useForm(structure, props.handleSubmit, props.isDebug);
    const {
        handleSubmit,
        setFieldTouched,
        setFieldValue,
        isSubmitting,
        touched,
        errors
    } = formProps;

    return (
        <div className={ClassNames({
            CpnForm: true,
            [props.className as string]: !!props.className
        })}>
            <form onSubmit={handleSubmit} className="form">
                <div className="row">
                    {structure.map((fieldProps, key) => {
                        const { col, name, label, isVisible } = fieldProps;

                        const fieldGeneralProps = {
                            label,
                            onChange: (e: any) => {
                                setFieldValue(name, e);
                                if (fieldProps.onChange) fieldProps.onChange(e);
                            },
                            onFocus: () => setFieldTouched(name, true),
                            disabled: isSubmitting || fieldProps.disabled,
                            errorMessage: ObjectUtils.getIn(touched, name) ? ObjectUtils.getIn(errors, name) : '',
                            defaultValue: fieldProps.defaultValue,
                        }

                        if (isVisible === false) return null

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