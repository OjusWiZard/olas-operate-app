import { Button, Flex, Modal, Typography } from 'antd';
import Image from 'next/image';
import { FC } from 'react';

import { useServiceTemplates } from '@/hooks/useServiceTemplates';
import { getMinimumStakedAmountRequired } from '@/utils/service';

type FirstRunModalProps = { open: boolean; onClose: () => void };

export const FirstRunModal: FC<FirstRunModalProps> = ({ open, onClose }) => {
  const { getServiceTemplates } = useServiceTemplates();

  if (!open) return null;

  const minimumStakedAmountRequired = getMinimumStakedAmountRequired(
    getServiceTemplates()[0],
  );

  return (
    <Modal
      open={open}
      width={412}
      onCancel={onClose}
      footer={[
        <Button
          key="ok"
          type="primary"
          block
          size="large"
          className="mt-8"
          onClick={onClose}
        >
          Got it
        </Button>,
      ]}
    >
      <Flex align="center" justify="center">
        <Image
          src="/splash-robot-head.png"
          width={100}
          height={100}
          alt="OLAS logo"
        />
      </Flex>
      <Typography.Title level={5} className="mt-12 text-center">
        {`Your agent is running and you've staked ${minimumStakedAmountRequired} OLAS!`}
      </Typography.Title>
      <Typography.Paragraph>
        Your agent is working towards earning rewards.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Pearl is designed to make it easy for you to earn staking rewards every
        day. Simply leave the app and agent running in the background for ~1hr a
        day.
      </Typography.Paragraph>
    </Modal>
  );
};
