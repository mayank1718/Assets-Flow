import React from "react";
import { Search, X } from "lucide-react";

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  autoFocus = false,
  id = "search-input",
  disabled = false,
}) => {
  const handleClear = () => {
    onChange({ target: { value: "" } });
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none"
        aria-hidden="true"
      />
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className="w-full h-10 pl-9 pr-9 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:border-emerald-600 disabled:opacity-50 disabled:bg-slate-50"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
