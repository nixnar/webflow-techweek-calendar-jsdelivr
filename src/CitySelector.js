import React from "react";

export default function CitySelector({ data, setCity, city, currentCity }) {
  return (
    <div className="flex-grow basis-0 border-[1px] border-white p-[3px] bg-black">
      <div
        className={`grow flex flex-col gap-3 p-4 border-[1px] border-white ${
          currentCity === city
            ? "bg-[#14e8ff] text-[#000]"
            : "bg-[#000] text-[#979797]"
        }`}
        onClick={() => setCity(city)}
      >
        <h4 className="text-[2.25rem] font-bold">{data[0]}</h4>
        <p className="text-[1.25rem] font-[400]">{data[1]}</p>
      </div>
    </div>
  );
}
