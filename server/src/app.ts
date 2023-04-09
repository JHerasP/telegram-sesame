import express from "express";
import apiIndex from "./api/index";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiIndex.routes);

export default app;
