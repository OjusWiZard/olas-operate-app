import { BigNumber, ethers } from 'ethers';
import { Contract as MulticallContract } from 'ethers-multicall';

import { AGENT_MECH_ABI } from '@/abis/agentMech';
import { MECH_ACTIVITY_CHECKER_ABI } from '@/abis/mechActivityChecker';
import { SERVICE_REGISTRY_L2_ABI } from '@/abis/serviceRegistryL2';
import { SERVICE_REGISTRY_TOKEN_UTILITY_ABI } from '@/abis/serviceRegistryTokenUtility';
import { SERVICE_STAKING_TOKEN_MECH_USAGE_ABI } from '@/abis/serviceStakingTokenMechUsage';
import { Chain } from '@/client';
import {
  AGENT_MECH_CONTRACT_ADDRESS,
  MECH_ACTIVITY_CHECKER_CONTRACT_ADDRESS,
  SERVICE_REGISTRY_L2_CONTRACT_ADDRESS,
  SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT_ADDRESS,
  SERVICE_STAKING_TOKEN_MECH_USAGE_CONTRACT_ADDRESS,
} from '@/constants/contractAddresses';
import { multicallProvider } from '@/constants/providers';
import { ServiceRegistryL2ServiceState } from '@/enums/ServiceRegistryL2ServiceState';
import { Address } from '@/types/Address';
import { StakingContractInfo, StakingRewardsInfo } from '@/types/Autonolas';

const REQUIRED_MECH_REQUESTS_SAFETY_MARGIN = 1;

const agentMechContract = new MulticallContract(
  AGENT_MECH_CONTRACT_ADDRESS[Chain.GNOSIS],
  AGENT_MECH_ABI.filter((abi) => abi.type === 'function'), // weird bug in the package where their filter doesn't work..
);

const serviceStakingTokenMechUsageContract = new MulticallContract(
  SERVICE_STAKING_TOKEN_MECH_USAGE_CONTRACT_ADDRESS[Chain.GNOSIS],
  SERVICE_STAKING_TOKEN_MECH_USAGE_ABI.filter((abi) => abi.type === 'function'), // same as above
);

const serviceRegistryTokenUtilityContract = new MulticallContract(
  SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACT_ADDRESS[Chain.GNOSIS],
  SERVICE_REGISTRY_TOKEN_UTILITY_ABI.filter((abi) => abi.type === 'function'), // same as above
);

const serviceRegistryL2Contract = new MulticallContract(
  SERVICE_REGISTRY_L2_CONTRACT_ADDRESS[Chain.GNOSIS],
  SERVICE_REGISTRY_L2_ABI.filter((abi) => abi.type === 'function'), // same as above
);

const mechActivityCheckerContract = new MulticallContract(
  MECH_ACTIVITY_CHECKER_CONTRACT_ADDRESS[Chain.GNOSIS],
  MECH_ACTIVITY_CHECKER_ABI.filter((abi) => abi.type === 'function'), // same as above
);

const getAgentStakingRewardsInfo = async ({
  agentMultisigAddress,
  serviceId,
}: {
  agentMultisigAddress: Address;
  serviceId: number;
}): Promise<StakingRewardsInfo | undefined> => {
  if (!agentMultisigAddress) return;
  if (!serviceId) return;

  const contractCalls = [
    agentMechContract.getRequestsCount(agentMultisigAddress),
    serviceStakingTokenMechUsageContract.getServiceInfo(serviceId),
    serviceStakingTokenMechUsageContract.livenessPeriod(),
    mechActivityCheckerContract.livenessRatio(),
    serviceStakingTokenMechUsageContract.rewardsPerSecond(),
    serviceStakingTokenMechUsageContract.calculateStakingReward(serviceId),
    serviceStakingTokenMechUsageContract.minStakingDeposit(),
    serviceStakingTokenMechUsageContract.tsCheckpoint(),
  ];

  await multicallProvider.init();

  const multicallResponse = await multicallProvider.all(contractCalls);

  const [
    mechRequestCount,
    serviceInfo,
    livenessPeriod,
    livenessRatio,
    rewardsPerSecond,
    accruedStakingReward,
    minStakingDeposit,
    tsCheckpoint,
  ] = multicallResponse;

  /**
   * struct ServiceInfo {
    // Service multisig address
    address multisig;
    // Service owner
    address owner;
    // Service multisig nonces
    uint256[] nonces; <-- (we use this in the rewards eligibility check)
    // Staking start time
    uint256 tsStart;
    // Accumulated service staking reward
    uint256 reward;
    // Accumulated inactivity that might lead to the service eviction
    uint256 inactivity;}
   */

  const nowInSeconds = Math.floor(Date.now() / 1000);

  const requiredMechRequests =
    (Math.ceil(Math.max(livenessPeriod, nowInSeconds - tsCheckpoint)) *
      livenessRatio) /
      1e18 +
    REQUIRED_MECH_REQUESTS_SAFETY_MARGIN;

  const mechRequestCountOnLastCheckpoint = serviceInfo[2][1];
  const eligibleRequests = mechRequestCount - mechRequestCountOnLastCheckpoint;

  const isEligibleForRewards = eligibleRequests >= requiredMechRequests;

  const availableRewardsForEpoch = Math.max(
    rewardsPerSecond * livenessPeriod, // expected rewards for the epoch
    rewardsPerSecond * (nowInSeconds - tsCheckpoint), // incase of late checkpoint
  );

  // Minimum staked amount is double the minimum staking deposit
  // (all the bonds must be the same as deposit)
  const minimumStakedAmount =
    parseFloat(ethers.utils.formatEther(`${minStakingDeposit}`)) * 2;

  return {
    mechRequestCount,
    serviceInfo,
    livenessPeriod,
    livenessRatio,
    rewardsPerSecond,
    isEligibleForRewards,
    availableRewardsForEpoch,
    accruedServiceStakingRewards: parseFloat(
      ethers.utils.formatEther(`${accruedStakingReward}`),
    ),
    minimumStakedAmount,
  } as StakingRewardsInfo;
};

