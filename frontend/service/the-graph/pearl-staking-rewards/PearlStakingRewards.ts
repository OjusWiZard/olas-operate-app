import { gql, request } from 'graphql-request';
import { z } from 'zod';

import { SUBGRAPH_URL } from '@/constants/urls';
import { EpochDetailsResponseSchema } from '@/types/Epoch';

import { CheckpointGraphResponse as PearlStakingRewardsCheckpoints } from './types';

// queries for the Pearl staking rewards subgraph only

const getCheckpoints = async (
  subgraphUrl: string,
): Promise<{ checkpoints: PearlStakingRewardsCheckpoints[] }> =>
  request(
    subgraphUrl,
    gql`
      {
        checkpoints(orderBy: epoch, orderDirection: desc) {
          id
          availableRewards
          blockTimestamp
          contractAddress
          epoch
          epochLength
          rewards
          serviceIds
          transactionHash
        }
      }
    `,
  );

export const LatestCheckpointByContractAddressSchema = z.object({
  epoch: z.string(),
  epochLength: z.string(),
  blockTimestamp: z.string(),
});

export type LatestCheckpointByContractAddressResponse = z.infer<
  typeof LatestCheckpointByContractAddressSchema
>;

export const getLatestCheckpointByContractAddress = async (
  contractAddress: string,
) => {
  const response = await request<{
    checkpoints: LatestCheckpointByContractAddressResponse[];
  }>(
    SUBGRAPH_URL,
    gql`
      query {
        checkpoints(
          orderBy: epoch
          orderDirection: desc
          first: 1
          where: {
            contractAddress: "${contractAddress}"
          }
        ) {
          epoch
          epochLength
          blockTimestamp
        }
      }
    `,
  );

  return EpochDetailsResponseSchema.parse(response.checkpoints[0]);
};

export const PearlStakingRewards = {
  getCheckpoints,
  getLatestCheckpointByContractAddress,
};
