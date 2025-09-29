export interface RoundData {
  addresses: string[];
  round: number;
  description: string;
}

export interface WhitelistData {
  round1: RoundData;
  round2: RoundData;
}
