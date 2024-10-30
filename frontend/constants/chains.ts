type HttpRpc = `https://${string}`;

type ChainConfig = {
  chainId: number;
  currency: string;
  rpc: HttpRpc;
};

export const CHAINS: {
  [name: string]: ChainConfig;
} = {
  ETHEREUM: {
    currency: 'ETH',
    chainId: 1,
    rpc: `${process.env.ETHEREUM_RPC}` as HttpRpc,
  },
  OPTIMISM: {
    currency: 'ETH',
    chainId: 10,
    rpc: `${process.env.OPTIMISM_RPC}` as HttpRpc,
  },
  GNOSIS: {
    currency: 'XDAI',
    chainId: 100,
    rpc: `${process.env.GNOSIS_RPC}` as HttpRpc,
  },
  BASE: {
    currency: 'ETH',
    chainId: 8453,
    rpc: `${process.env.BASE_RPC}` as HttpRpc,
  },
  // MODE: { currency: 'ETH', chainId: 34443 },
};

export const CHAINS_BY_CHAIN_ID: {
  [chainId: number]: ChainConfig & { name: string };
} = Object.entries(CHAINS).reduce(
  (acc, [name, chain]) => ({
    ...acc,
    [chain.chainId]: {
      ...chain,
      name,
    },
  }),
  {},
);

export type SupportedChainId = keyof typeof CHAINS_BY_CHAIN_ID;
export type SupportedChainName = keyof typeof CHAINS;
