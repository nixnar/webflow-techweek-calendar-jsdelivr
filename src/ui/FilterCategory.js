import React from "react";

export default function FilterCategory({ children, text }) {
  return (
    <div
      id={text}
      className="flex flex-col gap-3 text-[1.125rem] font-[500] leading-[1.1] tracking-[-0.0281rem]"
    >
      <p className="text-white text-[1.125rem]">{text}</p>
      {children}
    </div>
  );
}
