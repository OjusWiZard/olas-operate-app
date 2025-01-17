import { InfoCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Popover, Typography } from 'antd';
import { gql, request } from 'graphql-request';
import { z } from 'zod';

import { GNOSIS_REWARDS_HISTORY_SUBGRAPH_URL } from '@/constants/urls';
import { POPOVER_WIDTH_MEDIUM } from '@/constants/width';
import { useStakingProgram } from '@/hooks/useStakingProgram';
import { formatToTime } from '@/utils/time';

const { Text } = Typography;

const EpochTimeResponseSchema = z.object({
  epochLength: z.string(),
  blockTimestamp: z.string(),
});
type EpochTimeResponse = z.infer<typeof EpochTimeResponseSchema>;

const useEpochEndTime = () => {
  const { activeStakingProgramAddress } = useStakingProgram();

  const latestEpochTimeQuery = gql`
    query {
      checkpoints(
        orderBy: epoch
        orderDirection: desc
        first: 1
        where: {
          contractAddress: "${activeStakingProgramAddress}"
        }
      ) {
        epochLength
        blockTimestamp
      }
    }
  `;

  const { data, isLoading } = useQuery({
    queryKey: ['latestEpochTime'],
    queryFn: async () => {
      const response = (await request(
        GNOSIS_REWARDS_HISTORY_SUBGRAPH_URL,
        latestEpochTimeQuery,
      )) as {
        checkpoints: EpochTimeResponse[];
      };
      return EpochTimeResponseSchema.parse(response.checkpoints[0]);
    },
    select: (data) => {
      // last epoch end time + epoch length
      return Number(data.blockTimestamp) + Number(data.epochLength);
    },
    enabled: !!activeStakingProgramAddress,
  });

  return { data, isLoading };
};

export const StakingRewardsThisEpoch = () => {
  const { data: epochEndTimeInMs } = useEpochEndTime();
  const {
    activeStakingProgramMeta,
    activeStakingProgramId,
    isActiveStakingProgramLoaded,
  } = useStakingProgram();

  const stakingProgramMeta = activeStakingProgramMeta;

  return (
    <Text type="secondary">
      Staking rewards this epoch&nbsp;
      <Popover
        arrow={false}
        content={
          isActiveStakingProgramLoaded && activeStakingProgramId ? (
            <div style={{ maxWidth: POPOVER_WIDTH_MEDIUM }}>
              The epoch for {stakingProgramMeta?.name} ends each day at ~{' '}
              <Text className="text-sm" strong>
                {epochEndTimeInMs
                  ? `${formatToTime(epochEndTimeInMs * 1000)} (UTC)`
                  : '--'}
              </Text>
            </div>
          ) : (
            <div style={{ maxWidth: POPOVER_WIDTH_MEDIUM }}>
              You&apos;re not yet in a staking program!
            </div>
          )
        }
      >
        <InfoCircleOutlined />
      </Popover>
    </Text>
  );
};
