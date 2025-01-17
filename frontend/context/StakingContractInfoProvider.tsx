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
import { StakingProgramId } from '@/enums/StakingProgram';
import { AutonolasService } from '@/service/Autonolas';
import { StakingContractInfo } from '@/types/Autonolas';

import { ServicesContext } from './ServicesProvider';
import { StakingProgramContext } from './StakingProgramProvider';

type StakingContractInfoContextProps = {
  activeStakingContractInfo?: Partial<StakingContractInfo>;
  isPaused: boolean;
  isStakingContractInfoLoaded: boolean;
  stakingContractInfoRecord?: Record<
    StakingProgramId,
    Partial<StakingContractInfo>
  >;
  updateActiveStakingContractInfo: () => Promise<void>;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
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
    const stakingPrograms = Object.values(StakingProgramId);

    try {
      const stakingInfoPromises = stakingPrograms.map((programId) =>
        AutonolasService.getStakingContractInfoByStakingProgram(programId),
      );

      const stakingInfos = await Promise.allSettled(stakingInfoPromises);

      const stakingContractInfoRecord = stakingPrograms.reduce(
        (record, programId, index) => {
          if (stakingInfos[index].status === 'rejected') {
            console.error(stakingInfos[index].reason);
            return record;
          }
          record[programId] = stakingInfos[index].value;
          return record;
        },
        {} as Record<string, Partial<StakingContractInfo>>,
      );

      setStakingContractInfoRecord(stakingContractInfoRecord);
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
