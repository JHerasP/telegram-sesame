import { SesameBot } from "./src/api/Sesame-bot/SesameBot";
import { startSessionCheck, startAutoClose } from "./src/api/cron/sesame-cron";
import app from "./src/app";
import { configIndex } from "./src/config";

const PORT = configIndex.ENV.port;

app.listen(parseInt(PORT), "0.0.0.0", () => console.info(`Server is listening on1 ${PORT}`));

export const sesameBot = new SesameBot();
startSessionCheck();
startAutoClose();
