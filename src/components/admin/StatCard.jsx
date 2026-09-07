import React from "react";

const StatCard = ({ icon: Icon, label, value }) => {
return ( <div
   className="
     min-w-0 rounded-xl border border-[#E2EFED] bg-white
     px-2.5 py-2.5 shadow-sm
     sm:rounded-2xl sm:px-4 sm:py-4
   "
 > <div className="flex items-center justify-between gap-2">
{/* Icon */} <div
       className="
         flex h-7 w-7 shrink-0 items-center justify-center
         rounded-lg bg-[#E8F8F6]
         sm:h-10 sm:w-10 sm:rounded-xl
       "
     > <Icon
         className="
           h-3.5 w-3.5 text-[#08A6A0]
           sm:h-5 sm:w-5
         "
       /> </div>

```
    {/* Value */}
    <span
      className="
        text-lg font-bold leading-none text-[#073F42]
        sm:text-2xl
      "
    >
      {value}
    </span>
  </div>

  {/* Label */}
  <p
    className="
      mt-2 truncate text-[10px] font-semibold leading-tight
      text-[#819596]
      sm:mt-3 sm:text-xs
    "
    title={label}
  >
    {label}
  </p>
</div>

);
};

export default StatCard;
