import { ENV } from "../../../../config";
import { awaitResolver } from "../../../../TS_tools/general-utility";
import request from "request-promise-native";
import { User } from "../../../sesame-database/SesameDatabase";
import logConsole from "../../../tools/log";
import { TaskTimer, TaskWeek } from "./task.type";

const baseheaders = {
  "User-Agent": "Request-Promise",
  "Content-Type": "application/json",
};

export async function getAllTask({ cookie, sesameId }: User) {
  const clientServerOptions = {
    uri: ENV.allTaskUrl
      .replace("idEmployee", sesameId)
      .replace("thisYear", String(new Date().getFullYear())),
    method: "GET",
    headers: { ...baseheaders, Cookie: cookie },
  };

  const [body] = await awaitResolver<string, any>(request(clientServerOptions));

  if (!body) return [];

  const data = JSON.parse(body);

  if (data) return data.data as TaskWeek[];
  return [];
}

export async function reuseTask(user: User, task: TaskTimer) {
  const clientServerOptions = {
    uri: ENV.reuseTaskUrl.replace("taskId", task.id),
    method: "POST",
    body: JSON.stringify({ latitude: null, longitude: null }),
    headers: {
      ...baseheaders,
      Cookie: user.cookie,
    },
  };
  await awaitResolver<string, any>(request(clientServerOptions));

  logConsole({ user, action: "startTask", taskName: task.comment });
}

export async function getActiveTask({ cookie, sesameId }: User) {
  const clientServerOptions = {
    uri: ENV.activeTaskUrl.replace("idEmployee", sesameId),
    method: "GET",
    headers: {
      ...baseheaders,
      Cookie: cookie,
    },
  };

  const [body] = await awaitResolver<string, any>(request(clientServerOptions));

  if (!body) return undefined;

  const data = JSON.parse(body);

  if (data) return data.data as TaskTimer;
  return undefined;
}

export async function closeTask(user: User, taskId: string) {
  const clientServerOptions = {
    uri: ENV.closeTaskUrl.replace("idTask", taskId),
    method: "POST",
    body: JSON.stringify({ latitude: null, longitude: null }),
    headers: {
      ...baseheaders,
      Cookie: user.cookie,
    },
  };

  const [data, err] = await awaitResolver(request(clientServerOptions));

  if (err) throw new Error("Meh, my creator screwed up somehow, try to log in again (┬┬﹏┬┬)");

  const task = JSON.parse(data).data as TaskTimer;

  logConsole({ user, action: "closeTask", taskName: task.comment });
}
