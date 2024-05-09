"use client";

import { Footer } from "flowbite-react";

export function AppFooter() {
  return (
    <Footer container>
      <Footer.Copyright
        href="https://Web3Swag.xyz"
        by="Web3Swag.xyz"
        year={2024}
      />
      <Footer.LinkGroup>
        <Footer.Link href="/about">About</Footer.Link>
        <Footer.Link href="/privacy-policy">Privacy Policy</Footer.Link>
        <Footer.Link href="/licensing">Licensing</Footer.Link>
        <Footer.Link href="/contact">Contact</Footer.Link>
      </Footer.LinkGroup>
    </Footer>
  );
}
