import React from "react";
import FiltersBody from "./ui/FiltersBody";
export default function Filters({
  city,
  setCity,
  availableFilters,
  activeFilters,
  setActiveFilters,
}) {
  return (
    <div
      id="filters"
      className="w-[22.5rem] max-h-[50dvh]  border-[1px] border-white p-[4px] bg-black sticky top-4 "
    >
      <div
        className="border-[1px] border-white h-full p-4 overflow-y-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <FiltersBody
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          availableFilters={availableFilters}
        />
      </div>
    </div>
  );
}
