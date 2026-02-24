"use client";

import { forwardRef, SelectHTMLAttributes, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (e: { target: { value: string } }) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, hint, options, placeholder, id, required, value, onChange, disabled, ...props },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = error ? `${selectId}-error` : undefined;
    const hintId = hint && !error ? `${selectId}-hint` : undefined;
    
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption?.label || placeholder || "Select...";

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowDown" && isOpen) {
        e.preventDefault();
        const currentIndex = options.findIndex(opt => opt.value === value);
        const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        onChange?.({ target: { value: options[nextIndex].value } });
      } else if (e.key === "ArrowUp" && isOpen) {
        e.preventDefault();
        const currentIndex = options.findIndex(opt => opt.value === value);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        onChange?.({ target: { value: options[prevIndex].value } });
      }
    };

    const handleSelect = (optionValue: string) => {
      onChange?.({ target: { value: optionValue } });
      setIsOpen(false);
    };

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          {/* Hidden native select for form submission */}
          <select
            ref={ref}
            id={selectId}
            required={required}
            value={value}
            onChange={(e) => onChange?.({ target: { value: e.target.value } })}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom select trigger */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-describedby={errorId || hintId}
            className={cn(
              "w-full px-4 py-3 rounded-xl border bg-white transition-all duration-200 cursor-pointer text-left",
              "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
              "flex items-center justify-between gap-2",
              error
                ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                : "border-surface-300 hover:border-surface-400",
              disabled && "opacity-50 cursor-not-allowed bg-surface-50",
              isOpen && "ring-2 ring-primary-500/20 border-primary-500",
              className
            )}
          >
            <span className={cn(
              "truncate",
              !selectedOption && "text-foreground/50"
            )}>
              {displayValue}
            </span>
            <ChevronDown 
              className={cn(
                "w-5 h-5 text-foreground/40 flex-shrink-0 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-surface-200 shadow-xl overflow-hidden"
              >
                <ul
                  ref={listRef}
                  role="listbox"
                  aria-labelledby={selectId}
                  className="py-2 max-h-60 overflow-y-auto"
                >
                  {options.map((option, index) => {
                    const isSelected = option.value === value;
                    return (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                          "px-4 py-2.5 cursor-pointer transition-colors duration-100",
                          "flex items-center justify-between gap-3",
                          isSelected
                            ? "bg-primary-50 text-primary-700"
                            : "text-foreground hover:bg-surface-50",
                          index === 0 && "rounded-t-lg",
                          index === options.length - 1 && "rounded-b-lg"
                        )}
                      >
                        <span className="truncate font-medium">{option.label}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-foreground/50">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
