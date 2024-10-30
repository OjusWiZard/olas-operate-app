import { BigNumber, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import { MECH_CONTRACTS } from '@/constants/contracts/instances/mechs';
import { SERVICE_REGISTRY_L2_CONTRACTS } from '@/constants/contracts/instances/service-registry-l2';
import { SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACTS } from '@/constants/contracts/instances/service-registry-token-utility';
import { STAKING_TOKEN_PROXY_CONTRACTS } from '@/constants/contracts/instances/staking-token-proxy';
import { MULTICALL_PROVIDERS } from '@/constants/providers';
import {
  STAKING_PROGRAM_IDS,
  StakingProgramId,
} from '@/constants/stakingPrograms';
import { ServiceRegistryL2ServiceState } from '@/enums/ServiceRegistryL2ServiceState';
import { Address } from '@/types/Address';
import { StakingContractInfo, StakingRewardsInfo } from '@/types/Autonolas';

const ONE_YEAR = 1 * 24 * 60 * 60 * 365;
const REQUIRED_MECH_REQUESTS_SAFETY_MARGIN = 1;

const getAgentStakingRewardsInfo = async ({
  agentMultisigAddress,
  serviceId,
  stakingProgramId,
  chainId,
}: {
  agentMultisigAddress: Address;
  serviceId: number;
  stakingProgramId: keyof typeof STAKING_PROGRAM_IDS;
  chainId: number;
}): Promise<StakingRewardsInfo | undefined> => {
  if (!agentMultisigAddress) return;
  if (!serviceId) return;

  const stakingTokenProxy =
    STAKING_TOKEN_PROXY_CONTRACTS[chainId][stakingProgramId];

  if (!stakingTokenProxy) return;

  const { mech, activityChecker } =
    MECH_CONTRACTS[chainId][stakingTokenProxy.mechType];

  const contractCalls = [
    mech.getRequestsCount(agentMultisigAddress),
    stakingTokenProxy[stakingProgramId].getServiceInfo(serviceId),
    stakingTokenProxy[stakingProgramId].livenessPeriod(),
    activityChecker.livenessRatio(),
    stakingTokenProxy[stakingProgramId].rewardsPerSecond(),
    stakingTokenProxy[stakingProgramId].calculateStakingReward(serviceId),
    stakingTokenProxy[stakingProgramId].minStakingDeposit(),
    stakingTokenProxy[stakingProgramId].tsCheckpoint(),
  ];

  const provider = MULTICALL_PROVIDERS[chainId];

  const multicallResponse = await provider.all(contractCalls);

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

const getAvailableRewardsForEpoch = async (
  stakingProgramId: keyof typeof STAKING_PROGRAM_IDS,
  chainId: number,
): Promise<number | undefined> => {
  const stakingProxy = STAKING_TOKEN_PROXY_CONTRACTS[chainId][stakingProgramId];

  if (!stakingProxy) return;

  const contractCalls = [
    stakingProxy[stakingProgramId].rewardsPerSecond(),
    stakingProxy[stakingProgramId].livenessPeriod(), // epoch length
    stakingProxy[stakingProgramId].tsCheckpoint(), // last checkpoint timestamp
  ];

  const provider = MULTICALL_PROVIDERS[chainId];
  if (!provider) return;

  await provider.init();

  const multicallResponse = await provider.all(contractCalls);
  const [rewardsPerSecond, livenessPeriod, tsCheckpoint] = multicallResponse;
  const nowInSeconds = Math.floor(Date.now() / 1000);

  return Math.max(
    rewardsPerSecond * livenessPeriod, // expected rewards
    rewardsPerSecond * (nowInSeconds - tsCheckpoint), // incase of late checkpoint
  );
};

const getStakingContractInfoByServiceIdStakingProgram = async (
  serviceId: number,
  stakingProgramId: keyof typeof STAKING_PROGRAM_IDS,
  chainId: number,
): Promise<Partial<StakingContractInfo> | undefined> => {
  if (!serviceId) return;

  const stakingTokenProxy =
    STAKING_TOKEN_PROXY_CONTRACTS[chainId][stakingProgramId];

  const contractCalls = [
    stakingTokenProxy[stakingProgramId].availableRewards(),
    stakingTokenProxy[stakingProgramId].maxNumServices(),
    stakingTokenProxy[stakingProgramId].getServiceIds(),
    stakingTokenProxy[stakingProgramId].minStakingDuration(),
    stakingTokenProxy[stakingProgramId].getServiceInfo(serviceId),
    stakingTokenProxy[stakingProgramId].getStakingState(serviceId),
    stakingTokenProxy[stakingProgramId].minStakingDeposit(),
  ];

  const provider = MULTICALL_PROVIDERS[chainId];
  if (!provider) return;

  await provider.init();

  const multicallResponse = await provider.all(contractCalls);
  const [
    availableRewardsInBN,
    maxNumServicesInBN,
    getServiceIdsInBN,
    minStakingDurationInBN,
    serviceInfo,
    serviceStakingState,
    minStakingDeposit,
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
    minStakingDeposit: parseFloat(ethers.utils.formatEther(minStakingDeposit)),
  };
};

/**
 * Get staking contract info by staking program name
 * eg. Alpha, Beta, Beta2
 * @param stakingProgramId string
 * @param chainId number
 */
const getStakingContractInfoByStakingProgram = async (
  stakingProgramId: string,
  chainId: number,
): Promise<Partial<StakingContractInfo> | undefined> => {
  const stakingTokenProxy =
    STAKING_TOKEN_PROXY_CONTRACTS[+chainId][stakingProgramId];

  const contractCalls = [
    stakingTokenProxy[stakingProgramId].availableRewards(),
    stakingTokenProxy[stakingProgramId].maxNumServices(),
    stakingTokenProxy[stakingProgramId].getServiceIds(),
    stakingTokenProxy[stakingProgramId].minStakingDuration(),
    stakingTokenProxy[stakingProgramId].minStakingDeposit(),
    stakingTokenProxy[stakingProgramId].rewardsPerSecond(),
    stakingTokenProxy[stakingProgramId].numAgentInstances(),
    stakingTokenProxy[stakingProgramId].livenessPeriod(),
  ];

  const provider = MULTICALL_PROVIDERS[chainId];
  if (!provider) return;

  const multicallResponse = await provider.all(contractCalls);
  const [
    availableRewardsInBN,
    maxNumServicesInBN,
    getServiceIdsInBN,
    minStakingDurationInBN,
    minStakingDeposit,
    rewardsPerSecond,
    numAgentInstances,
    livenessPeriod,
  ] = multicallResponse;

  const availableRewards = parseFloat(
    ethers.utils.formatUnits(availableRewardsInBN, 18),
  );
  const serviceIds = getServiceIdsInBN.map((id: BigNumber) => id.toNumber());
  const maxNumServices = maxNumServicesInBN.toNumber();

  // APY
  const rewardsPerYear = rewardsPerSecond.mul(ONE_YEAR);
  const apy =
    Number(rewardsPerYear.mul(100).div(minStakingDeposit)) /
    (1 + numAgentInstances.toNumber());

  // Amount of OLAS required for Stake
  const stakeRequiredInWei = minStakingDeposit.add(
    minStakingDeposit.mul(numAgentInstances),
  );
  const olasStakeRequired = Number(formatEther(stakeRequiredInWei));

  // Rewards per work period
  const rewardsPerWorkPeriod =
    Number(formatEther(rewardsPerSecond as BigNumber)) *
    livenessPeriod.toNumber();

  return {
    availableRewards,
    maxNumServices,
    serviceIds,
    minimumStakingDuration: minStakingDurationInBN.toNumber(),
    minStakingDeposit: parseFloat(ethers.utils.formatEther(minStakingDeposit)),
    apy,
    olasStakeRequired,
    rewardsPerWorkPeriod,
  };
};

const getServiceRegistryInfo = async (
  operatorAddress: Address, // generally master safe address
  serviceId: number,
  chainId: number,
): Promise<
  | {
      bondValue: number;
      depositValue: number;
      serviceState: ServiceRegistryL2ServiceState;
    }
  | undefined
> => {
  const serviceRegistryL2 = SERVICE_REGISTRY_L2_CONTRACTS[chainId];
  const serviceRegistryTokenUtility =
    SERVICE_REGISTRY_TOKEN_UTILITY_CONTRACTS[chainId];

  const contractCalls = [
    serviceRegistryTokenUtility.getOperatorBalance(operatorAddress, serviceId),
    serviceRegistryTokenUtility.mapServiceIdTokenDeposit(serviceId),
    serviceRegistryL2.mapServices(serviceId),
  ];

  const provider = MULTICALL_PROVIDERS[chainId];
  if (!provider) return;

  const [
    operatorBalanceResponse,
    serviceIdTokenDepositResponse,
    mapServicesResponse,
  ] = await provider.all(contractCalls);

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

/**
 * @param serviceId
 * @returns StakingProgram | null (null when not staked) | undefined (error)
 */
const getCurrentStakingProgramByServiceId = async (
  serviceId: number,
  chainId: number,
): Promise<StakingProgramId | null | undefined> => {
  if (serviceId <= -1) return null;

  const stakingTokenProxy = STAKING_TOKEN_PROXY_CONTRACTS[chainId];

  const contractCalls = Object.values(stakingTokenProxy).map((proxy) =>
    proxy.getStakingState(serviceId),
  );

  const provider = MULTICALL_PROVIDERS[chainId];
  if (!provider) return;

  try {
    await provider.init();

    const responses: boolean[] = await provider.all(
      Object.values(contractCalls),
    );

    const stakedIndex = responses.findIndex((staked) => staked);

    if (stakedIndex !== -1) {
      return Object.keys(STAKING_PROGRAM_IDS)[stakedIndex] as StakingProgramId;
    }

    return null;
  } catch (error) {
    console.error('Error while getting current staking program', error);
  }
};

export const AutonolasService = {
  getAgentStakingRewardsInfo,
  getAvailableRewardsForEpoch,
  getCurrentStakingProgramByServiceId,
  getServiceRegistryInfo,
  getStakingContractInfoByServiceIdStakingProgram,
  getStakingContractInfoByStakingProgram,
};
