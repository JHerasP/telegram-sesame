import request from "request-promise-native";
import { ENV } from "../../../../config";
import { awaitResolver } from "../../../../TS_tools/general-utility";
import { processLoggedInUser } from "./login.tools";

const baseheaders = {
  "User-Agent": "Request-Promise",
  "Content-Type": "application/json",
};

export async function logIn({ email, password }: { email: string; password: string }, jwt: string) {
  const clientServerOptions = {
    uri: ENV.sesameUrl,
    body: JSON.stringify({
      platformData: { platformName: "Chrome", platformSystem: "Linux", platformVersion: "112" },
      email,
      password,
    }),
    method: "POST",
    headers: baseheaders,
    resolveWithFullResponse: true,
  };

  const [response, errorResponse] = await awaitResolver<any, any>(request(clientServerOptions));

  if (errorResponse) throw new Error(errorResponse.error);
  else if (response.headers) processLoggedInUser(response.headers, jwt, email);
}
