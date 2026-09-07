import { Filter, Search, X } from "lucide-react";

const SearchFilter = ({
  search,
  setSearch,
  showFilters,
  setShowFilters,
  children,
  placeholder = "Search...",
}) => {
  return (
    <div className="rounded-xl border border-[#E2EFED] bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
      {/* Search Bar + Filter Button */}
      <div className="flex gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            className="
              absolute left-3 top-1/2
              h-3.5 w-3.5
              -translate-y-1/2
              text-[#8AA0A1]

              sm:h-4 sm:w-4
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={placeholder}
            className="
              h-9 w-full
              rounded-lg
              border border-[#D9E9E7]
              bg-[#FAFDFC]
              pl-9 pr-3
              text-xs text-[#173F41]
              outline-none
              transition

              placeholder:text-[#A0B1B2]

              focus:border-[#08A6A0]
              focus:ring-2
              focus:ring-[#08A6A0]/10

              sm:h-11
              sm:rounded-xl
              sm:pl-10
              sm:pr-4
              sm:text-sm
            "
          />

          {/* Clear Search */}
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="
                absolute right-2.5 top-1/2
                flex h-5 w-5
                -translate-y-1/2
                items-center justify-center
                rounded-full
                text-[#819596]
                hover:bg-[#E8F8F6]
                hover:text-[#08A6A0]

                sm:right-3
              "
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setShowFilters((value) => !value)}
          className={`
            inline-flex
            h-9 shrink-0
            items-center justify-center
            gap-1.5
            rounded-lg
            border
            px-3
            text-xs
            font-semibold
            transition

            sm:h-11
            sm:gap-2
            sm:rounded-xl
            sm:px-4
            sm:text-sm

            ${
              showFilters
                ? "border-[#08A6A0] bg-[#E8F8F6] text-[#08A6A0]"
                : "border-[#D9E9E7] text-[#31585A] hover:border-[#08A6A0] hover:text-[#08A6A0]"
            }
          `}
        >
          <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />

          <span className="hidden xs:inline sm:inline">
            Filters
          </span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-3 border-t border-[#EAF2F0] pt-3 sm:mt-4 sm:pt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;