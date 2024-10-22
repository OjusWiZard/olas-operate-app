export const CHAINS: {
  [chain: string]: {
    currency: string;
    chainId: number;
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
