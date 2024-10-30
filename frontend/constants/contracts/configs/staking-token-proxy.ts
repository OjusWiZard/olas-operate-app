import { CHAINS } from '@/constants/chains';
import { STAKING_PROGRAM_IDS } from '@/constants/stakingPrograms';

import { STAKING_TOKEN_ABI } from '../abis/serviceStakingTokenMechUsage';
import { AGENT_SLUGS } from './agent';
import { MECH_SLUGS } from './mechs';

// type StakingTokenProxyContractConfig = {
//   address: string;
//   abi: JsonFragment[];
//   mechSlug: MechSlug;
//   agentSlug: AgentSlug;
// };

// type ChainStakingTokenProxyContractConfigs = {
//   [stakingProgramId: StakingProgramId]: StakingTokenProxyContractConfig;
// };

// type StakingTokenProxyContractConfigs = {
//   [chainId in Partial<SupportedChainId>]: ChainStakingTokenProxyContractConfigs;
// };

export const STAKING_TOKEN_PROXY_CONTRACT_CONFIGS = {
  [CHAINS.Gnosis.chainId]: {
    [STAKING_PROGRAM_IDS.PearlBetaMechMarketplace]: {
      address: '0xDaF34eC46298b53a3d24CBCb431E84eBd23927dA',
      abi: STAKING_TOKEN_ABI,
      mechSlug: MECH_SLUGS.Marketplace,
      agentSlug: AGENT_SLUGS.Predict,
    },
    [STAKING_PROGRAM_IDS.PearlBeta2]: {
      address: '0x1c2F82413666d2a3fD8bC337b0268e62dDF67434',
      abi: STAKING_TOKEN_ABI,
      mechSlug: MECH_SLUGS.Agent,
      agentSlug: AGENT_SLUGS.Predict,
    },
    [STAKING_PROGRAM_IDS.PearlBeta]: {
      address: '0xeF44Fb0842DDeF59D37f85D61A1eF492bbA6135d',
      abi: STAKING_TOKEN_ABI,
      mechSlug: MECH_SLUGS.Agent,
      agentSlug: AGENT_SLUGS.Predict,
    },
    [STAKING_PROGRAM_IDS.PearlAlpha]: {
      address: '0xEE9F19b5DF06c7E8Bfc7B28745dcf944C504198A',
      abi: STAKING_TOKEN_ABI,
      mechSlug: MECH_SLUGS.Marketplace,
      agentSlug: AGENT_SLUGS.Predict,
    },
  },
};
