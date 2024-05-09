"use client";

import { Navbar, DarkThemeToggle } from "flowbite-react";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const pathName = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Units Converter", href: "/eth-units-converter" },
    {
      label: "Testnet DEX",
      href: "https://testnets.web3swag.xyz",
      target: "_blank",
    },
    {
      label: "Execute Smart Contract",
      href: "/execute-smart-contract",
    },
  ];

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/#">
        <img
          src="/assets/images/logo.svg"
          className="mr-3 h-9 sm:h-10"
          alt="Web3Swag"
        />
      </Navbar.Brand>
      <div className="flex md:order-2">
        <DarkThemeToggle />
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {navLinks.map((link, index) => (
          <Navbar.Link
            key={index}
            className="text-base"
            active={pathName === link.href}
            href={link.href}
            target={link.target}
          >
            {link.label}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
