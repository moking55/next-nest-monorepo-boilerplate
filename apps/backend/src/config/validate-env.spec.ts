import { validateEnv } from './validate-env';

const strong = 'x'.repeat(32);

describe('validateEnv', () => {
  it('accepts long secrets', () => {
    const env = { JWT_SECRET: strong, SESSION_SECRET: strong };
    expect(validateEnv(env)).toBe(env);
  });

  it.each([
    [{ SESSION_SECRET: strong }, 'JWT_SECRET'],
    [{ JWT_SECRET: strong }, 'SESSION_SECRET'],
    [
      { JWT_SECRET: 'your-jwt-secret-here', SESSION_SECRET: strong },
      'JWT_SECRET',
    ],
  ])('rejects missing or short secrets (%#)', (env, key) => {
    expect(() => validateEnv(env)).toThrow(key);
  });
});
