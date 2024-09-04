import { Button, Flex, Popover, theme, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { Chain, DeploymentStatus } from '@/client';
import { OpenAddFundsSection } from '@/components/MainPage/sections/AddFundsSection';
import { CardSection } from '@/components/styled/CardSection';
import { SERVICE_STAKING_TOKEN_MECH_USAGE_CONTRACT_ADDRESSES } from '@/constants/contractAddresses';
import { STAKING_PROGRAM_META } from '@/constants/stakingProgramMeta';
import { UNICODE_SYMBOLS } from '@/constants/symbols';
import { Pages } from '@/enums/PageState';
import { StakingProgram } from '@/enums/StakingProgram';
import { StakingProgramStatus } from '@/enums/StakingProgramStatus';
import { useBalance } from '@/hooks/useBalance';
import { useModals } from '@/hooks/useModals';
import { usePageState } from '@/hooks/usePageState';
import { useServices } from '@/hooks/useServices';
import { useServiceTemplates } from '@/hooks/useServiceTemplates';
import { useStakingContractInfo } from '@/hooks/useStakingContractInfo';
import { useStakingProgram } from '@/hooks/useStakingProgram';
import { ServicesService } from '@/service/Services';
import { StakingContractInfo } from '@/types/Autonolas';
import { getMinimumStakedAmountRequired } from '@/utils/service';

import { AlertInsufficientMigrationFunds, AlertNoSlots } from './alerts';
import { StakingContractTag } from './StakingContractTag';

// const { Text } = Typography;

const { useToken } = theme;

// const CustomDivider = styled(Divider)`
//   flex: auto;
//   width: max-content;
//   min-width: 0;
//   margin: 0;
// `;

// const ContractParameter = ({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) => (
//   <Flex gap={16} align="center">
//     <Text type="secondary">{label}</Text>
//     <CustomDivider />
//     <Text className="font-weight-600">{value}</Text>
//   </Flex>
// );

export const StakingContractSection = ({
  stakingProgram,
}: {
  stakingProgram: StakingProgram;
}) => {
  const { goto } = usePageState();
  const {
    setServiceStatus,
    serviceStatus,
    setIsServicePollingPaused,
    updateServiceStatus,
  } = useServices();
  const { serviceTemplate } = useServiceTemplates();
  const { setMigrationModalOpen } = useModals();
  const { activeStakingProgram, defaultStakingProgram, updateStakingProgram } =
    useStakingProgram();
  const { token } = useToken();
  const { safeBalance, totalOlasStakedBalance, isBalanceLoaded } = useBalance();
  const { isServiceStakedForMinimumDuration, stakingContractInfoRecord } =
    useStakingContractInfo();
  const [isFundingSectionOpen, setIsFundingSectionOpen] = useState(false);

  const stakingContractAddress =
    SERVICE_STAKING_TOKEN_MECH_USAGE_CONTRACT_ADDRESSES[Chain.GNOSIS][
      stakingProgram
    ];

  const stakingProgramMeta = STAKING_PROGRAM_META[stakingProgram];

  const stakingContractInfoForStakingProgram =
    stakingContractInfoRecord?.[stakingProgram];

  const activeStakingContractInfo =
    activeStakingProgram && stakingContractInfoRecord?.[activeStakingProgram];

  const activeStakingProgramMeta =
    activeStakingProgram && STAKING_PROGRAM_META[activeStakingProgram];

  const isSelected =
    activeStakingProgram && activeStakingProgram === stakingProgram;

  const hasEnoughRewards = true;
  //(stakingContractInfoForStakingProgram?.availableRewards ?? 0) > 0;

  const minimumOlasRequiredToMigrate = useMemo(
    () => getMinimumStakedAmountRequired(serviceTemplate, stakingProgram),
    [serviceTemplate, stakingProgram],
  );

  const hasEnoughOlasToMigrate = useMemo(() => {
    if (safeBalance?.OLAS === undefined || totalOlasStakedBalance === undefined)
      return false;

    const balanceForMigration = safeBalance.OLAS + totalOlasStakedBalance;

    if (minimumOlasRequiredToMigrate === undefined) return false;

    return balanceForMigration >= minimumOlasRequiredToMigrate;
  }, [minimumOlasRequiredToMigrate, safeBalance?.OLAS, totalOlasStakedBalance]);

  const hasEnoughSlots =
    stakingContractInfoForStakingProgram?.maxNumServices &&
    stakingContractInfoForStakingProgram?.serviceIds &&
    stakingContractInfoForStakingProgram?.maxNumServices >
      stakingContractInfoForStakingProgram?.serviceIds?.length;

  const activeStakingContractSupportsMigration =
    !activeStakingProgram ||
    (activeStakingProgramMeta?.canMigrateTo.includes(stakingProgram) &&
      isServiceStakedForMinimumDuration);

  const canMigrate =
    // checks for both initial deployment and migration
    !isSelected &&
    isBalanceLoaded &&
    hasEnoughSlots &&
    hasEnoughRewards &&
    hasEnoughOlasToMigrate &&
    serviceStatus !== DeploymentStatus.DEPLOYED &&
    serviceStatus !== DeploymentStatus.DEPLOYING &&
    serviceStatus !== DeploymentStatus.STOPPING &&
    // checks for migration from an actively staked service
    (!activeStakingProgram ||
      (isServiceStakedForMinimumDuration &&
        activeStakingProgramMeta?.canMigrateTo.includes(stakingProgram)));

  const cantMigrateReason = useMemo(() => {
    if (isSelected) {
      return 'Contract is already selected';
    }

    if (!activeStakingProgramMeta?.canMigrateTo.includes(stakingProgram)) {
      return 'Migration not supported for this contract';
    }

    if (!hasEnoughRewards) {
      return 'No available rewards';
    }

    if (!isBalanceLoaded) {
      return 'Loading balance...';
    }

    if (!hasEnoughSlots) {
      return 'No available staking slots';
    }

    if (!isServiceStakedForMinimumDuration && activeStakingContractInfo) {
      return (
        <CountdownUntilMigration
          activeStakingContractInfo={activeStakingContractInfo}
        />
      );
    }

    if (!hasEnoughOlasToMigrate) {
      return `Insufficient OLAS to migrate, ${minimumOlasRequiredToMigrate} OLAS required in total.`;
    }

    // App version compatibility not implemented yet
    // if (!isAppVersionCompatible) {
    //   return 'Pearl update required to migrate';
    // }

    if (serviceStatus === DeploymentStatus.DEPLOYED) {
      return 'Pearl is currently running, turn it before switching';
    }

    if (serviceStatus === DeploymentStatus.DEPLOYING) {
      return 'Pearl is currently deploying, please turn it off before switching';
    }

    if (serviceStatus === DeploymentStatus.STOPPING) {
      return 'Pearl is currently stopping, please wait before switching';
    }
  }, [
    activeStakingContractInfo,
    activeStakingProgramMeta?.canMigrateTo,
    hasEnoughOlasToMigrate,
    hasEnoughRewards,
    hasEnoughSlots,
    isBalanceLoaded,
    isSelected,
    isServiceStakedForMinimumDuration,
    minimumOlasRequiredToMigrate,
    serviceStatus,
    stakingProgram,
  ]);

  const cantMigrateAlert = useMemo(() => {
    if (isSelected || !isBalanceLoaded) {
      return null;
    }

    if (!hasEnoughSlots) {
      return <AlertNoSlots />;
    }

    if (
      !hasEnoughOlasToMigrate &&
      safeBalance?.OLAS !== undefined &&
      totalOlasStakedBalance !== undefined
    ) {
      return (
        <AlertInsufficientMigrationFunds
          masterSafeOlasBalance={safeBalance.OLAS}
          stakedOlasBalance={totalOlasStakedBalance}
          totalOlasRequiredForStaking={minimumOlasRequiredToMigrate!}
        />
      );
    }

    // App version compatibility not implemented yet
    // if (!isAppVersionCompatible) {
    //   return <AlertUpdateToMigrate />;
    // }
  }, [
    isSelected,
    isBalanceLoaded,
    hasEnoughSlots,
    hasEnoughOlasToMigrate,
    safeBalance?.OLAS,
    totalOlasStakedBalance,
    minimumOlasRequiredToMigrate,
  ]);

  const contractTagStatus = useMemo(() => {
    if (activeStakingProgram === stakingProgram)
      return StakingProgramStatus.Selected;

    // Pearl is not staked, set as Selected if default (Beta)
    if (!activeStakingProgram && stakingProgram === defaultStakingProgram)
      return StakingProgramStatus.Selected;

    // Otherwise, highlight Beta as New
    if (stakingProgram === StakingProgram.Beta) return StakingProgramStatus.New;

    // Otherwise, no tag
    return;
  }, [activeStakingProgram, defaultStakingProgram, stakingProgram]);

  if (STAKING_PROGRAM_META[stakingProgram].deprecated) {
    return null;
  }

  return (
    <>
      <CardSection
        style={
          isSelected || !activeStakingProgram
            ? { background: token.colorBgContainerDisabled }
            : {}
        }
        bordertop="true"
        borderbottom="true"
        vertical
        gap={16}
      >
        {/* Title */}
        <Flex gap={12}>
          <Typography.Title
            level={5}
            className="m-0"
          >{`${stakingProgramMeta?.name} contract`}</Typography.Title>
          <StakingContractTag status={contractTagStatus} />
        </Flex>

        {/* TODO: redisplay once bugs resolved */}

        {/* 
          {stakingContractInfo?.availableRewards && (
            <ContractParameter
              label="Rewards per work period"
              value={`${stakingContractInfo?.availableRewards} OLAS`}
            />
          )}

          {stakingContractInfo?.minStakingDeposit && (
            <ContractParameter
              label="Required OLAS for staking"
              value={`${stakingContractInfo?.minStakingDeposit} OLAS`}
            />
          )} 
       */}
        <a
          href={`https://gnosisscan.io/address/${stakingContractAddress}`}
          target="_blank"
        >
          View contract details {UNICODE_SYMBOLS.EXTERNAL_LINK}
        </a>
        {activeStakingContractSupportsMigration && cantMigrateAlert}
        {/* Switch to program button */}
        {![activeStakingProgram, defaultStakingProgram].includes(
          stakingProgram,
        ) && (
          <Popover content={!canMigrate && cantMigrateReason}>
            <Button
              type="primary"
              size="large"
              disabled={!canMigrate}
              onClick={async () => {
                setIsServicePollingPaused(true);
                try {
                  setServiceStatus(DeploymentStatus.DEPLOYING);
                  goto(Pages.Main);

                  await ServicesService.createService({
                    stakingProgram,
                    serviceTemplate,
                    deploy: true,
                  });

                  await updateStakingProgram();

                  setMigrationModalOpen(true);
                } catch (error) {
                  console.error(error);
                } finally {
                  setIsServicePollingPaused(false);
                  updateServiceStatus();
                }
              }}
            >
              Switch
            </Button>
          </Popover>
        )}
        {!isSelected &&
          activeStakingContractSupportsMigration &&
          !hasEnoughOlasToMigrate && (
            <>
              <Button
                type="default"
                size="large"
                onClick={() => setIsFundingSectionOpen((prev) => !prev)}
              >
                {isFundingSectionOpen ? 'Hide' : 'Show'} address to fund
              </Button>
              {isFundingSectionOpen && <OpenAddFundsSection />}
            </>
          )}
      </CardSection>
    </>
  );
};

const CountdownUntilMigration = ({
  activeStakingContractInfo,
}: {
  activeStakingContractInfo: Partial<StakingContractInfo>;
}) => {
  const [secondsUntilReady, setSecondsUntilMigration] = useState<number>();

  useInterval(() => {
    if (!activeStakingContractInfo) return;

    const { serviceStakingStartTime, minimumStakingDuration } =
      activeStakingContractInfo;

    if (!minimumStakingDuration) return;
    if (!serviceStakingStartTime) return;

    const now = Math.round(Date.now() / 1000);
    const timeSinceLastStaked = now - serviceStakingStartTime;

    const timeUntilMigration = minimumStakingDuration - timeSinceLastStaked;

    if (timeUntilMigration < 0) {
      setSecondsUntilMigration(0);
      return;
    }

    setSecondsUntilMigration(timeUntilMigration);
  }, 1000);

  if (!secondsUntilReady) return "You're ready to switch contracts!"; // Shouldn't happen, but just in case

  return (
    <Flex vertical gap={1}>
      <span>Your agent must continue staking for</span>
      <span>{countdownDisplayFormat(secondsUntilReady)}</span>
      <span>before it can switch to a new contract</span>
    </Flex>
  );
};

const countdownDisplayFormat = (totalSeconds: number) => {
  const days = Math.floor(totalSeconds / (24 * 3600));
  totalSeconds %= 24 * 3600;

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Ensure double digits for hours, minutes, and seconds
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${days} days ${formattedHours} hours ${formattedMinutes} minutes ${formattedSeconds} seconds`;
};
