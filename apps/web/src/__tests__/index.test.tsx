import { render, screen } from "@testing-library/react";
import Home from "../pages/index";

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Home Page", () => {
  it("renders hero headline", () => {
    render(<Home />);
    expect(screen.getByText(/Stay ahead of every educational opportunity/i)).toBeInTheDocument();
  });

  it("renders filter bar categories", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: /Exams/ })).toBeInTheDocument();
  });
});