const getAvailableRewardsForEpoch = async (): Promise<number | undefined> => {
  const contractCalls = [
    serviceStakingTokenMechUsageContract.rewardsPerSecond(),
    serviceStakingTokenMechUsageContract.livenessPeriod(), // epoch length
    serviceStakingTokenMechUsageContract.tsCheckpoint(), // last checkpoint timestamp
  ];

  await multicallProvider.init();

  const multicallResponse = await multicallProvider.all(contractCalls);

  const [rewardsPerSecond, livenessPeriod, tsCheckpoint] = multicallResponse;

  const nowInSeconds = Math.floor(Date.now() / 1000);

  return Math.max(
    rewardsPerSecond * livenessPeriod, // expected rewards
    rewardsPerSecond * (nowInSeconds - tsCheckpoint), // incase of late checkpoint
  );
};

/**
 * function to get the staking contract info
 */
const getStakingContractInfo = async (
  serviceId: number,
): Promise<StakingContractInfo | undefined> => {
  if (!serviceId) return;

  const contractCalls = [
    serviceStakingTokenMechUsageContract.availableRewards(),
    serviceStakingTokenMechUsageContract.maxNumServices(),
    serviceStakingTokenMechUsageContract.getServiceIds(),
    serviceStakingTokenMechUsageContract.minStakingDuration(),
    serviceStakingTokenMechUsageContract.getServiceInfo(serviceId),
    serviceStakingTokenMechUsageContract.getStakingState(serviceId),
  ];

  await multicallProvider.init();

  const multicallResponse = await gnosisMulticallProvider.all(contractCalls);
  const [
    availableRewardsInBN,
    maxNumServicesInBN,
    getServiceIdsInBN,
    minStakingDurationInBN,
    serviceInfo,
    serviceStakingState,
  ] = multicallResponse;

  const availableRewards = parseFloat(
    ethers.utils.formatUnits(availableRewardsInBN, 18),
  );
  const serviceIds = getServiceIdsInBN.map((id: BigNumber) => id.toNumber());
  const maxNumServices = maxNumServicesInBN.toNumber();

  return {
    availableRewards,
    maxNumServices,
    serviceIds,
    minimumStakingDuration: minStakingDurationInBN.toNumber(),
    serviceStakingStartTime: serviceInfo.tsStart.toNumber(),
    serviceStakingState,
  };
};

const getServiceRegistryInfo = async (
  operatorAddress: Address, // generally masterSafeAddress
  serviceId: number,
): Promise<{
  bondValue: number;
  depositValue: number;
  serviceState: ServiceRegistryL2ServiceState;
}> => {
  const contractCalls = [
    serviceRegistryTokenUtilityContract.getOperatorBalance(
      operatorAddress,
      serviceId,
    ),
    serviceRegistryTokenUtilityContract.mapServiceIdTokenDeposit(serviceId),
    serviceRegistryL2Contract.mapServices(serviceId),
  ];

  await multicallProvider.init();

  const [
    operatorBalanceResponse,
    serviceIdTokenDepositResponse,
    mapServicesResponse,
  ] = await multicallProvider.all(contractCalls);

  const [bondValue, depositValue, serviceState] = [
    parseFloat(ethers.utils.formatUnits(operatorBalanceResponse, 18)),
    parseFloat(ethers.utils.formatUnits(serviceIdTokenDepositResponse[1], 18)),
    mapServicesResponse.state as ServiceRegistryL2ServiceState,
  ];

  return {
    bondValue,
    depositValue,
    serviceState,
  };
};

export const AutonolasService = {
  getAgentStakingRewardsInfo,
  getAvailableRewardsForEpoch,
  getServiceRegistryInfo,
  getStakingContractInfo,
};
