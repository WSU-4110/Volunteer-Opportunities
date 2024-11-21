import Home from "@/app/page.tsx";
import { render, screen } from "@testing-library/react";
import useEmblaCarousel from "embla-carousel-react";
import "@testing-library/jest-dom";

// Mock useEmblaCarousel
jest.mock("embla-carousel-react", () => {
  return jest.fn(() => [
    jest.fn(), // carouselRef
    {
      canScrollPrev: jest.fn(() => true),
      canScrollNext: jest.fn(() => true),
      scrollPrev: jest.fn(),
      scrollNext: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    },
  ]);
});

beforeEach(() => {
  // Mock IntersectionObserver
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe("Home Page Tests", () => {
  it("renders the correct heading text", async () => {
    render(<Home />);

    // Match the heading text "Welcome to Volunteer Opportunities"
    const heading = await screen.findByRole("heading", {
      name: /welcome to volunteer opportunities/i,
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders the correct quote", async () => {
    render(<Home />);

    // Match the quote to “It's easy to make a buck. It's a lot tougher to make a difference”
    const heading = await screen.findByRole("heading", {
      name: /“It's easy to make a buck. It's a lot tougher to make a difference”/i,
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders the correct quote author", async () => {
    render(<Home />);

    // Match the quote author to "-Tom Brokaw"
    const heading = await screen.findByRole("heading", {
      name: /-Tom Brokaw/i,
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders the correct header", async () => {
    render(<Home />);

    // Match the section header text “What do we do?”
    const heading = await screen.findByRole("heading", {
      name: /What do we do?/i,
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders the correct header", async () => {
    render(<Home />);

    // Match the next section header text “Who are we?”
    const heading = await screen.findByRole("heading", {
      name: /Who are we?/i,
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders the profile names", async () => {
    render(<Home />);

    // Match the profile name to "Jacob Ulbrich"
    const heading = await screen.findByRole("heading", {
      name: /Jacob Ulbrich/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
