function getEnv(key: string, defaultVal?: string): string {
    const value = process.env[key] || defaultVal;
    if (!value) {
        throw new Error(`Missing env variable: ${key}`)
    }
    return value;
}

const CONFIG = {
    PORT: parseInt(getEnv('PORT', '3000')),
    ACCESS_TOKEN_SECRET: getEnv('ACCESS_TOKEN_SECRET'),
    REFRESH_TOKEN_SECRET: getEnv('REFRESH_TOKEN_SECRET')
};

export default CONFIG;