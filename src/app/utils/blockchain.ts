import { ethers } from "ethers";

export const checkIfAddressIsValid = (address: string) => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
};
