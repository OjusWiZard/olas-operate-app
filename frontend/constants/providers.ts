import { ethers } from 'ethers';
import { Provider as MulticallProvider } from 'ethers-multicall';

import { CHAINS_BY_CHAIN_IDS } from './chains';

export const PROVIDERS = Object.entries(CHAINS_BY_CHAIN_IDS).reduce(
  (acc, [chainId, { name, rpc }]) => {
    if (!chainId || !rpc || !name) return acc;

    return {
      ...acc,
      [chainId]: new ethers.providers.StaticJsonRpcProvider(rpc, {
        name,
        chainId: +chainId,
      }),
    };
  },
  {} as {
    [chainId: number]: ethers.providers.StaticJsonRpcProvider;
  },
);

export const MULTICALL_PROVIDERS = Object.entries(CHAINS_BY_CHAIN_IDS).reduce(
  (acc, [chainId, { rpc, name }]) => {
    if (!chainId || !rpc || !name) return acc;

    return {
      ...acc,
      [chainId]: new MulticallProvider(PROVIDERS[+chainId], +chainId),
    };
  },
  {} as {
    [chainId: number]: MulticallProvider;
  },
);
