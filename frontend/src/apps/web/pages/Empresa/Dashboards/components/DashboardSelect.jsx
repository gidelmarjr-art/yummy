import { useEffect, useRef, useState } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import "./DashboardSelect.css";

export default function DashboardSelect({
  value,
  onChange,
  options,
  placeholder = "Selecione uma opção",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const selected = options.find((option) => String(option.value) === String(value));

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!selectRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div
      className={`dashboard-select ${isOpen ? "is-open" : ""} ${className}`}
      ref={selectRef}
    >
      <button
        type="button"
        className={`dashboard-select-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <span className="dashboard-select-value">
          {selected?.color && (
            <span className="dashboard-select-dot" style={{ backgroundColor: selected.color }} />
          )}
          {selected?.label || placeholder}
        </span>
        <FaChevronDown className="dashboard-select-arrow" />
      </button>

      {isOpen && (
        <div className="dashboard-select-menu" role="listbox">
          {options.map((option) => {
            const isSelected = String(option.value) === String(value);
            return (
              <button
                type="button"
                key={option.value}
                className={`dashboard-select-option ${isSelected ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span className="dashboard-select-value">
                  {option.color && (
                    <span className="dashboard-select-dot" style={{ backgroundColor: option.color }} />
                  )}
                  {option.label}
                </span>
                {isSelected && <FaCheck className="dashboard-select-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
