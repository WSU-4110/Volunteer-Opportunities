import Home from "@/app/page.tsx";
import { render, screen } from "@testing-library/react";

test("adds 1 + 2 to equal 3", () => {
  render(<Home></Home>);
  const descriptionText = screen.getByText(
    /Welcome to Volunteer Opportunities/i
  );

  expect(descriptionText);
});
