import { MechType } from '@/enums/MechType';
import { MechStandard } from '@/models/Mech';

import { ChainId } from '../constants/chains';
import {
  AGENT_MECH_ADDRESSES,
  MECH_ACTIVITY_CHECKER_ADDRESSES,
} from '../constants/contractAddresses';

export const MECHS: {
  [chainId: number | ChainId]: {
    [mechType: string]: MechStandard;
  };
} = {
  [ChainId.GNOSIS]: {
    [MechType.Agent]: new MechStandard({
      chainId: ChainId.GNOSIS,
      address: AGENT_MECH_ADDRESSES[ChainId.GNOSIS][MechType.Agent],
      activityChecker:
        MECH_ACTIVITY_CHECKER_ADDRESSES[ChainId.GNOSIS][MechType.Agent],
    }),
    // [MechType.MARKETPLACE]: new MechStandard({});
  },
  [ChainId.OPTIMISM]: {
    [MechType.Agent]: new MechStandard({
      chainId: ChainId.OPTIMISM,
      address: AGENT_MECH_ADDRESSES[ChainId.OPTIMISM][MechType.Agent],
      activityChecker:
        MECH_ACTIVITY_CHECKER_ADDRESSES[ChainId.OPTIMISM][MechType.Agent],
    }),
  },
};
