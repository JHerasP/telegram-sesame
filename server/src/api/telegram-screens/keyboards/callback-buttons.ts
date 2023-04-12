import { ICustomInLineKeyboadButton } from "./types";

export type TWeekMenuValues = ICustomInLineKeyboadButton<string, string>;

export const createButton = <T extends string, Y extends string>(
  text: T,
  callback_data: Y
): ICustomInLineKeyboadButton<T, Y> => {
  return { text, callback_data };
};
