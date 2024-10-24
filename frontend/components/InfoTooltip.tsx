import { InfoCircleOutlined } from '@ant-design/icons';
import Tooltip, { TooltipPlacement } from 'antd/es/tooltip';

import { COLOR } from '@/constants/colors';

export const InfoTooltip = ({
  placement = 'topLeft',
  children,
}: {
  children: React.ReactNode;
  placement?: TooltipPlacement;
}) => (
  <Tooltip arrow={false} title={children} placement={placement}>
    <InfoCircleOutlined style={{ color: COLOR.TEXT_LIGHT }} />
  </Tooltip>
);
