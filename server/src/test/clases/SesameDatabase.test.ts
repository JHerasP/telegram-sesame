import { SesameDatabase, User } from "../../api/Sesame-database/SesameDatabase";

describe("SesameDatabase", () => {
  let sesameDatabase: SesameDatabase;

  beforeEach(() => {
    sesameDatabase = new SesameDatabase();
  });

  it("should set and retrieve a user", () => {
    const user: User = {
      cookie: "abc123",
      logSince: new Date(),
      logUntil: new Date(),
      autoClose: false,
    };

    sesameDatabase.setUser(1, user);
    const retrievedUser = sesameDatabase.getUser(1);

    expect(retrievedUser).toEqual(user);
  });

  it("should delete a user", () => {
    const user: User = {
      cookie: "abc123",
      logSince: new Date(),
      logUntil: new Date(),
      autoClose: false,
    };

    sesameDatabase.setUser(1, user);
    sesameDatabase.deleteUser(1);
    const retrievedUser = sesameDatabase.getUser(1);

    expect(retrievedUser).toBeUndefined();
  });

  it("should toggle autoclose for a user", () => {
    const user: User = {
      cookie: "abc123",
      logSince: new Date(),
      logUntil: new Date(),
      autoClose: false,
    };

    sesameDatabase.setUser(1, user);
    sesameDatabase.toogleAutoclose(1);
    const updatedUser = sesameDatabase.getUser(1);

    expect(updatedUser?.autoClose).toBe(true);

    sesameDatabase.toogleAutoclose(1);
    const revertedUser = sesameDatabase.getUser(1);

    expect(revertedUser?.autoClose).toBe(false);
  });

  it("should log out a user", () => {
    const user: User = {
      cookie: "abc123",
      logSince: new Date(),
      logUntil: new Date(),
      autoClose: false,
    };

    sesameDatabase.setUser(1, user);
    sesameDatabase.logOut(1);
    const retrievedUser = sesameDatabase.getUser(1);

    expect(retrievedUser).toBeUndefined();
  });

  it("should retrieve all users", () => {
    const user1: User = {
      cookie: "abc123",
      logSince: new Date(),
      logUntil: new Date(),
      autoClose: false,
    };

    const user2: User = {
      cookie: "def456",
      logSince: new Date(),
      logUntil: new Date(),
      autoClose: true,
    };

    sesameDatabase.setUser(1, user1);
    sesameDatabase.setUser(2, user2);
    const allUsers = sesameDatabase.getAllUsers();

    expect(allUsers.size).toBe(2);
    expect(allUsers.get(1)).toEqual(user1);
    expect(allUsers.get(2)).toEqual(user2);
  });
});
