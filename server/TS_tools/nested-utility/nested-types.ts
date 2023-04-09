/**
 * Obtain the key of an object looping through the depper levels.
 * @warning Do not use with self reference types.
 * @param T
 * @returns "parentKey.childKey.grandChildKey"
 */
export type NestedKeyOf<T extends object> = {
  [Key in keyof T & (string | number)]: getNested<T, Key>;
}[keyof T & (string | number)];

type getNested<T extends object, Key extends keyof T & (string | number)> = T[Key] extends object
  ? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
  : `${Key}`;
