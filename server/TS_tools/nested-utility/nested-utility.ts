import { NestedKeyOf } from "./nested-types";

/**
 * Obtain the value of an object given by a nested key. The type of the returned value can be defined on the second type argument.
 * @param object
 * @param nestedKey
 * @returns The value of the key typed as returnType
 */
export const getValue = <T extends Record<string, unknown>, returnType>(
  object: T,
  nestedKey: NestedKeyOf<T>
): returnType => {
  const listOfKeys = nestedKey.split(".");
  const firstKey = listOfKeys[0] as keyof T;

  listOfKeys.shift();
  const remainingKeys = listOfKeys.join(".") as NestedKeyOf<T>;
  const value = object[firstKey] as unknown as T;

  if (remainingKeys.length) return getValue<T, returnType>(value, remainingKeys);
  else return value as unknown as returnType;
};

/**
 * Sort a list of elements by a nested key.
 * Use in combination with a sort function.
 * To reverse the order us the @param direcction
 * @param a
 * @param b
 * @param nestedKey
 * @param direcction
 */
export const sortBy = <T extends Record<string, unknown>>(
  a: T,
  b: T,
  nestedKey: NestedKeyOf<T>,
  direcction: "up" | "down"
): number => {
  let numberA: number;
  let numberB: number;

  if (direcction === "up") {
    numberA = 1;
    numberB = -1;
  } else {
    numberA = -1;
    numberB = 1;
  }

  const key1 = getValue<T, any>(a, nestedKey);
  const key2 = getValue<T, any>(b, nestedKey);

  if (key1 && key2) {
    return key1 >= key2 ? numberA : numberB;
  } else {
    return 0;
  }
};

/**
 * Find an element in a lis that matches the @param valueToFind, returns undefined otherwise.
 * The value is only going to be compared if it is an string or a number.
 * @param objectList
 * @param nestedKey
 * @param valueToFind Must be an string
 */
export const findBy = <T extends Record<string, unknown>>(
  objectList: T[],
  nestedKey: NestedKeyOf<T>,
  valueToFind: string
) => {
  return objectList.find((element) => {
    const value = getValue<T, string | number | Record<string, unknown> | Array<T>>(element, nestedKey);

    if (typeof value === "string") return value.toLowerCase().includes(valueToFind.toLowerCase());
    else if (typeof value === "number") return value.toString().includes(valueToFind);
    else return undefined;
  });
};

/**
 * Filter the list by the given @param valueToFilter, returns undefined otherwise.
 * The value is only going to be compared if it is an string or a number.
 * @param objectList
 * @param nestedKey
 * @param valueToFilter Must be an string
 */
export const filterBy = <T extends Record<string, unknown>>(
  objectList: T[],
  nestedKey: NestedKeyOf<T>,
  valueToFilter: string
) => {
  return objectList.filter((element) => {
    const value = getValue<T, string | number | Record<string, unknown> | Array<T>>(element, nestedKey);

    if (typeof value === "string") return value.toLowerCase().includes(valueToFilter.toLowerCase());
    else if (typeof value === "number") return value.toString().includes(valueToFilter);
    else return undefined;
  });
};

/**
 * Filters a list by given @param valueToFilter on multiple keys at the same time, returns undefined otherwise.
 * The value are only going to be compared if it is an string or a number.
 * @param objectList
 * @param keyList
 * @param valueToFind
 */
export const filterByMultiple = <T extends Record<string, unknown>>(
  objectList: T[],
  keyList: NestedKeyOf<T>[],
  valueToFind: string
) => {
  return objectList.filter((element) => {
    return keyList.some((_: unknown, i) => {
      // Using iterators over NestedKeyOf<T>[] does not return NestedKeyOf<T>
      const value = getValue<T, string | number | Record<string, unknown> | Array<T>>(element, keyList[i]);

      if (typeof value === "string") return value.toLowerCase().includes(valueToFind.toLowerCase());
      else if (typeof value === "number") return value.toString().includes(valueToFind);
      else return undefined;
    });
  });
};
