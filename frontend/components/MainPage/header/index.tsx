import { Flex } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { MiddlewareDeploymentStatus } from '@/types/middleware';
import { useBalance } from '@/hooks/useBalance';
import { useElectronApi } from '@/hooks/useElectronApi';
import { useServices } from '@/hooks/useServices';

import { FirstRunModal } from '../modals/FirstRunModal';
import { AgentButton } from './AgentButton';
import { AgentHead } from './AgentHead';

const useSetupTrayIcon = () => {
  const { isLowBalance } = useBalance();
  const { serviceStatus } = useServices();
  const { setTrayIcon } = useElectronApi();

  useEffect(() => {
    if (isLowBalance) {
      setTrayIcon?.('low-gas');
    } else if (serviceStatus === MiddlewareDeploymentStatus.DEPLOYED) {
      setTrayIcon?.('running');
    } else if (serviceStatus === MiddlewareDeploymentStatus.STOPPED) {
      setTrayIcon?.('paused');
    } else if (serviceStatus === MiddlewareDeploymentStatus.BUILT) {
      setTrayIcon?.('logged-out');
    }
  }, [isLowBalance, serviceStatus, setTrayIcon]);

  return null;
};

export const MainHeader = () => {
  const [isFirstRunModalOpen, setIsFirstRunModalOpen] = useState(false);
  const handleModalClose = useCallback(() => setIsFirstRunModalOpen(false), []);

  useSetupTrayIcon();

  return (
    <Flex justify="start" align="center" gap={10}>
      <AgentHead />
      <AgentButton />
      <FirstRunModal open={isFirstRunModalOpen} onClose={handleModalClose} />
    </Flex>
  );
};
