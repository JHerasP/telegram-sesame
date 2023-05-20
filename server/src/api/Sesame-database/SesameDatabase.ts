export interface User {
  cookie: string;
  logSince: Date;
  logUntil: Date;
  autoClose: boolean;
}

class SesameDatabase {
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
    if (user) user.autoClose = !user.autoClose;
  }
  public logOut(userId: number) {
    this.users.delete(userId);
  }
}

export const sesameDatabase = new SesameDatabase();
