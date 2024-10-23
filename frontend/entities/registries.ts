import { ChainId } from '@/enums/ChainId';
import { Registry } from '@/models/Registry';

export const REGISTRIES: {
  [chainId: number | ChainId]: Registry;
} = {
  [ChainId.GNOSIS]: new Registry({
    chainId: ChainId.GNOSIS,
  }),
  [ChainId.OPTIMISM]: new Registry({
    chainId: ChainId.OPTIMISM,
  }),
};
