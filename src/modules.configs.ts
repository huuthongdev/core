import Axios from "axios";
import { CreateAlert } from "./components/cpn-alert";

export const ModuleConfigs = {
    onError: (message: string, cpnName: string) => {
        CreateAlert({
            type: 'danger',
            message
        })
    },
    onUploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const url = 'https://api.media.dev.simbox.vn/upload';

        return Axios.post(url, formData, {
            timeout: 20000
        })
            .then(res => new Promise((resolve) => {
                setTimeout(() => {
                    resolve(res.data.url)
                }, 1000);
            }))
            .catch(err => {
                throw new Error(err.response.data.message);
            })
    }
}