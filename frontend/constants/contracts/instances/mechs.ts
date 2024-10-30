import { Contract as MulticallContract } from 'ethers-multicall';

import { MECH_CONTRACT_CONFIGS } from '../configs/mechs';

export const MECH_CONTRACTS = Object.entries(MECH_CONTRACT_CONFIGS).reduce(
  (acc, [chainId, mechConfigs]) => {
    if (!chainId) return acc;
    if (!Number.isFinite(+chainId)) return acc;
    if (!Number.isInteger(+chainId)) return acc;

    return {
      ...acc,
      [+chainId]: Object.entries(mechConfigs).reduce(
        (acc2, [mechSlug, mechConfig]) => {
          const {
            address,
            abi,
            activityChecker: { address: acAddress, abi: acAbi },
          } = mechConfig;
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
  },
  {} as {
    [chainId: number]: {
      [mechSlug: string]: {
        mech: MulticallContract;
        activityChecker: MulticallContract;
      };
    };
  },
);
