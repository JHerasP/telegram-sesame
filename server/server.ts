import {cronService} from "./src/api/cron/cron.index";
import app from "./src/app";
import {configIndex} from "./src/config";

const PORT = configIndex.ENV.port;
const HOST = configIndex.ENV.host;
const DEV = configIndex.ENV.dev;

console.info(DEV === "true" ? "⚠ Dev mode ⚠" : "🆗 Prod mode 🆗");

app.listen(parseInt(PORT), HOST, () => console.info(`Server is listening on ${PORT}`));

cronService.runAllCron();
