import { Router } from "express";
import { sesameRoutes } from "./api/sesame/sesame.index";

const routes = Router();

routes.use("/sesame", sesameRoutes);

export default routes;
