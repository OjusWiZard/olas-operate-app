import { ServiceHash } from '@/client';
import { ChainId } from '@/constants/chains';

export type Service = {
  chainId: ChainId;
  serviceHash: ServiceHash;
};
