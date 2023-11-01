import { Router } from "express";
import { sesameRoutes } from "./entity/sesame/sesame.index";

const routes = Router();

routes.use("/sesame", sesameRoutes);

const apiIndex = {
  routes,
};

export default apiIndex;
