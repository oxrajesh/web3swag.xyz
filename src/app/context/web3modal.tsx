"use client";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { supportedChains } from "@/app/utils/networks";

const projectId = process.env.NEXT_PUBLIC_WEB3MODAL_API_KEY;

const metadata = {
  name: "Web3Swag",
  description: "The Swiss Army knife for Web3 Developers",
  url: "https://web3swag.xyz",
  icons: ["https://testnets.web3swag.xyz/static/media/logo.97903a06.svg"],
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: "...",
  defaultChainId: 1,
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: supportedChains,
  projectId,
  enableAnalytics: true,
  enableOnramp: false,
  themeVariables: {
    "--w3m-color-mix-strength": 40,
    "--w3m-accent": "#008080",
    "--w3m-color-mix": "#008080",
    "--w3m-font-family": "Fira Code, monospace",
  },
});

// @ts-ignore
export function Web3Modal({ children }) {
  return children;
}
