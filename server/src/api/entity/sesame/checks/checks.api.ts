import request from "request-promise-native";
import { awaitResolver } from "../../../../TS_tools/general-utility";
import { ENV } from "../../../../config";
import { User } from "../../../Sesame-database/SesameDatabase";
import logConsole from "../../../tools/log";
import { handleErrorCheckInOut } from "./checks.tools";
import { taskApiService } from "../task/task.index";
const baseheaders = {
  "User-Agent": "Request-Promise",
  "Content-Type": "application/json",
};

// Not sending workCheckTypeId means check in from office.
// Nonsense, instead of using the list provided by the endpoint,
// it is a mix between the defaults and the ones created by the user.
export async function checkIn(user: User, workCheckTypeId?: string) {
  const { sesameId, cookie } = user;

  const clientServerOptions = {
    uri: ENV.checkIn.replace("idEmployee", sesameId),
    body: JSON.stringify({ origin: "web", coordinates: {}, workCheckTypeId }),
    method: "POST",
    headers: { ...baseheaders, Cookie: cookie },
  };

  const [_, errorResponse] = await awaitResolver(request(clientServerOptions));

  if (errorResponse) {
    handleErrorCheckInOut(
      errorResponse,
      "You are already in. How many times do you want to check in until you are satisfied? (╬▔皿▔)╯"
    );
  } else {
    if (user.startTaskWhenCheckIn) taskApiService.startLastTask(user);
    logConsole({ user, action: "checkIn" });
  }
}

export async function checkout(user: User) {
  const { sesameId, cookie } = user;
  const clientServerOptions = {
    uri: ENV.checkOut.replace("idEmployee", sesameId),
    body: JSON.stringify({ origin: "web", coordinates: {}, workCheckTypeId: null }),
    method: "POST",
    headers: { ...baseheaders, Cookie: cookie },
  };

  const [_, errorResponse] = await awaitResolver(request(clientServerOptions));

  if (errorResponse)
    handleErrorCheckInOut(errorResponse, "You are not working. How come can you stop working twice? (►__◄)╯");
  else logConsole({ user, action: "checkOut" });
}
