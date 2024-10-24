import { ethers } from 'ethers';
import { Provider as MulticallProvider } from 'ethers-multicall';

import { ChainId } from './chains';

export const gnosisProvider = new ethers.providers.StaticJsonRpcProvider(
  process.env.GNOSIS_RPC,
  ChainId.GNOSIS,
);

export const gnosisMulticallProvider = new MulticallProvider(
  gnosisProvider,
  ChainId.GNOSIS,
);

export const optimismProvider = new ethers.providers.StaticJsonRpcProvider(
  process.env.OPTIMISM_RPC,
);

export const optimismMulticallProvider = new MulticallProvider(
  optimismProvider,
  ChainId.OPTIMISM,
);

export const ethereumProvider = new ethers.providers.StaticJsonRpcProvider(
  process.env.ETHEREUM_RPC,
  ChainId.ETHEREUM,
);

export const ethereumMulticallProvider = new MulticallProvider(
  ethereumProvider,
  ChainId.ETHEREUM,
);

export const baseProvider = new ethers.providers.StaticJsonRpcProvider(
  process.env.BASE_RPC,
  ChainId.BASE,
);

export const baseMulticallProvider = new MulticallProvider(
  baseProvider,
  ChainId.BASE,
);
