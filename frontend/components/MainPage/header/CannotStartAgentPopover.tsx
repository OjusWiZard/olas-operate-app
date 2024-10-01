import { InfoCircleOutlined } from '@ant-design/icons';
import { Flex, Popover, PopoverProps, Typography } from 'antd';
import { isNumber } from 'lodash';

import { COLOR } from '@/constants/colors';
import { UNICODE_SYMBOLS } from '@/constants/symbols';
import { SUPPORT_URL } from '@/constants/urls';
import { useStakingContractInfo } from '@/hooks/useStakingContractInfo';

const { Paragraph, Text } = Typography;

// TODO: already moved to time.ts util file in different PR
// To be removed!
const formatToShortDateTime = (timeInSeconds?: number) => {
  if (!isNumber(timeInSeconds)) return '--';
  return new Date(timeInSeconds).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  });
};

const cannotStartAgentText = (
  <Text style={{ color: COLOR.RED }}>
    Cannot start agent&nbsp;
    <InfoCircleOutlined />
  </Text>
);

const otherPopoverProps: PopoverProps = {
  arrow: false,
  placement: 'bottomRight',
};

export const CannotStartAgentDueToUnexpectedError = () => (
  <Popover
    {...otherPopoverProps}
    title="Unexpected error"
    content={
      <div style={{ maxWidth: 340 }}>
        <Paragraph>
          Try to restart the app. If the issue persists, join the Olas community
          Discord server to report or stay up to date on the issue.
        </Paragraph>

        <a href={SUPPORT_URL} target="_blank" rel="noreferrer">
          Olas community Discord server {UNICODE_SYMBOLS.EXTERNAL_LINK}
        </a>
      </div>
    }
  >
    {cannotStartAgentText}
  </Popover>
);

const evictedDescription =
  "You didn't run your agent enough and it missed its targets multiple times. You can run the agent again when the eviction period ends.";
const AgentEvictedPopover = () => {
  const { evictionExpiresAt } = useStakingContractInfo();

  if (!evictionExpiresAt) return null;
  return (
    <Popover
      {...otherPopoverProps}
      open
      title="Your agent is evicted"
      content={
        <Flex
          vertical
          gap={8}
          className="text-sm-all"
          style={{ maxWidth: 340 }}
        >
          <Paragraph className="text-sm m-0">{evictedDescription}</Paragraph>
          <Paragraph className="m-0">
            <Text className="text-sm">Eviction ends at</Text>{' '}
            <Text strong className="text-sm">
              {formatToShortDateTime(evictionExpiresAt * 1000)}
            </Text>
          </Paragraph>
        </Flex>
      }
    >
      {cannotStartAgentText}
    </Popover>
  );
};

const JoinOlasCommunity = () => (
  <div style={{ maxWidth: 340 }}>
    <Paragraph>
      Join the Olas community Discord server to report or stay up to date on the
      issue.
    </Paragraph>

    <a href={SUPPORT_URL} target="_blank" rel="noreferrer">
      Olas community Discord server {UNICODE_SYMBOLS.EXTERNAL_LINK}
    </a>
  </div>
);

const NoRewardsAvailablePopover = () => (
  <Popover
    {...otherPopoverProps}
    title="No rewards available"
    content={<JoinOlasCommunity />}
  >
    {cannotStartAgentText}
  </Popover>
);

const NoJobsAvailablePopover = () => (
  <Popover
    {...otherPopoverProps}
    title="No jobs available"
    content={<JoinOlasCommunity />}
  >
    {cannotStartAgentText}
  </Popover>
);

export const CannotStartAgentPopover = () => {
  const {
    isEligibleForStaking,
    hasEnoughServiceSlots,
    isRewardsAvailable,
    isAgentEvicted,
  } = useStakingContractInfo();

  return <AgentEvictedPopover />;

  if (isEligibleForStaking) return null;
  if (!hasEnoughServiceSlots) return <NoJobsAvailablePopover />;
  if (!isRewardsAvailable) return <NoRewardsAvailablePopover />;
  if (isAgentEvicted) return <AgentEvictedPopover />;
  throw new Error('Cannot start agent, please contact support');
};
