import { SesameBot } from "./src/api/Sesame-bot/SesameBot";
import { startCronSessionCheck, startCronAutoClockOut } from "./src/api/cron/sesame-cron";
import app from "./src/app";
import { configIndex } from "./src/config";

const PORT = configIndex.ENV.port;
const HOST = configIndex.ENV.host;
const DEV = configIndex.ENV.dev;
console.info(DEV ? "⚠ Dev mode ⚠" : "🆗 Prod mode 🆗");
app.listen(parseInt(PORT), HOST, () => console.info(`Server is listening on ${PORT}`));

export const sesameBot = new SesameBot();
startCronSessionCheck();
startCronAutoClockOut();
