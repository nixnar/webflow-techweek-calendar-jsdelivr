import React from "react";

export default function CitySelector({ data, setCity, city, currentCity }) {
  return (
    <div className="flex-grow basis-0 border-[1px] border-white p-[4px] bg-black">
      <div
        className={`grow flex flex-col gap-[10px] p-3 pb-4 border-[1px] border-white ${
          currentCity === city
            ? "bg-[#14e8ff] text-[#000]"
            : "bg-[#000] text-[#979797]"
        }`}
        onClick={() => setCity(city)}
      >
        <div className="text-[1rem] font-[700] leading-[1.1rem] opacity-75">
          {data[1]}
        </div>
        <div className="text-[1.65rem] font-[600]">{data[0]}</div>
      </div>
    </div>
  );
}
