import { Flex, Typography } from 'antd';

import { CustomAlert } from '@/components/Alert';
import { UNICODE_SYMBOLS } from '@/constants/symbols';
import { useStakingProgram } from '@/hooks/useStakingProgram';

const { Text } = Typography;

export const AlertInsufficientMigrationFunds = ({
  masterSafeOlasBalance,
  stakedOlasBalance,
  totalOlasRequiredForStaking,
}: {
  masterSafeOlasBalance: number;
  stakedOlasBalance: number;
  totalOlasRequiredForStaking: number;
}) => {
  const { activeStakingProgram } = useStakingProgram();

  const requiredOlasDeposit = activeStakingProgram
    ? totalOlasRequiredForStaking - (stakedOlasBalance + masterSafeOlasBalance) // when staked
    : totalOlasRequiredForStaking - masterSafeOlasBalance; // when not staked

  return (
    <CustomAlert
      type="warning"
      showIcon
      message={
        <Flex vertical gap={4}>
          <Text className="font-weight-600">
            An additional {requiredOlasDeposit} OLAS is required to switch
          </Text>
          <Text>
            Add <strong>{requiredOlasDeposit} OLAS</strong> to your account to
            meet the contract requirements and switch.
          </Text>
        </Flex>
      }
    />
  );
};

export const AlertNoSlots = () => (
  <CustomAlert
    type="warning"
    showIcon
    message={<Text>No slots currently available - try again later.</Text>}
  />
);

export const AlertUpdateToMigrate = () => (
  <CustomAlert
    type="warning"
    showIcon
    message={
      <Flex vertical gap={4}>
        <Text className="font-weight-600">App update required</Text>

        {/* 
          TODO: Define version requirement in some JSON store?
          How do we access this date on a previous version? 
        */}
        <Text>
          Update Pearl to the latest version to switch to the staking contract.
        </Text>
        {/* TODO: trigger update through IPC */}
        <a href="#" target="_blank">
          Update Pearl to the latest version {UNICODE_SYMBOLS.EXTERNAL_LINK}
        </a>
      </Flex>
    }
  />
);
