import { SesameBotPublic } from "./src/api/Sesame-bot-public/SesameBotPublic";
import app from "./src/app";
import { configIndex } from "./src/config";
import session from "express-session";

const PORT = configIndex.ENV.port;
app.use(
  session({
    secret: "your-secret-key", // Secret key used to sign the session ID cookie
    resave: true, // Whether to save the session back to the store for each request, even if it wasn't modified
    saveUninitialized: false, // Whether to save uninitialized sessions to the store
    store: new session.MemoryStore(),
  })
);

app.listen(PORT, () => console.info(`Server is listening on ${PORT}`));

export const sesameBot = new SesameBotPublic();
