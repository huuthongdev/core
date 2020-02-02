import * as Yup from 'yup'
import { useFormik } from 'formik'
import { ICpnFormStructureItem } from "./CpnForm.types"

export const useForm = (structure: ICpnFormStructureItem[], handleSubmit: (values: any) => Promise<any>, isDebug?: boolean) => {
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
            const isUpdateSubmitting = await handleSubmit(values)
                .catch(err => setErrors(err.errors || {}))

            if (isUpdateSubmitting) setSubmitting(false);
        }
    })

    if (isDebug) console.log('Form debug: ', JSON.stringify(formProps, null, 4));

    return formProps
}