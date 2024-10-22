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
    [MechType.STANDARD]: new MechStandard({
      chainId: ChainId.GNOSIS,
      address: AGENT_MECH_ADDRESSES[ChainId.GNOSIS][MechType.STANDARD],
      activityChecker:
        MECH_ACTIVITY_CHECKER_ADDRESSES[ChainId.GNOSIS][MechType.STANDARD],
    }),
    // [MechType.MARKETPLACE]: new MechStandard({});
  },
  [ChainId.OPTIMISM]: {
    [MechType.STANDARD]: new MechStandard({
      chainId: ChainId.OPTIMISM,
      address: AGENT_MECH_ADDRESSES[ChainId.OPTIMISM][MechType.STANDARD],
      activityChecker:
        MECH_ACTIVITY_CHECKER_ADDRESSES[ChainId.OPTIMISM][MechType.STANDARD],
    }),
  },
};
