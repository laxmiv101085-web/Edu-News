import type { Meta, StoryObj } from "@storybook/react";
import ArticleCard from "./ArticleCard";

const meta: Meta<typeof ArticleCard> = {
  title: "Cards/ArticleCard",
  component: ArticleCard,
  args: {
    article: {
      id: "demo",
      title: "State CET 2026 registrations open now",
      shortSummary: "Applications accepted until Feb 12 with new centers added for rural students.",
      type: "Exam",
      publishedAt: new Date().toISOString(),
      tags: ["Exam", "Admissions"],
      source: { name: "State CET" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArticleCard>;

export const Vertical: Story = {};

export const Horizontal: Story = {
  args: {
    layout: "horizontal",
  },
};


