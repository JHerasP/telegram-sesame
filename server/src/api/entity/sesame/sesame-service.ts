import request from "request-promise-native";
import { awaitResolver } from "../../../TS_tools/general-utility";
import { ENV } from "../../../config";
import { SesameBot } from "../../Sesame-bot/SesameBot";

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
      const decoded = Buffer.from(jwt.split(".")[1], "base64").toString();

      new SesameBot(JSON.parse(decoded).userId, cookies[1]);
    }
  }
}
