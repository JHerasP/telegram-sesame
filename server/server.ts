import { SesameBotPublic } from "./src/api/Sesame-bot-public/SesameBotPublic";
import app from "./src/app";
import { configIndex } from "./src/config";

const PORT = configIndex.ENV.port;

app.listen(PORT, () => console.info(`Server is listening on ${PORT}`));

export const sesameBot = new SesameBotPublic();
