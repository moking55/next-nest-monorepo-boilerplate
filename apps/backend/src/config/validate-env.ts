const requiredSecrets = ['JWT_SECRET', 'SESSION_SECRET'] as const;
const minSecretLength = 32;

// Fail at startup instead of silently signing tokens with a guessable secret.
export function validateEnv(env: Record<string, unknown>) {
  for (const key of requiredSecrets) {
    const value = env[key];
    if (typeof value !== 'string' || value.length < minSecretLength) {
      throw new Error(
        `${key} must be set to a random string of at least ${minSecretLength} characters`,
      );
    }
  }
  return env;
}
