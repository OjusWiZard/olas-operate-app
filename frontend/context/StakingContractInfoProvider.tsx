import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useInterval } from 'usehooks-ts';

import { CHAINS } from '@/constants/chains';
import { FIVE_SECONDS_INTERVAL } from '@/constants/intervals';
import { PredictStakingProgramId } from '@/enums/StakingProgramId';
import { AutonolasService } from '@/service/Autonolas';
import { StakingContractInfo } from '@/types/Autonolas';
import { StakingProgramId } from '@/types/StakingProgram';

import { ServicesContext } from './ServicesProvider';
import { StakingProgramContext } from './StakingProgramProvider';

type StakingContractInfoContextProps = {
  activeStakingContractInfo?: Partial<StakingContractInfo>;
  isPaused: boolean;
  isStakingContractInfoLoaded: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  stakingContractInfoRecord?: Record<
    StakingProgramId,
    Partial<StakingContractInfo>
  >;
  updateActiveStakingContractInfo: () => Promise<void>;
};

export const StakingContractInfoContext =
  createContext<StakingContractInfoContextProps>({
    activeStakingContractInfo: undefined,
    isPaused: false,
    isStakingContractInfoLoaded: false,
    stakingContractInfoRecord: undefined,
    updateActiveStakingContractInfo: async () => {},
    setIsPaused: () => {},
  });

export const StakingContractInfoProvider = ({
  children,
}: PropsWithChildren) => {
  const { services } = useContext(ServicesContext);
  const { activeStakingProgramId } = useContext(StakingProgramContext);

  const [isPaused, setIsPaused] = useState(false);
  const [isStakingContractInfoLoaded, setIsStakingContractInfoLoaded] =
    useState(false);

  const [activeStakingContractInfo, setActiveStakingContractInfo] =
    useState<Partial<StakingContractInfo>>();

  const [stakingContractInfoRecord, setStakingContractInfoRecord] =
    useState<Record<StakingProgramId, Partial<StakingContractInfo>>>();

  const serviceId = useMemo(
    () => services?.[0]?.chain_configs[CHAINS.GNOSIS.chainId].chain_data?.token,
    [services],
  );

  /** Updates staking contract info specific to the actively staked service owned by the user */
  const updateActiveStakingContractInfo = useCallback(async () => {
    if (!serviceId) return;
    if (!activeStakingProgramId) return;

    AutonolasService.getStakingContractInfoByServiceIdStakingProgram(
      serviceId,
      activeStakingProgramId,
    ).then(setActiveStakingContractInfo);
  }, [activeStakingProgramId, serviceId]);

  useInterval(
    async () => {
      await updateStakingContractInfoRecord().catch(console.error);
      await updateActiveStakingContractInfo().catch(console.error);
    },
    isPaused ? null : FIVE_SECONDS_INTERVAL,
  );

  /** Updates general staking contract information, not user or service specific */
  const updateStakingContractInfoRecord = async () => {
    const alpha = AutonolasService.getStakingContractInfoByStakingProgram(
      PredictStakingProgramId.Alpha,
    );
    const beta = AutonolasService.getStakingContractInfoByStakingProgram(
      PredictStakingProgramId.Beta,
    );
    const beta_2 = AutonolasService.getStakingContractInfoByStakingProgram(
      PredictStakingProgramId.Beta2,
    );
    const beta_mech_marketplace =
      AutonolasService.getStakingContractInfoByStakingProgram(
        PredictStakingProgramId.MechMarketplace,
      );

    try {
      const [alphaInfo, betaInfo, beta2Info] = await Promise.all([
        alpha,
        beta,
        beta_2,
      ]);
      setStakingContractInfoRecord({
        [StakingProgramId.Alpha]: alphaInfo,
        [StakingProgramId.Beta]: betaInfo,
        [StakingProgramId.Beta2]: beta2Info,
      });
      setIsStakingContractInfoLoaded(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Load generic staking contract info record on mount
    updateStakingContractInfoRecord();
  }, []);

  return (
    <StakingContractInfoContext.Provider
      value={{
        activeStakingContractInfo,
        isStakingContractInfoLoaded,
        stakingContractInfoRecord,
        isPaused,
        setIsPaused,
        updateActiveStakingContractInfo,
      }}
    >
      {children}
    </StakingContractInfoContext.Provider>
  );
};
