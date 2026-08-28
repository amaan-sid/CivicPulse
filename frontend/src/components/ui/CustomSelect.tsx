import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  align?: "left" | "right";
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  disabled = false,
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  size = "md",
  icon,
  align = "left",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-3.5 py-2 text-sm rounded-xl gap-2",
    lg: "px-4 py-2.5 text-base rounded-xl gap-2.5",
  };

  const handleSelect = (val: string, isDisabled?: boolean) => {
    if (isDisabled) return;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between font-medium border transition-all duration-200 outline-none select-none cursor-pointer ${
          sizeClasses[size]
        } ${
          isOpen
            ? "border-sky-500 ring-2 ring-sky-500/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            : "border-slate-300/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-slate-400 dark:text-slate-500 shrink-0">{icon}</span>}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className={`truncate ${!selectedOption ? "text-slate-400 dark:text-slate-500" : ""}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && <span className="ml-1 shrink-0">{selectedOption.badge}</span>}
        </div>

        <ChevronDown
          size={size === "sm" ? 14 : size === "lg" ? 18 : 16}
          className={`shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-sky-500 dark:text-sky-400" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-1.5 w-full min-w-[180px] max-h-60 overflow-y-auto rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/95 dark:bg-slate-800/95 shadow-xl shadow-slate-900/10 dark:shadow-black/50 backdrop-blur-md z-50 p-1.5 space-y-0.5 animation-fadeIn ${dropdownClassName}`}
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 text-center">
              No options available
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => handleSelect(opt.value, opt.disabled)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer select-none text-left ${
                    isSelected
                      ? "bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                  } ${opt.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{opt.label}</span>
                        {opt.badge && <span className="shrink-0">{opt.badge}</span>}
                      </div>
                      {opt.description && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          {opt.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check size={14} className="text-sky-600 dark:text-sky-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
