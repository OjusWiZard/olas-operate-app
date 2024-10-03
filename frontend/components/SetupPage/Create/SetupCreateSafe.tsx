import { Typography } from 'antd';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Chain } from '@/client';
import { CardSection } from '@/components/styled/CardSection';
import { UNICODE_SYMBOLS } from '@/constants/symbols';
import { SUPPORT_URL } from '@/constants/urls';
import { Pages } from '@/enums/PageState';
import { usePageState } from '@/hooks/usePageState';
import { useSetup } from '@/hooks/useSetup';
import { useWallet } from '@/hooks/useWallet';
import { WalletService } from '@/service/Wallet';

export const SetupCreateSafe = () => {
  const { goto } = usePageState();
  const { masterSafeAddress, updateWallets } = useWallet();
  const { backupSigner } = useSetup();

  const [isCreatingSafe, setIsCreatingSafe] = useState(false);
  const [isCreateSafeSuccessful, setIsCreateSafeSuccessful] = useState(false);
  const [failed, setFailed] = useState(false);

  const createSafeWithRetries = useCallback(
    (retries: number) => {
      setIsCreatingSafe(true);

      // If we have retried too many times, set failed
      if (retries <= 0) {
        setFailed(true);
        setIsCreatingSafe(false);
        setIsCreateSafeSuccessful(false);
        return;
      }

      // Try to create the safe
      WalletService.createSafe(Chain.GNOSIS, backupSigner)
        .then(async () => {
          setIsCreatingSafe(false);
          setIsCreateSafeSuccessful(true);
          setFailed(false);
          updateWallets();
        })
        .catch(async (e) => {
          console.error(e);
          // Wait for 1 second before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
          // Retry
          createSafeWithRetries(retries - 1);
        });
    },
    [backupSigner, updateWallets],
  );

  const creationStatusText = useMemo(() => {
    if (isCreatingSafe) return 'Creating account';
    if (masterSafeAddress) return 'Account created';
    return 'Account creation in progress';
  }, [isCreatingSafe, masterSafeAddress]);

  useEffect(() => {
    if (failed || isCreatingSafe || isCreateSafeSuccessful) return;
    createSafeWithRetries(3);
  }, [
    backupSigner,
    createSafeWithRetries,
    failed,
    isCreateSafeSuccessful,
    isCreatingSafe,
  ]);

  useEffect(() => {
    // Only progress is the safe is created and accessible via context (updates on interval)
    if (masterSafeAddress) goto(Pages.Main);
  }, [goto, masterSafeAddress]);

  return (
    <CardSection
      vertical
      align="center"
      justify="center"
      padding="80px 24px"
      gap={12}
    >
      {failed ? (
        <>
          <Image src="/broken-robot.svg" alt="logo" width={80} height={80} />
          <Typography.Text type="secondary" className="mt-12">
            Error, please contact{' '}
            <a target="_blank" href={SUPPORT_URL}>
              Olas community {UNICODE_SYMBOLS.EXTERNAL_LINK}
            </a>
          </Typography.Text>
        </>
      ) : (
        <>
          <Image
            src="/onboarding-robot.svg"
            alt="logo"
            width={80}
            height={80}
          />
          <Typography.Title
            level={4}
            className="m-0 mt-12 loading-ellipses"
            style={{ width: '220px' }}
          >
            {creationStatusText}
          </Typography.Title>
          <Typography.Text type="secondary">
            You will be redirected once the account is created
          </Typography.Text>
        </>
      )}
    </CardSection>
  );
};
