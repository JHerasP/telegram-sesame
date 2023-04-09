/**
 * Resolves a promise returning the following structure:
 * [data, error]
 * If the promise is resolved, error will be null,
 * if the promise is rejected, data will be null.
 * @param promise
 * @param T - data resolved
 * @param U - error rejected
 */
export const awaitResolver = async <T, U>(promise: Promise<T>) => {
  try {
    const data = await promise;
    return [data, null] as const;
  } catch (err) {
    return [null, err as U] as const;
  }
};
