import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, CalendarRange, SortDesc } from "lucide-react";
import { Fragment } from "react";
import cn from "@/lib/utils/cn";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const sortOptions = [
  { id: "latest", label: "Latest" },
  { id: "deadline", label: "Deadline" },
  { id: "popular", label: "Trending" },
];

const dateOptions = [
  { id: "anytime", label: "Anytime" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

export const FilterBar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sort,
  onSortChange,
  dateRange,
  onDateRangeChange,
}: FilterBarProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition",
              selectedCategory === category
                ? "border-primary-200 bg-primary-50 text-primary-600"
                : "border-border text-text-muted hover:border-primary-200"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Listbox value={sort} onChange={onSortChange}>
          <div className="relative">
            <Listbox.Button className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text-muted shadow-soft transition hover:border-primary-200">
              <SortDesc className="h-4 w-4" />
              {sortOptions.find((option) => option.id === sort)?.label ?? "Sort"}
              <ChevronDown className="h-4 w-4" />
            </Listbox.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-border bg-surface p-2 text-sm shadow-medium">
                {sortOptions.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option.id}
                    className={({ active }) =>
                      cn(
                        "cursor-pointer rounded-xl px-3 py-2",
                        active ? "bg-primary-50 text-primary-600" : "text-text-muted"
                      )
                    }
                  >
                    {option.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

        <Listbox value={dateRange} onChange={onDateRangeChange}>
          <div className="relative">
            <Listbox.Button className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text-muted shadow-soft transition hover:border-primary-200">
              <CalendarRange className="h-4 w-4" />
              {dateOptions.find((option) => option.id === dateRange)?.label ?? "Date"}
              <ChevronDown className="h-4 w-4" />
            </Listbox.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-border bg-surface p-2 text-sm shadow-medium">
                {dateOptions.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option.id}
                    className={({ active }) =>
                      cn(
                        "cursor-pointer rounded-xl px-3 py-2",
                        active ? "bg-primary-50 text-primary-600" : "text-text-muted"
                      )
                    }
                  >
                    {option.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export default FilterBar;


