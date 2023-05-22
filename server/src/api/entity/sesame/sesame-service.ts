import request from "request-promise-native";
import { awaitResolver } from "../../../TS_tools/general-utility";
import { ENV } from "../../../config";
import { User, sesameDatabase } from "../../Sesame-database/SesameDatabase";
import { sesameBot } from "../../../../server";
import petete from "jsonwebtoken";

export async function logIn({ email, password }: { email: string; password: string }, jwt: string) {
  const clientServerOptions = {
    uri: ENV.sesameUrl,
    body: JSON.stringify({
      platformData: { platformName: "Chrome", platformSystem: "Linux", platformVersion: "112" },
      email: email,
      password: password,
    }),
    method: "POST",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
    },
    resolveWithFullResponse: true,
  };

  const [response, errorResponse] = await awaitResolver<any, any>(request(clientServerOptions));

  if (errorResponse) throw new Error(errorResponse.error);
  else {
    if (response.headers) {
      const cookies = response.headers["set-cookie"];
      const decoded = petete.decode(jwt.split(" ")[1], { json: true });

      if (!decoded) return;

      const expiration = cookies[1].match(/expires=([^;]+)/)[1];
      const expirationDate = new Date(expiration);

      expirationDate.setDate(expirationDate.getDate() - 5);

      const employeeInfo = await getEmployeeInfo(cookies[1]);

      sesameDatabase.setUser(decoded.userId, {
        employeeId: employeeInfo.id,
        workingStatus: employeeInfo.workStatus,
        cookie: cookies[1],
        logSince: new Date(),
        logUntil: expirationDate,
        autoClose: true,
      });
      sesameBot.sendLoggedInMessage(decoded.userId);
    }
  }
}

export async function checkIn(user: User) {
  const { employeeId, cookie } = user;

  const clientServerOptions = {
    uri: ENV.checkIn.replace("idEmployee", employeeId),
    body: JSON.stringify({ origin: "web", coordinates: {}, workCheckTypeId: null }),
    method: "POST",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [_, errorResponse] = await awaitResolver<any, any>(request(clientServerOptions));

  if (!errorResponse) return;

  if (errorResponse.statusCode === 422) {
    throw new Error("You are already in. How many times do you want to check in until you are satisfied? (╬▔皿▔)╯");
  } else {
    throw new Error("Meh, my creator screwed up somehow, try to log in again (┬┬﹏┬┬)");
  }
}

export async function checkout(user: User) {
  const { employeeId, cookie } = user;
  const clientServerOptions = {
    uri: ENV.checkOut.replace("idEmployee", employeeId),
    body: JSON.stringify({ origin: "web", coordinates: {}, workCheckTypeId: null }),
    method: "POST",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [_, errorResponse] = await awaitResolver<any, any>(request(clientServerOptions));
  if (!errorResponse) return;
  if (errorResponse.statusCode === 422) {
    throw new Error("You are not working. How come can you stop working twice? (►__◄)");
  } else {
    throw new Error("Meh, my creator screwed up somehow, try to log in again (┬┬﹏┬┬)");
  }
}

export async function getEmployeeInfo(cookie: string) {
  const clientServerOptions = {
    uri: ENV.employeeInfo,
    method: "GET",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [body] = await awaitResolver<string, any>(request(clientServerOptions));
  if (body) {
    const data = JSON.parse(body);
    if (data) return data.data[0] as { id: string; workStatus: "online" | "offline" };
  }

  throw new Error("Meh, my creator screwed up somehow, try to log in again (┬┬﹏┬┬)");
}
