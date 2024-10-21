import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { groupBy } from 'lodash';
import { useEffect, useMemo } from 'react';

import { Chain } from '@/client';
import { STAKING_TOKEN_PROXY_ADDRESS } from '@/constants/contractAddresses';
import { STAKING_PROGRAM_META } from '@/constants/stakingProgramMeta';
import { SUBGRAPH_URL } from '@/constants/urls';
import { ReactQueryKey } from '@/enums/ReactQueryKey';
import { StakingProgramId } from '@/enums/StakingProgram';
import TheGraphService from '@/service/the-graph';
import { CheckpointGraphResponse } from '@/service/the-graph/pearl-staking-rewards/types';

import { useServices } from './useServices';

const ONE_DAY_IN_S = 24 * 60 * 60;
const ONE_DAY_IN_MS = ONE_DAY_IN_S * 1000;

const betaAddress =
  STAKING_TOKEN_PROXY_ADDRESS[Chain.GNOSIS].pearl_beta;
const beta2Address =
  STAKING_TOKEN_PROXY_ADDRESS[Chain.GNOSIS]
    .pearl_beta_2;

type TransformedCheckpoint = {
  epoch: string;
  rewards: string[];
  serviceIds: string[];
  blockTimestamp: string;
  transactionHash: string;
  epochLength: string;
  contractAddress: string;
  epochEndTimeStamp: number;
  epochStartTimeStamp: number;
  reward: number;
  earned: boolean;
};

const transformCheckpoints = (
  checkpoints: CheckpointGraphResponse[],
  serviceId?: number,
  timestampToIgnore?: null | number,
): TransformedCheckpoint[] => {
  if (!checkpoints || checkpoints.length === 0) return [];
  if (!serviceId) return [];

  const transformed = checkpoints
    .map((checkpoint: CheckpointGraphResponse, index: number) => {
      const serviceIdIndex =
        checkpoint.serviceIds?.findIndex((id) => Number(id) === serviceId) ??
        -1;

      let reward = '0';

      if (serviceIdIndex !== -1) {
        const isRewardFinite = isFinite(
          Number(checkpoint.rewards?.[serviceIdIndex]),
        );
        reward = isRewardFinite
          ? checkpoint.rewards?.[serviceIdIndex] ?? '0'
          : '0';
      }

      // If the epoch is 0, it means it's the first epoch else,
      // the start time of the epoch is the end time of the previous epoch
      const epochStartTimeStamp =
        checkpoint.epoch === '0'
          ? Number(checkpoint.blockTimestamp) - Number(checkpoint.epochLength)
          : checkpoints[index + 1]?.blockTimestamp ?? 0;

      return {
        ...checkpoint,
        epochEndTimeStamp: Number(checkpoint.blockTimestamp ?? Date.now()),
        epochStartTimeStamp: Number(epochStartTimeStamp),
        reward: Number(ethers.utils.formatUnits(reward, 18)),
        earned: serviceIdIndex !== -1,
      };
    })
    .filter((epoch) => {
      // If the contract has been switched to new contract, ignore the rewards from the old contract of the same epoch,
      // as the rewards are already accounted in the new contract.
      // example: If contract was switched on September 1st, 2024, ignore the rewards before that date
      // in the old contract.
      if (!timestampToIgnore) return true;

      if (!epoch) return false;
      if (!epoch.epochEndTimeStamp) return false;
      return epoch.epochEndTimeStamp < timestampToIgnore;
    });

  return transformed;
};

/**
 * Get the timestamp of the first reward received by the service in the contract.
 * NOTE: Assumes that the switch of the contract was completed AND the rewards are received in the same epoch.
 */
const getTimestampOfFirstReward = (
  checkpoints: CheckpointGraphResponse[],
  serviceId: number,
) => {
  const timestamp = checkpoints
    .toReversed()
    .find((epochDetails) =>
      epochDetails.serviceIds.includes(`${serviceId}`),
    )?.blockTimestamp;

  return timestamp ? Number(timestamp) : null;
};

