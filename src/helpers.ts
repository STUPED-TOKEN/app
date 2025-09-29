import type { RoundData } from './types/roundData';

import round1Data from './data/round1.json';
import round2Data from './data/round2.json';

export function getRoundData(roundNumber: number): RoundData | null {
  switch (roundNumber) {
    case 1:
      return round1Data as RoundData;
    case 2:
      return round2Data as RoundData;
    default:
      console.warn(`Round ${roundNumber} not found`);
      return null;
  }
}

export function getAddressIndex(address: string, roundNumber: number): number {
  const roundData = getRoundData(roundNumber);
  if (!roundData) return -1;
  return roundData.addresses.indexOf(address);
}

export const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));
