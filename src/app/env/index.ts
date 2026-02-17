/**
 * Get environment variable with optional default value
 */
function getEnv<T = string>(key: string, defaultValue?: T): T {
  return import.meta.env[key] ?? defaultValue
}

/**
 * Get required environment variable
 */
function getRequiredEnv<T = string>(key: string): T {
  const value = import.meta.env[key]
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is required.`)
  }
  return value
}

/**
 * Application environment variables
 */
export const env = {
  VITE_APP_ENV: getRequiredEnv('VITE_APP_ENV'),

  VITE_APP_NAME: getRequiredEnv('VITE_APP_NAME'),
  VITE_APP_VERSION: getRequiredEnv('VITE_APP_VERSION'),

  VITE_API_BASE_URL: getRequiredEnv('VITE_API_BASE_URL')
}
