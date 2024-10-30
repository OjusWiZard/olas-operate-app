import { MiddlewareChain } from '@/types/middleware';

export const MIN_ETH_BALANCE_THRESHOLDS = {
  [MiddlewareChain.GNOSIS]: {
    safeCreation: 1.5,
    safeAddSigner: 0.1,
  },
};

export const LOW_AGENT_SAFE_BALANCE = 0.5;
export const LOW_MASTER_SAFE_BALANCE = 2;
