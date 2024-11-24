import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./login"; 
import "@testing-library/jest-dom";

//TEST 1: show sign in when not authenticated
describe("Login Component", () => {
    it("shows 'Sign in with Google' button when not authenticated", () => {
        console.log("Test: Rendering Login component without authentication");
        render(
            <Login
            authStatus={undefined}
            signIn={jest.fn()}
            signOut={jest.fn()}
            />
        );

        const button = screen.getByText(/Sign in with Google/i);
        console.log("Button found:", button.textContent);
        expect(button).toBeInTheDocument();
        });

  //TEST 2: show user detail after login
  it("shows user details and 'Sign Out' button when authenticated", () => {
    const mockAuthStatus = {
      user: { id: "24e069f5-ac14-4b1a-86c9-deb0750bf440", name: "Loc Phan", email: "locphan0321@gmail.com" },
      expires: "2030-01-01T00:00:00.000Z",
    };

    console.log("Test: Rendering Login component with authenticated user", mockAuthStatus);
    render(
      <Login
        authStatus={mockAuthStatus}
        signIn={jest.fn()}
        signOut={jest.fn()}
      />
    );

    const welcomeMessage = screen.getByText(/Welcome, Loc Phan/i);
    console.log("Welcome message found:", welcomeMessage.textContent);
    const signOutButton = screen.getByText(/Sign Out/i);
    console.log("Sign-out button found:", signOutButton.textContent);

    expect(welcomeMessage).toBeInTheDocument();
    expect(signOutButton).toBeInTheDocument();
  });
});
