import React from "react";

export default function FilterButton({ text, onClick, isActive, isDisabled }) {
  return (
    <button
      className={`px-4 py-2 border-[1px] transition-colors ${
        isActive
          ? "bg-white text-black border-white"
          : isDisabled
          ? "bg-transparent text-gray-500 border-gray-500 cursor-not-allowed"
          : "bg-transparent text-white border-white hover:bg-brand hover:text-white"
      }`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
}
