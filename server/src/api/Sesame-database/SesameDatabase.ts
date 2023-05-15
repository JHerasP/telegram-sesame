interface User {
  cookie: string;
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
    console.info("🆗", this.users);
    return this.users.get(id);
  }
  public deleteUser(id: number) {
    this.users.delete(id);
  }
}

export const sesameDatabase = new SesameDatabase();
