import { awaitResolver } from "../../../../TS_tools/general-utility";
import { User } from "../../../asesame-database/SesameDatabase";
import { taskApi } from "./task.index";

export async function startLastTask(user: User) {
  const [task] = await awaitResolver(taskApi.getAllTask(user));
  if (!task) return;

  await taskApi.reuseTask(user, task[0].days[0].timers[0]);
}
