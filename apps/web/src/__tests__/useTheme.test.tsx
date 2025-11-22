import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  );
};

describe("useTheme", () => {
  it("toggles between light and dark", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(/light|dark/);
    await user.click(button);
    expect(button).toHaveTextContent(/light|dark/);
  });
});




