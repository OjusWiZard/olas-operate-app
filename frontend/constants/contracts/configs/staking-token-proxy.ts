import { CHAINS } from '@/constants/chains';
import { STAKING_PROGRAM_IDS } from '@/constants/stakingPrograms';

import { STAKING_TOKEN_ABI } from '../abis/serviceStakingTokenMechUsage';
import { AGENT_TYPES } from './agent';
import { MECH_TYPES } from './mechs';
import { ContractConfig } from './types';

export const STAKING_TOKEN_PROXY_CONTRACT_CONFIGS: {
  [chainId: number]: {
    [stakingProgramId: string]: ContractConfig & {
      mechType: keyof typeof MECH_TYPES;
      agentType: keyof typeof AGENT_TYPES;
    };
  };
} = {
  [CHAINS.GNOSIS.chainId]: {
    [STAKING_PROGRAM_IDS.PearlBetaMechMarketplace]: {
      address: '0xDaF34eC46298b53a3d24CBCb431E84eBd23927dA',
      abi: STAKING_TOKEN_ABI,
      mechType: MECH_TYPES.Marketplace,
      agentType: AGENT_TYPES.PREDICT,
    },
    [STAKING_PROGRAM_IDS.PearlBeta2]: {
      address: '0x1c2F82413666d2a3fD8bC337b0268e62dDF67434',
      abi: STAKING_TOKEN_ABI,
      mechType: MECH_TYPES.Agent,
      agentType: AGENT_TYPES.PREDICT,
    },
    [STAKING_PROGRAM_IDS.PearlBeta]: {
      address: '0xeF44Fb0842DDeF59D37f85D61A1eF492bbA6135d',
      abi: STAKING_TOKEN_ABI,
      mechType: MECH_TYPES.Agent,
      agentType: AGENT_TYPES.PREDICT,
    },
    [STAKING_PROGRAM_IDS.PearlAlpha]: {
      address: '0xEE9F19b5DF06c7E8Bfc7B28745dcf944C504198A',
      abi: STAKING_TOKEN_ABI,
      mechType: MECH_TYPES.Marketplace,
      agentType: AGENT_TYPES.PREDICT,
    },
  },
  [CHAINS.OPTIMISM.chainId]: {},
};
