interface User {
  cookie: string;
  logSince: Date;
  logUntil: Date;
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
}

export const sesameDatabase = new SesameDatabase();
