import '../styles/globals.scss';

import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { useEffect, useRef } from 'react';

import { Layout } from '@/components/Layout';
import { BalanceProvider } from '@/context/BalanceProvider';
import { ElectronApiProvider } from '@/context/ElectronApiProvider';
import { MasterSafeProvider } from '@/context/MasterSafeProvider';
import { OnlineStatusProvider } from '@/context/OnlineStatusProvider';
import { PageStateProvider } from '@/context/PageStateProvider';
import { RewardProvider } from '@/context/RewardProvider';
import { ServicesProvider } from '@/context/ServicesProvider';
import { SettingsProvider } from '@/context/SettingsProvider';
import { SetupProvider } from '@/context/SetupProvider';
import { StakingContractInfoProvider } from '@/context/StakingContractInfoProvider';
import { StoreProvider } from '@/context/StoreProvider';
import { WalletProvider } from '@/context/WalletProvider';
import { mainTheme } from '@/theme';

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <ElectronApiProvider>
      <StoreProvider>
        <PageStateProvider>
          <OnlineStatusProvider>
            <WalletProvider>
              <MasterSafeProvider>
                <ServicesProvider>
                  <RewardProvider>
                    <BalanceProvider>
                      <SetupProvider>
                        <SettingsProvider>
                          <StakingContractInfoProvider>
                            {isMounted ? (
                              <ConfigProvider theme={mainTheme}>
                                <Layout>
                                  <Component {...pageProps} />
                                </Layout>
                              </ConfigProvider>
                            ) : null}
                          </StakingContractInfoProvider>
                        </SettingsProvider>
                      </SetupProvider>
                    </BalanceProvider>
                  </RewardProvider>
                </ServicesProvider>
              </MasterSafeProvider>
            </WalletProvider>
          </OnlineStatusProvider>
        </PageStateProvider>
      </StoreProvider>
    </ElectronApiProvider>
  );
}
