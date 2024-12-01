import NavbarClient from "./NavbarClient";
import {
  cleanup,
  render,
  screen,
  fireClick,
  fireEvent,
} from "@testing-library/react";
import useEmblaCarousel from "embla-carousel-react";
import "@testing-library/jest-dom";
import Footer from "./Footer";
import { MenuItem } from "./ui/navbar-menu";

class TestNavbar {
  async cleanupAfterTest() {
    cleanup();
  }

  async startBeforeEach() {
    jest.mock("framer-motion", () => ({
      ...jest.requireActual("framer-motion"),
      motion: {
        div: ({ children }) => <div>{children}</div>, // mock motion.div
        p: ({ children }) => <p>{children}</p>, // mock motion.p
      },
    }));
  }

  async testUnauthenticatedNavbarExplore() {
    render(
      <NavbarClient
        userHasOrganization={false}
        userStatus={false}
        authStatus={undefined}
        className=""
      />
    );

    const linkToExplorePage = await screen.findByText(/Explore/i, {
      timeout: 5000,
    });
    expect(linkToExplorePage).toBeInTheDocument();
  }

  async testAuthenticatedNavbarCreateListing() {
    //Create a new date with 30 minutes before expiration so that the cookie doesn't expire when testing.
    let date = new Date();

    date.setTime(date.getTime() + 30 * 60 * 1000);

    render(
      <NavbarClient
        userHasOrganization={false}
        userStatus={false}
        authStatus={{
          user: {
            id: "1",
            name: "Sebastian",
            email: "hk9952@wayne.edu",
            image:
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          },
          expires: date.toISOString(),
        }}
        className=""
      />
    );

    const linkToCreateListing = await screen.findByText(/Create/i);
    expect(linkToCreateListing).toBeInTheDocument();
  }

  async testMenuItemRender() {
    const setActiveMock = jest.fn();

    render(
      <MenuItem setActive={setActiveMock} active={null} item="Test Item">
        <div>Item Content</div>
      </MenuItem>
    );

    const itemElement = screen.getByText("Test Item");
    expect(itemElement).toBeInTheDocument();

    fireEvent.mouseEnter(itemElement);
    expect(setActiveMock).toHaveBeenCalledWith("Test Item");

    const contentElement = screen.getByText("Test Item");
    expect(contentElement).toBeInTheDocument();
  }
}

describe("Navbar Tests", () => {
  const testNavbar = new TestNavbar();
  afterEach(() => {
    testNavbar.cleanupAfterTest();
  });

  beforeEach(() => {
    testNavbar.startBeforeEach();
  });

  it("Testing navbar explore link without being authenticated", async () => {
    await testNavbar.testUnauthenticatedNavbarExplore();
  });

  it("Testing navbar create organization with being authenticated", async () => {
    await testNavbar.testAuthenticatedNavbarCreateListing();
  });
  it("Testing to see if the navbar renders menuitems correctly", async () => {
    await testNavbar.testMenuItemRender();
  });
});
