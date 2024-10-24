export const CHAINS: {
  [chain: string]: {
    chainId: number;
    currency: string;
  };
} = {
  GNOSIS: { currency: 'XDAI', chainId: 100 },
};

export enum ChainId {
  ETHEREUM = 1,
  OPTIMISM = 10,
  GNOSIS = 100,
  BASE = 8453,
}
