import { CHAINS, SupportedChainId } from '@/constants/chains';

import { AGENT_MECH_ABI } from '../abis/agentMech';
import { MECH_ACTIVITY_CHECKER_ABI } from '../abis/mechActivityChecker';
import { MECH_MARKETPLACE_ABI } from '../abis/mechMarketplace';
import { REQUESTER_ACTIVITY_CHECKER_ABI } from '../abis/requesterActivityChecker';
import { ContractConfig } from './types';

export const MECH_SLUGS: {
  [mechName: string]: string;
} = {
  Agent: 'agent-mech',
  Marketplace: 'mech-marketplace',
} as const;

export type MechSlug = keyof typeof MECH_SLUGS;

type MechContractConfig = ContractConfig & {
  activityChecker: ContractConfig;
};
export const MECH_CONTRACT_CONFIGS: {
  [chainId: SupportedChainId]: {
    [mechType: MechSlug]: MechContractConfig;
  };
} = {
  [CHAINS.GNOSIS.chainId]: {
    [MECH_SLUGS.Agent]: {
      address: '0x77af31De935740567Cf4fF1986D04B2c964A786a',
      abi: AGENT_MECH_ABI,
      activityChecker: {
        address: '0x155547857680A6D51bebC5603397488988DEb1c8',
        abi: MECH_ACTIVITY_CHECKER_ABI,
      },
    },
    [MECH_SLUGS.Marketplace]: {
      address: '0x4554fE75c1f5576c1d7F765B2A036c199Adae329',
      abi: MECH_MARKETPLACE_ABI,
      activityChecker: {
        address: '0x7Ec96996Cd146B91779f01419db42E67463817a0',
        abi: REQUESTER_ACTIVITY_CHECKER_ABI,
      },
    },
  },
  //   [CHAINS.OPTIMISM.chainId]: {},
};
