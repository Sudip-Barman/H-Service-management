const StatCard = ({ icon: Icon, label, value }) => {
  return (
    <div
      className="
        min-w-0 rounded-lg border border-[#E2EFED] bg-white
        px-2 py-1.5 shadow-sm

        sm:rounded-xl sm:px-2.5 sm:py-2.5
        md:rounded-2xl md:px-4 md:py-4
      "
    >
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Icon */}
        <div
          className="
            flex h-6 w-6 shrink-0 items-center justify-center
            rounded-md bg-[#E8F8F6]

            sm:h-7 sm:w-7 sm:rounded-lg
            md:h-10 md:w-10 md:rounded-xl
          "
        >
          <Icon
            className="
              h-3 w-3 text-[#08A6A0]

              sm:h-3.5 sm:w-3.5
              md:h-5 md:w-5
            "
          />
        </div>

        {/* Value */}
        <span
          className="
            text-base font-bold leading-none text-[#073F42]

            sm:text-lg
            md:text-2xl
          "
        >
          {value}
        </span>
      </div>

      {/* Label */}
      <p
        className="
          mt-1 truncate
          text-[9px] font-semibold leading-tight text-[#819596]

          sm:mt-1.5 sm:text-[10px]
          md:mt-3 md:text-xs
        "
        title={label}
      >
        {label}
      </p>
    </div>
  );
};

export default StatCard;
