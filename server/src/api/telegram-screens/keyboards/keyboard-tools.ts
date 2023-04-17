import { ICustomInLineKeyboadButton } from "./types";

export type TWeekMenuValues = ICustomInLineKeyboadButton<string, string>;

export const createButton = <T extends string, Y extends string>(
  text: T,
  callback_data: Y
): ICustomInLineKeyboadButton<T, Y> => {
  return { text, callback_data };
};

export type TTextStyle = {
  sentence: string;
  style?: {
    bold?: true;
    strong?: true;
    italic?: true;
    underline?: true;
    jumpLine?: true;
  };
};
export const createText = (text: TTextStyle[]): string => {
  let returnText = "";
  text.forEach((line) => {
    const sentence = addStyles(line);

    returnText = returnText.concat(sentence);
  });

  return returnText;
};

const addStyles = (line: TTextStyle) => {
  if (!line.style) return line.sentence;
  let sentence = line.sentence;

  Object.entries(line.style).forEach((style) => {
    const [key] = style as [keyof TTextStyle["style"], boolean];
    if (key === "bold") sentence = `<b>${sentence}</b>`;
    if (key === "italic") sentence = `<i>${sentence}</i>`;
    if (key === "strong") sentence = `<strong>${sentence}</strong>`;
    if (key === "underline") sentence = `<u>${sentence}</u>`;
    if (key === "jumpLine") sentence = `\n ${sentence}`;
    else sentence = ` ${sentence} `; // Keep the spaces
  });
  return sentence;
};
