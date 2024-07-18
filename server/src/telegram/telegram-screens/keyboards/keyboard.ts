import { ICustomInLineKeyboadButton, TTextStyle } from "./keyboard.types";

export type TWeekMenuValues = ICustomInLineKeyboadButton<string, string>;

export const createButton = <Y extends string>(
  text: string,
  callback_data: Y
): ICustomInLineKeyboadButton<string, Y> => {
  return { text, callback_data };
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
    else if (key === "italic") sentence = `<i>${sentence}</i>`;
    else if (key === "strong") sentence = `<strong>${sentence}</strong>`;
    else if (key === "underline") sentence = `<u>${sentence}</u>`;
    else if (key === "jumpLine") sentence = `${sentence} \n`;
    else sentence = ` ${sentence} `; // Keep the spaces
  });

  return sentence;
};
