import { Typography } from 'antd';
import styled from 'styled-components';

import { COLOR } from '@/constants';
import { useElectronApi } from '@/hooks/useElectronApi';

const { Text } = Typography;

const TrafficLightIcon = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 8px;
  -webkit-app-region: no-drag;
`;

const RedLight = styled(TrafficLightIcon)`
  background-color: #fe5f57;
`;

const YellowLight = styled(TrafficLightIcon)`
  background-color: #febc2e;
`;

const DisabledLight = styled(TrafficLightIcon)`
  background-color: #ddd;
`;

const TrafficLights = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;
  -webkit-app-region: no-drag;
`;

const TopBarContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 10px 8px;
  border-radius: 8px 8px 0 0px;
  border-bottom: 1px solid ${COLOR.BORDER_GRAY};
  background: ${COLOR.WHITE};
  -webkit-app-region: drag;
`;

export const TopBar = () => {
  const { minimizeApp, closeApp } = useElectronApi();

  return (
    <TopBarContainer>
      <TrafficLights>
        <RedLight onClick={() => closeApp?.()} />
        <YellowLight onClick={() => minimizeApp?.()} />
        <DisabledLight />
      </TrafficLights>

      <Text>Pearl (alpha)</Text>
    </TopBarContainer>
  );
};
