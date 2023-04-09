import { Router } from "express";
import { sesameRoutes } from "./entity/sesame";

const routes = Router();

routes.use("/sesame", sesameRoutes);

const apiIndex = {
  routes,
};

export default apiIndex;
