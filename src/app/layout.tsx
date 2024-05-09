import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
import { AppHeader } from "@/app/components/AppHeader";
import { AppFooter } from "@/app/components/AppFooter";
import { Flowbite } from "flowbite-react";
import { Toaster } from "react-hot-toast";
import { Web3Modal } from "@/app/context/web3modal";

export const metadata: Metadata = {
  title: "Web3Swag",
  description: "A Swiss Army knife for Web3 developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Modal>
          <Flowbite>
            <div className="flex flex-col min-h-screen font-mono">
              <AppHeader />
              <Toaster position="top-center" />
              <main className="flex-grow">{children}</main>
              <AppFooter />
            </div>
          </Flowbite>
        </Web3Modal>
      </body>
    </html>
  );
}
