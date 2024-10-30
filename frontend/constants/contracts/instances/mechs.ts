import { Contract as MulticallContract } from 'ethers-multicall';

import { MECH_CONTRACT_CONFIGS } from '../configs/mechs';

export const MECH_CONTRACTS: {
  [chainId: number]: {
    [mechType: string]: {
      mech: MulticallContract;
      activityChecker: MulticallContract;
    };
  };
} = Object.keys(MECH_CONTRACT_CONFIGS).reduce((acc, chainId) => {
  if (!chainId) return acc;
  if (!Number.isFinite(+chainId)) return acc;
  if (!Number.isInteger(+chainId)) return acc;

  return {
    ...acc,
    [+chainId]: Object.keys(MECH_CONTRACT_CONFIGS[+chainId]).reduce(
      (acc2, mechType) => {
        const {
          address,
          abi,
          activityChecker: { address: acAddress, abi: acAbi },
        } = MECH_CONTRACT_CONFIGS[+chainId][mechType];
        return {
          ...acc2,
          [mechType]: {
            mech: new MulticallContract(address, abi),
            activityChecker: new MulticallContract(acAddress, acAbi),
          },
        };
      },
      {},
    ),
  };
}, {});
