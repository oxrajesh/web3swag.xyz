"use client";
import React from "react";
import { Button } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";

function HeroSection() {
  return (
    <div className="hero min-h-screen bg-cover bg-center custom-bg bg-no-repeat flex items-center">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <Image
          src="/assets/images/home.svg"
          width={500}
          height={500}
          alt="Web3Swag"
        />
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Welcome to Web3Swag 🤟
        </h1>
        <p className="text-xl text-gray-200 text-center">
          The Swiss Army knife for Web3 Developers
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <Button outline className="brand">
            <Link href="/eth-units-converter">Ethereum Units Converter</Link>
          </Button>
          <Button outline className="brand">
            <Link href="/execute-smart-contract">Execute Smart Contract</Link>
          </Button>
          <Button outline className="brand">
            <Link href="https://testnets.web3swag.xyz" target="_blank">
              Testnet DEX
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
