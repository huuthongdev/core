import * as Yup from 'yup'
import { useFormik } from 'formik'

import { ObjectUtils } from '..'

interface IUseFormStructureItem {
    isVisible?: boolean,
    name: string,
    validate?: any,
    defaultValue?: any,
    disabled?: boolean,
    onChange?: (value: any) => void,
}

interface IUseForm {
    structure: IUseFormStructureItem[],
    handleSubmit: (values: any) => Promise<any> | void,
    isDebug?: boolean,
}

interface IUseFormProps {
    getError: (name: string) => string,
    getTouched: (name: string) => string,
    getValue: (name: string) => any,
    handleChange: (name: string, value: any) => void,
    handleTouched: (name: string, status?: boolean) => void,
    onSubmit: (e?: any) => void,
    isSubmitting: boolean,
    getFieldProps: (fieldName: string) => {
        value: any,
        errorMessage: string | null,
        handleChange: (value: any) => void,
        handleTouched: (status: boolean) => void,
    }
}

export const useForm = (state: IUseForm): IUseFormProps => {
    const { structure, handleSubmit, isDebug } = state;

    const formProps = useFormik({
        enableReinitialize: true,
        initialValues: structure.reduce((output: any, item) => {
            output[item.name] = item.defaultValue || '';
            return output;
        }, {}),
        validationSchema: Yup.object().shape(structure.reduce((output: any, item) => {
            if (item.validate) output[item.name] = item.validate;
            return output
        }, {})),
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            try {
                await handleSubmit(values)
            } catch (error) {
                setErrors(error.errors || {});
            }

            setSubmitting(false);
        }
    })

    if (isDebug) console.log('Form debug: ', JSON.stringify(formProps, null, 4));

    return {
        getError: (name: string) => ObjectUtils.getIn(formProps.touched, name, '') ? ObjectUtils.getIn(formProps.errors, name, '') : '',
        getTouched: (name: string) => ObjectUtils.getIn(formProps.touched, name, ''),
        getValue: (name: string) => ObjectUtils.getIn(formProps.values, name, ''),
        handleChange: (name: string, value: any) => formProps.setFieldValue(name, value),
        handleTouched: (name: string, status: boolean = true) => formProps.setFieldTouched(name, status),
        getFieldProps: (name: string) => ({
            value: ObjectUtils.getIn(formProps.values, name, ''),
            errorMessage: ObjectUtils.getIn(formProps.touched, name, '') ? ObjectUtils.getIn(formProps.errors, name, '') : '',
            handleChange: (value: any) => formProps.setFieldValue(name, value),
            handleTouched: (status: boolean = true) => formProps.setFieldTouched(name, status)
        }),
        onSubmit: (e) => {
            try {
                if (e) e.preventDefault();
            } catch (error) { }

            return formProps.handleSubmit();
        },
        isSubmitting: formProps.isSubmitting,
    }
}