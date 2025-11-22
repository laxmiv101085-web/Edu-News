import type { Preview } from "@storybook/react";
import React from "react";
import "@/styles/globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { fontVariables } from "@/styles/fonts";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className={fontVariables}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;




