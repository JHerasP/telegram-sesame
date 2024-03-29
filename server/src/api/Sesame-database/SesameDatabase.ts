import {awaitResolver} from "../../TS_tools/general-utility";
import {Autocomplete} from "../../TS_tools/ts-utility-types/utiliy-types";
import {ENV} from "../../config";
import {employeeApi} from "../entity/sesame/employee/employee.index";
import logConsole from "../tools/log";

export interface User {
  chatId: number;
  sesameId: string;
  employeeName: string;
  cookie: string;

  // This is weird, working status is a mix in between online and offline + the cases created by the user
  workingStatus: Autocomplete<"online" | "offline">;

  logSince: Date;
  logUntil: Date;

  remmeberCheckIn: boolean;
  startTaskWhenCheckIn: boolean;
  autoCheckOut: boolean;
  rejectedAutoCheckOut: boolean;
}

export class SesameDatabase {
  private users: Map<number, User>;

  constructor() {
    this.users = new Map();
  }

  public setUser(userId: number, user: User) {
    logConsole({user, action: "logged"});
    this.users.set(userId, user);
  }

  public getUser(id: number) {
    return this.users.get(id);
  }

  public deleteUser(id: number) {
    this.users.delete(id);
  }

  public getAllUsers() {
    return this.users;
  }

  public toogleAutoclose(userId: number) {
    const user = this.users.get(userId);
    if (user) user.autoCheckOut = !user.autoCheckOut;
  }

  public logOut(userId: number) {
    this.users.delete(userId);
  }

  public async refreshWorkingStatus(userId: number) {
    const user = this.users.get(userId);
    if (!user) return;

    const [userData] = await awaitResolver(employeeApi.getEmployeeInfo(user?.cookie));

    if (userData) this.users.set(userId, {...user, workingStatus: userData.workStatus});
  }

  public toogleremmeberCheckIn(userId: number) {
    const user = this.users.get(userId);

    if (user) user.remmeberCheckIn = !user.remmeberCheckIn;
  }

  public toogleInminentAutoclose(userId: number, reject: boolean) {
    const user = this.users.get(userId);

    if (user) user.rejectedAutoCheckOut = reject;
  }

  public toogleStartTaskCheckIn(userId: number) {
    const user = this.users.get(userId);

    if (user) user.startTaskWhenCheckIn = !user.startTaskWhenCheckIn;
  }

  public isAdmin(userId: number) {
    const user = this.users.get(userId);

    return parseInt(ENV.adminId) === user?.chatId;
  }
}

export const sesameDatabase = new SesameDatabase();
