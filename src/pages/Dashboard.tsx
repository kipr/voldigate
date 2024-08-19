import * as React from 'react';
import { DARK, ThemeProps } from '../components/theme';
import { StyleProps } from '../style';
import { styled } from 'styletron-react';
import { Card } from '../components/Card';
import MainMenu from '../components/MainMenu';
import LeftBar from '../components/LeftBar';
import { HomeStartOptions } from '../components/HomeStartOptions';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import { State } from '../state';
import { normalize } from 'node:path/win32';
import HomeNavigation from '../components/HomeNavigation';
import Root from '../components/Root';

export interface DashboardPublicProps extends RouteComponentProps, ThemeProps, StyleProps {

}

interface DashboardPrivateProps {
  onTutorialsClick: () => void;
  onSimulatorClick: () => void;
  locale: LocalizedString.Language;
}

type Props = DashboardPublicProps & DashboardPrivateProps;

const Container = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
}));




const cardContainerMargin = () => {
  const windowWidth = window.innerWidth;

  const maxMargin = (windowWidth - (windowWidth * 0.8)) / 2;
  const minMargin = 40;

  return `${maxMargin > minMargin ? maxMargin : minMargin}px`;
};

const CardContainer = styled('div', (props: ThemeProps) => ({
  position: 'relative',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'center',
  paddingLeft: cardContainerMargin(),
  paddingRight: cardContainerMargin(),
  backgroundColor: props.theme.backgroundColor,
  width: '100%',
  height: 'calc(100vh - 48px)',
}));

const StartOptionContainer = styled('div', (props: ThemeProps) => ({
  position: 'absolute',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'start',
  top: '36%',
  marginLeft: '20%',
  backgroundColor: 'green',
  width: '50%',
  height: '40%',
}));




const RootContainer = styled('div', (props: ThemeProps) => ({
  position: 'absolute',
  top: '4%',
  display: 'flex',
  flexWrap: 'wrap',
  marginLeft: '4%',
  flexDirection: 'row',
  justifyContent: 'start',
  width: '30%',
  height: '30%',
  zIndex: 0,
}));


const Item = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  borderRight: `1px solid ${props.theme.borderColor}`,

  paddingRight: '20px',
  marginBottom: '70px',
  height: '45px',

  userSelect: 'none',
  transition: 'background-color 0.2s, opacity 0.2s'
}));

class Dashboard extends React.PureComponent<Props> {
  private onAboutClick_ = (event: React.MouseEvent) => {
    window.location.href = 'https://www.kipr.org/kipr/about-kipr';
  };

  render() {
    const { props } = this;
    const { className, style, onTutorialsClick, onSimulatorClick, locale } = props;
    const theme = DARK;

    return (
      <>

        

        <RootContainer theme={theme}>
          <Root history={undefined} location={undefined} match={undefined}/>
        </RootContainer>
        <HomeNavigation theme={theme} history={undefined} location={undefined} match={undefined}>


        </HomeNavigation>
      </>

    );
  }
}

export default connect((state: State) => ({
  locale: state.i18n.locale,
}), dispatch => ({

}))(Dashboard) as React.ComponentType<DashboardPublicProps>;