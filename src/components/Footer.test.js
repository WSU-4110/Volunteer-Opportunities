import Home from "@/app/page.tsx";
import { cleanup, render, screen, fireClick } from "@testing-library/react";
import useEmblaCarousel from "embla-carousel-react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

class TestFooter {
  async cleanupAfterTest() {
    cleanup();
  }

  async testHeadingText() {
    render(<Footer />);

    // Match the heading text "Welcome to Volunteer Opportunities"
    const heading = await screen.findAllByText(/Volunteer Opportunities/i);
    expect(heading[0]).toBeInTheDocument();
  }

  async testFooterHomeLink() {
    render(<Footer />);

    const linkToHomePage = await screen.findByTestId("homePageLink");
    expect(linkToHomePage).toContainHTML(`href="/"`);
  }

  async testFooterExploreLink() {
    render(<Footer />);

    const linkToExplorePage = await screen.findByText(/explore/i);
    expect(linkToExplorePage).toHaveAttribute("href", "/explore");
  }

  async testFooterMessageLink() {
    render(<Footer />);

    const linkToMessagePage = await screen.findByText(/message/i);
    expect(linkToMessagePage).toHaveAttribute("href", "/message");
  }
}

describe("Footer Tests", () => {
  const testFooter = new TestFooter();

  afterEach(() => {
    testFooter.cleanupAfterTest();
  });

  it("renders the correct footer heading text", async () => {
    await testFooter.testHeadingText();
  });

  it("test the home page link on the footer", async () => {
    await testFooter.testFooterHomeLink();
  });

  it("test the message link on the footer", async () => {
    await testFooter.testFooterMessageLink();
  });
  it("test the explore link on the footer", async () => {
    await testFooter.testFooterExploreLink();
  });
});
