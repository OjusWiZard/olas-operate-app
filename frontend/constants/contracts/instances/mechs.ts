import { Contract as MulticallContract } from 'ethers-multicall';

import { SupportedChainId } from '@/constants/chains';

import { MECH_CONTRACT_CONFIGS, MechSlug } from '../configs/mechs';

type MechAndActivityContract = {
  mech: MulticallContract;
  activityChecker: MulticallContract;
};

export const MECH_CONTRACTS: {
  [chainId: SupportedChainId]: {
    [mechSlug: MechSlug]: MechAndActivityContract;
  };
} = Object.keys(MECH_CONTRACT_CONFIGS).reduce((acc, chainId) => {
  if (!chainId) return acc;
  if (!Number.isFinite(+chainId)) return acc;
  if (!Number.isInteger(+chainId)) return acc;

  return {
    ...acc,
    [+chainId]: Object.keys(MECH_CONTRACT_CONFIGS[+chainId]).reduce(
      (acc2, mechSlug) => {
        const {
          address,
          abi,
          activityChecker: { address: acAddress, abi: acAbi },
        } = MECH_CONTRACT_CONFIGS[+chainId][mechSlug];
        return {
          ...acc2,
          [mechSlug]: {
            mech: new MulticallContract(address, abi),
            activityChecker: new MulticallContract(acAddress, acAbi),
          },
        };
      },
      {},
    ),
  };
}, {});
