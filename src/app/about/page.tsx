"use client";
import React from "react";
import Banner from "../components/Banner";

const AboutPage: React.FC = () => {
  return (
    <>
      <Banner title="About" />
      <div className="max-w-screen-md mx-auto text-center">
        <div className="max-w mt-5">
          <div className="flex flex-col gap-3">
            <p>Coming soon!</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
