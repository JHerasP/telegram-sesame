import { sendLoggingMessage } from "./public/loggIng";
import { sendWelcomeMessage, welcomeCallbacks } from "./public/welcome";

import { sendAutoCheckOutMessage, AutoChecoutCallbaks } from "./private/autoCheckOut";
import {
  sendAutoCheckOutWarningMessage,
  handleCheckOutWarningMenu,
  AutoCheckOutWarningCallbaks,
} from "./private/autoCheckOutWarning";
import { sendCheckMenu, handleCheckMenu, CheckCallbacks } from "./private/checks";
import { sendInfoMenu, handleInfoMenu, InfoMenuCallbacks } from "./private/information";
import { sendLogOutMessage } from "./private/logOut";
import { sendLoggedWelcomeMessage, LoggedCallbacks } from "./private/loggingWelcome";
import { sendMainMenu, handleMainMenu, MenuCallbacks } from "./private/mainMenu";
import { sendOptionsMenu, handleOptionsMenu, OptionCallbacks } from "./private/options";
import { sendRemberCheckInMessage, RemmemberCheckInCallbacks } from "./private/remmemberCheck";
import { sendRenewLogInMessage } from "./private/renew";
import { sendTaskMenu, handleTaskMenu, TaskCallbaks } from "./private/task";

export const publicScreens = {
  sendLoggingMessage,
  sendWelcomeMessage,
};

export const privateScreens = {
  sendAutoCheckOutMessage,
  sendAutoCheckOutWarningMessage,
  sendCheckMenu,
  sendInfoMenu,
  sendLogOutMessage,
  sendLoggedWelcomeMessage,
  sendMainMenu,
  sendOptionsMenu,
  sendRemberCheckInMessage,
  sendRenewLogInMessage,
  sendTaskMenu,
};

export const privateScreensMenuHandlers = {
  handleCheckMenu,
  handleMainMenu,
  handleOptionsMenu,
  handleTaskMenu,
  handleCheckOutWarningMenu,
  handleInfoMenu,
};

export type PublicScreenCallbacks = welcomeCallbacks;
export type PrivateScreenCallbacks =
  | AutoChecoutCallbaks
  | AutoCheckOutWarningCallbaks
  | CheckCallbacks
  | InfoMenuCallbacks
  | LoggedCallbacks
  | MenuCallbacks
  | OptionCallbacks
  | RemmemberCheckInCallbacks
  | TaskCallbaks;
