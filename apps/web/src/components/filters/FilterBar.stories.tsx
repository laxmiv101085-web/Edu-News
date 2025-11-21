import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import FilterBar from "./FilterBar";

const meta: Meta<typeof FilterBar> = {
  title: "Filters/FilterBar",
  component: FilterBar,
};

export default meta;

const categories = ["All", "Exams", "Scholarships", "Admissions", "Results"];

const Template = () => {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("latest");
  const [dateRange, setDateRange] = useState("anytime");

  return (
    <FilterBar
      categories={categories}
      selectedCategory={category}
      onCategoryChange={setCategory}
      sort={sort}
      onSortChange={setSort}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
    />
  );
};

export const Playground: StoryObj = {
  render: () => <Template />,
};


