import React, { useState, useCallback, useRef } from "react";
import { useClickAway } from "react-use";

type Option = {
  value: string;
  label: string;
};

type IPropType = {
  options: Option[];
  defaultCurrent: number;
  placeholder?: string;
  cls?: string | undefined;
  onChange: (item: Option) => void;
  name: string;
};

const SwagNiceSelect = ({
  options,
  defaultCurrent,
  placeholder,
  cls,
  onChange,
  name,
}: IPropType) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(options[defaultCurrent]);
  const onClose = useCallback(() => {
    setOpen(false);
  }, []);
  const ref = useRef(null);

  useClickAway(ref, onClose);

  const currentHandler = (item: { value: string; label: string }) => {
    setCurrent(item);
    onChange(item);
    onClose();
  };

  return (
    <div
      className={`relative inline-block text-left ${cls ? cls : ""}`}
      ref={ref}
    >
      <div>
        <span
          className="cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none"
          onClick={() => setOpen((prev) => !prev)}
          tabIndex={0}
          role="button"
        >
          {current?.label || placeholder}
        </span>
      </div>
      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options?.map((item, i) => (
              <div
                key={i}
                role="none"
                onClick={() => currentHandler(item)}
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                  item.value === current?.value
                    ? "bg-gray-100 text-gray-900"
                    : ""
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SwagNiceSelect;
