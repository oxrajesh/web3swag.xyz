"use client";
import React, { useState } from "react";
import { convertToAllUnits } from "@/app/utils/converter"; // Ensure this path is correct
import toast from "react-hot-toast";
import Banner from "@/app/components/Banner";
interface Units {
  wei: string;
  kwei: string;
  mwei: string;
  gwei: string;
  szabo: string;
  finney: string;
  ether: string;
  kether: string;
  mether: string;
  gether: string;
  tether: string;
}

const ConversionPage: React.FC = () => {
  const [values, setValues] = useState<Units>({
    wei: "",
    kwei: "",
    mwei: "",
    gwei: "",
    szabo: "",
    finney: "",
    ether: "",
    kether: "",
    mether: "",
    gether: "",
    tether: "",
  });

  const handleValueChange = (unit: keyof Units, value: string) => {
    const newValues = value
      ? convertToAllUnits(value, unit)
      : {
          wei: "",
          kwei: "",
          mwei: "",
          gwei: "",
          szabo: "",
          finney: "",
          ether: "",
          kether: "",
          mether: "",
          gether: "",
          tether: "",
        };
    setValues(newValues);
  };

  const handleCopyClick = (value: string) => {
    navigator.clipboard.writeText(value).then(
      () => {
        toast.dismiss();
        toast.success("Copied!");
      },
      () => {
        toast.dismiss();
        toast.error("Failed to copy");
      }
    );
  };

  const [showAllUnits, setShowAllUnits] = useState(false);

  const unitsToShow = showAllUnits
    ? values
    : { wei: values.wei, gwei: values.gwei, ether: values.ether };

  return (
    <>
      <Banner title="Ethereum Unit Converter" />
      <div className="max-w-screen-md mx-auto">
        <p
          onClick={() => setShowAllUnits(!showAllUnits)}
          className="mt-4 mb-4 mr-2 font-bold text-dark cursor-pointer hover:underline text-right"
        >
          {showAllUnits ? "- Hide Extended" : "+ Show Extended"}
        </p>
        <div className="flex flex-wrap">
          {Object.entries(unitsToShow).map(([unit, value]) => (
            <div key={unit} className="flex w-full mb-4">
              <label className="w-1/5 px-2 text-right font-bold flex items-center justify-end">
                {unit}:
              </label>
              <div className="w-4/5 px-2 flex items-center">
                <div className="relative flex-grow">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleValueChange(unit as keyof Units, e.target.value)
                    }
                    placeholder={`Enter value in ${unit}`}
                    className="form-input border border-gray-300 rounded pl-4 pr-10 py-2 w-full text-gray-800 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleCopyClick(value)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3H6.75A2.25 2.25 0 004.5 5.25v10.5A2.25 2.25 0 006.75 18h3M19.5 8.25v10.5a2.25 2.25 0 01-2.25 2.25H10.5a2.25 2.25 0 01-2.25-2.25V8.25a2.25 2.25 0 012.25-2.25h6.75a2.25 2.25 0 012.25 2.25z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ConversionPage;
