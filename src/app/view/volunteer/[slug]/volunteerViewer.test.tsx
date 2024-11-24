import { getUserById } from "./actions"; 
import { database } from "@/database/index"; 

jest.mock("@/database/index", () => ({
  database: {
    query: {
      users: {
        findFirst: jest.fn(),
      },
    },
  },
}));

jest.mock("./actions", () => ({
  getUserById: jest.fn(), 
}));

describe("getUserById Action Tests", () => {
  it("fetches user data by ID", async () => {
    const mockUser = { id: "1", name: "Loc Phan", bio: "Test bio" };

    (database.query.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
    (getUserById as jest.Mock).mockResolvedValue([mockUser, null]);

    const [user, error] = await getUserById("1");

    expect(user).toEqual(mockUser);
    expect(error).toBeNull(); 
    if (error) {
      throw new Error("This should not happen if error is null.");
    }
  });

  it("returns error if user is not found", async () => {
    (database.query.users.findFirst as jest.Mock).mockResolvedValue(null);
    (getUserById as jest.Mock).mockResolvedValue([null, new Error("User not found")]);

    const [user, error] = await getUserById("999");

    expect(user).toBeNull();
    expect(error).toBeDefined(); 
    if (error) {
      expect(error.message).toBe("User not found"); 
    }
  });

  it("returns error for empty user ID", async () => {
    (database.query.users.findFirst as jest.Mock).mockResolvedValue(null);
    (getUserById as jest.Mock).mockResolvedValue([null, new Error("Invalid user ID")]);

    const [user, error] = await getUserById(""); 

    expect(user).toBeNull(); 
    expect(error).toBeDefined(); 
    if (error) {
      expect(error.message).toBe("Invalid user ID"); 
    }
  });

  it("handles database query failure", async () => {
    const mockError = new Error("Database query failed");
    (database.query.users.findFirst as jest.Mock).mockRejectedValue(mockError);
    (getUserById as jest.Mock).mockResolvedValue([null, mockError]);

    const [user, error] = await getUserById("1");

    expect(user).toBeNull(); 
    expect(error).toBeDefined(); 
    if (error) {
      expect(error.message).toBe("Database query failed"); 
    }
  });
});
