type HttpRpc = `https://${string}`;

export type ChainConfig = {
  chainId: number;
  currency: string;
  rpc: HttpRpc;
};

export const CHAINS = {
  Ethereum: {
    currency: 'ETH',
    chainId: 1,
    rpc: `${process.env.ETHEREUM_RPC}` as HttpRpc,
  },
  Optimism: {
    currency: 'ETH',
    chainId: 10,
    rpc: `${process.env.OPTIMISM_RPC}` as HttpRpc,
  },
  Gnosis: {
    currency: 'XDAI',
    chainId: 100,
    rpc: `${process.env.GNOSIS_RPC}` as HttpRpc,
  },
  Base: {
    currency: 'ETH',
    chainId: 8453,
    rpc: `${process.env.BASE_RPC}` as HttpRpc,
  },
  // Mode: { currency: 'ETH', chainId: 34443 },
} as const;

export type SupportedChainName = keyof typeof CHAINS;
export type SupportedChainId = (typeof CHAINS)[SupportedChainName]['chainId'];

type ChainsByChainId = {
  [chainId in SupportedChainId]: ChainConfig & { name: SupportedChainName };
};
export const CHAINS_BY_CHAIN_IDS = Object.entries(CHAINS).reduce(
  (acc, [name, chain]) => {
    acc[chain.chainId] = {
      ...chain,
      name: name as SupportedChainName,
    };
    return acc;
  },
  {} as ChainsByChainId,
);

type ChainIds = {
  [chainName in SupportedChainName]: (typeof CHAINS)[chainName]['chainId'];
};
export const CHAIN_IDS: {
  [chainName in SupportedChainName]: SupportedChainId;
} = Object.entries(CHAINS).reduce(
  (acc, [name, chain]) => ({
    ...acc,
    [name]: chain.chainId,
  }),
  {} as ChainIds,
);
