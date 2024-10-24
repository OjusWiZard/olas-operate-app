import { MechType } from '@/enums/MechType';
import { StakingProgramId } from '@/enums/StakingProgramId';
import { Address } from '@/types/Address';

import { ChainId } from './chains';

/**
 * Multicall contracts for batch calls
 */
export const MULTICALL_CONTRACT_ADDRESS: Address =
  '0xcA11bde05977b3631167028862bE2a173976CA11'; // https://github.com/mds1/multicall, https://www.multicall3.com/

/**
 * Contracts for registering services on L2 chains
 */
export const SERVICE_REGISTRY_L2_ADDRESSES: {
  [chainId: number | ChainId]: Address;
} = {
  [ChainId.GNOSIS]: '0x9338b5153AE39BB89f50468E608eD9d764B755fD',
};

/**
 * Contracts for registering services that bond with ERC20 tokens
 */
export const SERVICE_REGISTRY_TOKEN_UTILITY_ADDRESSES: {
  [chainId: number | ChainId]: Address;
} = {
  [ChainId.GNOSIS]: '0xa45E64d13A30a51b91ae0eb182e88a40e9b18eD8',
};

/**
 * Staking proxy addresses for each staking program
 * proxies to StakingToken contracts
 */
export const STAKING_PROXY_ADDRESSES: {
  [chainId: number | ChainId]: {
    [StakingProgramId: string | StakingProgramId]: Address;
  };
} = {
  [ChainId.GNOSIS]: {
    [StakingProgramId.Beta2]: '0x1c2F82413666d2a3fD8bC337b0268e62dDF67434',
    [StakingProgramId.Beta]: '0xeF44Fb0842DDeF59D37f85D61A1eF492bbA6135d',
    [StakingProgramId.Alpha]: '0xEE9F19b5DF06c7E8Bfc7B28745dcf944C504198A',
  },
  [ChainId.OPTIMISM]: {
    [StakingProgramId.Optimus]: '0x',
  },
};

/**
 * Contracts for Olas Mech implementations
 */
export const AGENT_MECH_ADDRESSES: {
  [chainId: number | ChainId]: {
    [mechType: string | MechType]: Address;
  };
} = {
  [ChainId.GNOSIS]: {
    [MechType.Agent]: '0x77af31De935740567Cf4fF1986D04B2c964A786a',
    [MechType.Marketplace]: '0x1c2F82413666d2a3fD8bC337b0268e62dDF67434',
  },
  [ChainId.OPTIMISM]: {
    [MechType.Agent]: '0x77af31De935740567Cf4fF1986D04B2c964A786a',
  },
};

/**
 * Contracts for Olas Mech activity checkers
 */
export const MECH_ACTIVITY_CHECKER_ADDRESSES: {
  [chainId: number | ChainId]: {
    [mechType: string | MechType]: Address;
  };
} = {
  [ChainId.GNOSIS]: {
    [MechType.Agent]: '0x155547857680A6D51bebC5603397488988DEb1c8',
    [MechType.Marketplace]: '0x1c2F82413666d2a3fD8bC337b0268e62dDF67434',
  },
  [ChainId.OPTIMISM]: {
    [MechType.Agent]: '0x155547857680A6D51bebC5603397488988DEb1c8',
  },
};
