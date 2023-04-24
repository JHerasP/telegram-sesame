import request from "request";
import { ENV } from "../../../config";

export function logIn({ email, password }: { email: string; password: string }) {
  console.log(ENV);
  const clientServerOptions = {
    uri: ENV.sesameUrl,
    body: JSON.stringify({
      platformData: { platformName: "Chrome", platformSystem: "Linux", platformVersion: "112" },
      email: email,
      password: password,
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  request(clientServerOptions, (_error, response) => {
    console.log(_error);
    if (response.headers) {
      const cookies = response.headers["set-cookie"];
      console.log(cookies);
    }
  });
}
