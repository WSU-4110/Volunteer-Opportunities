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

//TEST 3: fetches user data by ID
describe("getUserById Action Tests", () => {
    it("fetches user data by ID", async () => {
        const mockUser = { id: "1", name: "Loc Phan", bio: "Test bio" };
        console.log("Mock user data:", mockUser);
    
        (database.query.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
        (getUserById as jest.Mock).mockResolvedValue([mockUser, null]);
    
        const [user, error] = await getUserById("1");
        console.log("Result - User:", user, "Error:", error);
    
        expect(user).toEqual(mockUser);
        expect(error).toBeNull();
      });
    


  //TEST 4:  if the user is not found
  it("returns error if user is not found", async () => {
    console.log("Test: Fetching user with non-existent ID");
    (database.query.users.findFirst as jest.Mock).mockResolvedValue(null);
    (getUserById as jest.Mock).mockResolvedValue([null, new Error("User not found")]);

    const [user, error] = await getUserById("999");
    console.log("Result - User:", user, "Error:", error);

    expect(user).toBeNull();
    expect(error).toBeDefined();
    if (error) {
      console.log("Error message:", error.message);
      expect(error.message).toBe("User not found");
    }
  });

  //TEST 5: return error for empty ID
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

  //TEST 6: handle database query failure
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
