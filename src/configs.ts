export const EnvVals: any = process.env;

interface ServerConfigs {
    ENV: string,
    APP_NAME: string,
    APP_VERSION: string,
    URL_SERVER_API_INTERNAL: string,
    STORE_KEY: string,
}

const Configs: ServerConfigs = {
    ENV: EnvVals.ENV as any || 'local',
    APP_NAME: EnvVals.REACT_APP_URL_APP_NAME || 'Baloo Web Internal',
    APP_VERSION: EnvVals.REACT_APP_URL_APP_VERSION || '1.0.1',
    STORE_KEY: EnvVals.REACT_APP_URL_STORE_KEY || 'baloo_web_internal',

    URL_SERVER_API_INTERNAL: EnvVals.REACT_APP_URL_SERVER_API_INTERNAL || 'http://localhost:4400',
}

export default Configs;