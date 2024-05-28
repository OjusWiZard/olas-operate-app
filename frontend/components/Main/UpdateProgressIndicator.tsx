import { Button, Flex, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import { CSSProperties } from 'styled-components';

import { useElectronApi } from '@/hooks/useElectronApi';

import { Alert } from '../common/Alert';
import { CardSection } from '../styled/CardSection';

const { Text, Paragraph } = Typography;
const COVER_PREV_BLOCK_BORDER_STYLE: CSSProperties = { marginBottom: '-1px' };

export const UpdateProgressIndicator: FC = () => {
  const { quitAndInstall, ipcRenderer } = useElectronApi();

  const [downloadPercent, setDownloadPercent] = useState(0);
  const [isDownloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    ipcRenderer?.on?.('download-progress', (progress: unknown) => {
      const progressInfo = progress as { percent?: number | undefined };
      setDownloadPercent(progressInfo.percent ?? 0);
    });

    ipcRenderer?.on?.('update-downloaded', () => {
      setDownloadComplete(true);
    });

    return () => {
      ipcRenderer?.removeAllListeners?.('download-progress');
      ipcRenderer?.removeAllListeners?.('update-downloaded');
    };
  }, [ipcRenderer, setDownloadPercent, setDownloadComplete]);

  const restartApp = () => {
    quitAndInstall?.();
  };

  const isAppReady = downloadPercent === 100;

  if (!downloadPercent) return null;

  return (
    <CardSection style={COVER_PREV_BLOCK_BORDER_STYLE}>
      <Alert
        type="primary"
        showIcon
        fullWidth
        message={
          <Flex justify="space-between" align="center">
            <Flex vertical gap={4}>
              <Text className="font-weight-600 mb-4">Preparing for update</Text>
              {isAppReady ? null : (
                <Paragraph className="mb-4">
                  Downloading the update... {downloadPercent}%
                </Paragraph>
              )}
            </Flex>

            {isAppReady && (
              <Button
                type="primary"
                ghost
                onClick={restartApp}
                loading={!isDownloadComplete}
              >
                Install Update
              </Button>
            )}
          </Flex>
        }
      />
    </CardSection>
  );
};
