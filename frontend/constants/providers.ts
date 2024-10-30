import { ethers } from 'ethers';
import { Provider as MulticallProvider } from 'ethers-multicall';

import { CHAINS } from './chains';

export const PROVIDERS: {
  [chainName: keyof typeof CHAINS]: ethers.providers.StaticJsonRpcProvider;
} = Object.entries(CHAINS).reduce((acc, [name, { chainId, rpc }]) => {
  if (!chainId || !rpc) return acc;

  return {
    ...acc,
    [name]: new ethers.providers.StaticJsonRpcProvider(rpc, {
      name,
      chainId,
    }),
  };
}, {});

export const MULTICALL_PROVIDERS: {
  [chainName: keyof typeof CHAINS]: MulticallProvider;
} = Object.entries(CHAINS).reduce((acc, [name, { chainId, rpc }]) => {
  if (!chainId || !rpc) return acc;

  return {
    ...acc,
    [chainId]: new MulticallProvider(PROVIDERS[name], chainId),
  };
}, {});
