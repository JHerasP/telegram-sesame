import express from "express";
import apiIndex from "./api/index";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(apiIndex.routes);

export default app;
