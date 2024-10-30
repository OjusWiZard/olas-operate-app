import { CHAIN_IDS } from './chains';

export const MIN_ETH_BALANCE_THRESHOLDS = {
  [CHAIN_IDS.GNOSIS]: {
    safeCreation: 1.5,
    safeAddSigner: 0.1,
  },
};

export const LOW_AGENT_SAFE_BALANCE = 0.5;
export const LOW_MASTER_SAFE_BALANCE = 2;
