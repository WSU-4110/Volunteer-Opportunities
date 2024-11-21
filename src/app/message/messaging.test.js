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
});
