import { ENV } from ".";

export function validateENV(env: typeof ENV) {
  Object.entries(env).forEach(([key, value]) => {
    if (!value) throw new Error(`${key} is missing on the env`);
  });
}
