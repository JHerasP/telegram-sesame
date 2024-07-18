import { checkApi } from "./checks/check.index";
import { employeeApi } from "./employee/employee.index";
import router from "./sesame.routes";
import { taskApi } from "./task/task.index";

export const sesameApi = {
  checkApi,
  employeeApi,
  taskApi,
};

export { router as sesameRoutes };
