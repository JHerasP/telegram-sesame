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
  style: {
    bold?: boolean;
    strong?: boolean;
    italic?: boolean;
    underline?: boolean;
    jumpLine?: boolean;
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
    const [key, value] = style as [keyof TTextStyle["style"], boolean];
    if (key === "bold" && value) sentence = `<b>${sentence}</b>`;
    if (key === "italic" && value) sentence = `<i>${sentence}</i>`;
    if (key === "strong" && value) sentence = `<strong>${sentence}</strong>`;
    if (key === "underline" && value) sentence = `<u>${sentence}</u>`;
    if (key === "jumpLine" && value) sentence = `\n ${sentence}`;
    else sentence = ` ${sentence} `; // Keep the spaces
  });
  return sentence;
};
