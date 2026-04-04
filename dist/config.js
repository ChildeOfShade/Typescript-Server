process.loadEnvFile();
function envOrThrow(key) {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing environment variable: ${key}`);
    return value;
}
// Combine both configurations into a single exported object
export const config = {
    api: {
        fileserverHits: 0,
        platform: process.env.PLATFORM || "dev", // Default to dev if not set
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: {
            migrationsFolder: "./drizzle",
        },
    },
};
