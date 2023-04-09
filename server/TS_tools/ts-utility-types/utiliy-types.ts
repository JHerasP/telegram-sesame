/**
 * Obtain the values of an array as a tuple.
 * @T typeof Array which readonly values
 * @returns Tuple of values
 */
export type ValuesOf<T extends readonly any[]> = T[number];

/**
 * Modifies keys to be optional
 * @param T Type
 * @param F keys of T
 */
export type OptionalKeys<T, F extends keyof T> = Omit<T, F> & Partial<Pick<T, F>>;

/** 
Modifies keys to be required
 * @param T Type
 * @param F keys of T
*/
export type RequiredKeys<T, F extends keyof T> = Omit<T, F> & Required<Pick<T, F>>;

/**
Remplaces types of the given keys by a new type
@param T Type
@param F Keys of T
@param R new Type
*/
export type ReplaceTypes<T, F extends keyof T, R> = Omit<T, F> & Record<F, R>;

/**
Remplace key name and type
@param T Type
@param F Keys of T
@param S New keys
@param R Type of new keys
*/
export type ReplaceKeys<T, F extends keyof T, S extends string, R> = Omit<T, F> & Record<S, R>;

/**
 * Modifies all the keys to be optional exepct for the given keys.
 * @param T Type
 * @param F Keys to keep required
 */
export type OptionalExceptFor<T, F extends keyof T = keyof T> = Partial<Pick<T, Exclude<keyof T, F>>> &
  Required<Pick<T, F>>;
