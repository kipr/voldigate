import * as React from 'react';
import { DARK, ThemeProps } from '../components/theme';
import { StyleProps } from '../style';
import { styled } from 'styletron-react';
import { Card } from '../components/Card';
import MainMenu from '../components/MainMenu';
import LeftBar from '../components/LeftBar';
import HomeStartOptions from '../components/HomeStartOptions';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import { State } from '../state';
import { normalize } from 'node:path/win32';
import HomeNavigation from '../components/HomeNavigation';

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

const Logo = styled('img', (props: ThemeProps) => ({
  position: 'relative',
  top: '14%',
  alignItems: 'flex-end',
  width: '250px',
  height: '250px',
  marginLeft: '10%',
  marginRight: '10px',
  userSelect: 'none',
  transition: 'background-color 0.2s, opacity 0.2s'
}));
const IDEName = styled('div', (props: ThemeProps) => ({
  position: 'absolute',
  top: '40%',
  display: 'flex',
  flexWrap: 'wrap',
  marginLeft: '60%',
  flexDirection: 'row',
  justifyContent: 'start',
  fontFamily: "bebas-neue-pro-semiexpanded, sans-serif",
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: "500",
  width: '500px',
  height: '100%',
  zIndex: 0,
}));

const LogoContainer = styled('div', (props: ThemeProps) => ({
  position: 'absolute',
  top: '4px',
  display: 'flex',
  flexWrap: 'wrap',
  marginLeft: '30%',
  flexDirection: 'row',
  justifyContent: 'start',
  backgroundColor: '#373737',
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

        <LogoContainer theme={theme}>
          <Logo  src={KIPR_LOGO_WHITE as string} style= {{marginBottom:'10px'}}theme={theme}/>
          <IDEName style={{fontSize: 50}}theme={theme}>KISS IDE</IDEName>
        </LogoContainer>
        <StartOptionContainer theme={theme}>
          <HomeStartOptions theme={theme}></HomeStartOptions>
        </StartOptionContainer>
        <HomeNavigation theme={theme} history={undefined} location={undefined} match={undefined}>
        

         </HomeNavigation>
      </>
      
    );
  }
}

export default connect((state: State) => ({
  locale: state.i18n.locale,
}), dispatch => ({
  onTutorialsClick: () => dispatch(push('/tutorials')),
  onSimulatorClick: () => dispatch(push('/scene/jbcSandboxA')),
}))(Dashboard) as React.ComponentType<DashboardPublicProps>;