export const useRewardsHistory = () => {
  const { serviceId } = useServices();

  const { data, isError, isLoading, isFetching, refetch } = useQuery({
    queryKey: [ReactQueryKey.Checkpoints],
    queryFn: async () =>
      TheGraphService.pearlStakingRewards.getCheckpoints(SUBGRAPH_URL),
    select: ({ checkpoints }) => {
      const checkpointsByContractAddress = groupBy(
        checkpoints,
        'contractAddress',
      );

      const beta2Checkpoints =
        checkpointsByContractAddress[beta2Address.toLowerCase()];

      /** Pearl beta 2 details */

      // timestamp when the contract was switched to beta2
      // ie, got the fist rewards from beta2 contract
      const beta2switchTimestamp = getTimestampOfFirstReward(
        beta2Checkpoints,
        serviceId as number,
      );

      const beta2ContractDetails = {
        id: beta2Address,
        name: STAKING_PROGRAM_META[StakingProgramId.Beta2].name,
        history: transformCheckpoints(beta2Checkpoints, serviceId, null),
      };

      /** Pearl beta details */
      const betaCheckpoints =
        checkpointsByContractAddress[betaAddress.toLowerCase()];

      const betaContractRewards = {
        id: betaAddress,
        name: STAKING_PROGRAM_META[StakingProgramId.Beta].name,
        history: transformCheckpoints(
          betaCheckpoints,
          serviceId,
          beta2switchTimestamp,
        ),
      };

      // If there are no rewards in both contracts, return empty array
      const rewards = [];
      if (beta2ContractDetails.history.some((epoch) => epoch?.earned)) {
        rewards.push(beta2ContractDetails);
      }
      if (betaContractRewards.history.some((epoch) => epoch?.earned)) {
        rewards.push(betaContractRewards);
      }

      /**
       * Temporarily disabling schema validation as it is failing for some reason.
       */

      // const parsedRewards = StakingRewardSchema.array().safeParse(rewards);

      // if (!parsedRewards.success) {
      //   console.error(parsedRewards.error.errors);
      //   throw new Error(parsedRewards.error.errors.join(', '));
      // }

      // return parsedRewards.data;

      return rewards;
    },
    refetchOnWindowFocus: false,
    refetchInterval: ONE_DAY_IN_MS,
    enabled: !!serviceId,
  });

  const latestRewardStreak = useMemo<number>(() => {
    if (!data) return 0;

    // merge histories into single array
    const allCheckpoints = data.reduce(
      (acc: TransformedCheckpoint[], { history }) => [...acc, ...history],
      [],
    );

    // remove all histories that are not earned
    const earnedHistories = allCheckpoints.filter((history) => history.earned);

    // sort descending by epoch end time
    const sorted = earnedHistories.sort(
      (a, b) => b.epochEndTimeStamp - a.epochEndTimeStamp,
    );

    let streak = 0;
    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];

      // first iteration
      if (i === 0) {
        const timeNow = Date.now() / 1000;

        // multiplied by 2 to give a buffer of 2 days
        const initialEpochGap = timeNow - current.epochEndTimeStamp;

        // if the last epoch was more than 1 day ago, break
        if (initialEpochGap > ONE_DAY_IN_S) break;

        // if the last epoch was less than 1 day ago, increment streak
        if (current.earned) {
          streak++;
          continue;
        }

        break;
      }

      // nth interations
      const previous = sorted[i - 1];
      const epochGap = previous.epochStartTimeStamp - current.epochEndTimeStamp;

      if (current.earned && epochGap <= ONE_DAY_IN_S) {
        streak++;
        continue;
      }
      break;
    }

    return streak;
  }, [data]);

  useEffect(() => {
    serviceId && refetch();
  }, [refetch, serviceId]);

  return {
    isError,
    isFetching,
    isLoading,
    latestRewardStreak,
    refetch,
    rewards: data,
  };
};
