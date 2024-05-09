import React from "react";

interface BannerProps {
  title: string; // The title to display in the banner
}

const Banner: React.FC<BannerProps> = ({ title }) => {
  return (
    <div className="w-full h-32 flex justify-center items-center relative overflow-hidden text-center bg-dark dark:bg-dark text-white">
      <div className="absolute top-0 left-0 w-full h-full bg-dark opacity-50 z-10"></div>
      <div className="z-20 relative px-4">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
      </div>
    </div>
  );
};

export default Banner;
