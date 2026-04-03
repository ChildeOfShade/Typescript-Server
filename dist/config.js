// 1. Load the environment variables first!
process.loadEnvFile();
// 2. Helper to crash if the key is missing
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
}
export const config = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL"), // Load the variable here
};
