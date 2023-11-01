import { awaitResolver } from "../../../../TS_tools/general-utility";
import { User } from "../../../Sesame-database/SesameDatabase";
import { getAllTask, reuseTask } from "./task.api";

export async function startLastTask(user: User) {
  if (user.startTaskWhenCheckIn) {
    const [task] = await awaitResolver(getAllTask(user));
    if (!task) return;

    await reuseTask(user, task[0].days[0].timers[0]);
  }
}
