import { ENV } from ".";

export function validateENV(env: typeof ENV) {
  checkPort(env.port);
  checkIn(env.checkIn);
  checkOut(env.checkOut);
  checkCrypto(env.sesameCrypto);
  checkSesameUrl(env.sesameUrl);
  checkTelegramToken(env.telegramToken);
}

function checkPort(port?: (typeof ENV)["port"]) {
  if (!port) throw Error("Missing env project port");
}

function checkIn(url?: (typeof ENV)["checkIn"]) {
  if (!url) throw Error("Missing env check in url");
}

function checkOut(url?: (typeof ENV)["checkIn"]) {
  if (!url) throw Error("Missing env check in url");
}

function checkCrypto(crypo?: (typeof ENV)["checkIn"]) {
  if (!crypo) throw Error("Missing env crypo for jwt");
}

function checkSesameUrl(url?: (typeof ENV)["checkIn"]) {
  if (!url) throw Error("Missing env sesame url");
}

function checkTelegramToken(token?: (typeof ENV)["checkIn"]) {
  if (!token) throw Error("Missing env telegram token");
}
