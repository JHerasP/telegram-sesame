export interface UserRequest {
  chatId: number;
  employeeName: string;
  accepted: boolean;
}

export class SesameUserRequestDatabase {
  private users: Map<number, UserRequest>;

  constructor() {
    this.users = new Map();
  }

  public setUser(userId: number, user: UserRequest) {
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

  public acceptUser(userId: number) {
    const user = this.users.get(userId);
    if (user) user.accepted = true;
  }
}

export const sesameUserRequestDatabase = new SesameUserRequestDatabase();
