import type { Meta, StoryObj } from "@storybook/react";
import { HeroCard } from "./HeroCard";

const meta: Meta<typeof HeroCard> = {
  title: "Cards/HeroCard",
  component: HeroCard,
};

export default meta;

type Story = StoryObj<typeof HeroCard>;

export const Default: Story = {
  args: {
    article: {
      id: "1",
      title: "AICTE announces new research scholarships",
      summary: "Funding boost for STEM scholars with rolling deadlines and VIP mentorship access.",
      shortSummary: "Funding boost for STEM scholars.",
      tags: ["Scholarship", "AICTE"],
      source: { name: "AICTE" },
      publishedAt: new Date().toISOString(),
      url: "#",
    },
  },
};


