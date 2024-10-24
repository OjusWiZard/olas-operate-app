import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Alert as AlertAntd, AlertProps } from 'antd';

type AlertType = 'primary' | 'info' | 'warning' | 'error';

const icons = {
  primary: <InfoCircleOutlined />,
  info: <InfoCircleOutlined />,
  warning: <WarningOutlined />,
  error: <ExclamationCircleOutlined />,
};

export const CustomAlert = ({
  type,
  fullWidth,
  ...rest
}: { fullWidth?: boolean; type: AlertType } & Omit<AlertProps, 'type'>) => (
  <AlertAntd
    type={type === 'primary' ? undefined : type}
    className={`custom-alert custom-alert--${type} ${fullWidth ? 'custom-alert--full-width' : ''}`}
    icon={rest.showIcon ? icons[type] : undefined}
    {...rest}
  />
);
