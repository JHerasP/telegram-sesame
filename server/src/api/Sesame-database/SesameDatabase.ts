import { Autocomplete } from "../../TS_tools/ts-utility-types/utiliy-types";
import { getEmployeeInfo } from "../entity/sesame/sesame-service";

export interface User {
  telegramId: number;
  sesameId: string;
  employeeName: string;
  // This is weird, working status is a mix in between online and offline + the cases created by the user
  workingStatus: Autocomplete<"online" | "offline">;
  cookie: string;
  logSince: Date;
  logUntil: Date;
  autoCheckOut: boolean;
  remmeberCheckIn: boolean;
  autoCheckIn: boolean;
}

export class SesameDatabase {
  private users: Map<number, User>;

  constructor() {
    this.users = new Map();
  }

  public setUser(userId: number, user: User) {
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

  public refresh(userId: number) {
    const user = this.users.get(userId);
    if (!user) return;

    return getEmployeeInfo(user?.cookie)
      .then((userData) => {
        if (userData) this.users.set(userId, { ...user, workingStatus: userData.workStatus });
      })
      .catch(() => undefined);
  }

  public toogleremmeberCheckIn(userId: number) {
    const user = this.users.get(userId);

    if (user) user.remmeberCheckIn = !user.remmeberCheckIn;
  }
}

export const sesameDatabase = new SesameDatabase();
