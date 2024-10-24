import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react';

import { SetupScreen } from '@/enums/SetupScreen';
import { Address } from '@/types/Address';

type SetupObjectType = {
  backupSigner?: Address;
  mnemonic: string[];
  state: SetupScreen;
};

type SetupContextType = {
  setSetupObject: Dispatch<SetStateAction<SetupObjectType>>;
  setupObject: SetupObjectType;
};

export const SetupContext = createContext<SetupContextType>({
  setupObject: {
    state: SetupScreen.Welcome,
    mnemonic: [],
    backupSigner: undefined,
  },
  setSetupObject: () => {},
});

export const SetupProvider = ({ children }: PropsWithChildren) => {
  const [setupObject, setSetupObject] = useState<SetupObjectType>({
    state: SetupScreen.Welcome,
    mnemonic: [],
    backupSigner: undefined,
  });

  return (
    <SetupContext.Provider value={{ setupObject, setSetupObject }}>
      {children}
    </SetupContext.Provider>
  );
};
