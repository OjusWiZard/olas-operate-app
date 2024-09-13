import { CHAINS } from '@/constants/chains';

import { useServices } from './useServices';

export const useAddress = () => {
  const { service } = useServices();

  /** agent safe multisig address */
  const multisigAddress =
    service?.chain_configs?.[CHAINS.GNOSIS.chainId]?.chain_data?.multisig;

  /** agent instance EOA address */
  const instanceAddress =
    service?.chain_configs?.[CHAINS.GNOSIS.chainId]?.chain_data?.instances?.[0];

  return { instanceAddress, multisigAddress };
};
