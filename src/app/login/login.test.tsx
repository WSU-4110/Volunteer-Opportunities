import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./login"; // Adjust the path as needed
import "@testing-library/jest-dom";

describe("Login Component", () => {
  it("shows 'Sign in with Google' button when not authenticated", () => {
    render(
      <Login
        authStatus={undefined}
        signIn={jest.fn()}
        signOut={jest.fn()}
      />
    );

    const button = screen.getByText(/Sign in with Google/i);
    expect(button).toBeInTheDocument();
  });

  it("shows user details and 'Sign Out' button when authenticated", () => {
    const mockAuthStatus = {
      user: { id: "24e069f5-ac14-4b1a-86c9-deb0750bf440", name: "Loc Phan", email: "locphan0321@gmail.com" },
      expires: "2030-01-01T00:00:00.000Z",
    };

    render(
      <Login
        authStatus={mockAuthStatus}
        signIn={jest.fn()}
        signOut={jest.fn()}
      />
    );

    const welcomeMessage = screen.getByText(/Welcome, Loc Phan/i);
    const signOutButton = screen.getByText(/Sign Out/i);

    expect(welcomeMessage).toBeInTheDocument();
    expect(signOutButton).toBeInTheDocument();
  });
});
