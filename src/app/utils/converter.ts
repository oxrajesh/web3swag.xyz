import { BigNumber } from "bignumber.js";

export interface Units {
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

const unitPowers: { [unit: string]: string } = {
  wei: "1",
  kwei: "1000",
  mwei: "1000000",
  gwei: "1000000000",
  szabo: "1000000000000",
  finney: "1000000000000000",
  ether: "1000000000000000000",
  kether: "1000000000000000000000",
  mether: "1000000000000000000000000",
  gether: "1000000000000000000000000000",
  tether: "1000000000000000000000000000000",
};

export function convertToAllUnits(value: string, unit: keyof Units): Units {
  const baseValue = new BigNumber(value);
  const baseUnitInWei = new BigNumber(unitPowers[unit]);
  const valueInWei = baseValue.multipliedBy(baseUnitInWei);

  const result: Units = {} as Units;
  Object.entries(unitPowers).forEach(([key, power]) => {
    const unitValue = new BigNumber(power);
    result[key as keyof Units] = valueInWei.dividedBy(unitValue).toString(10);
  });

  return result;
}
