import * as React from 'react';
import { DARK, ThemeProps } from '../components/theme';
import { StyleProps } from '../style';
import { styled } from 'styletron-react';
import { Card } from '../components/Card';
import MainMenu from '../components/MainMenu';
import LeftBar from '../components/LeftBar';
import {HomeStartOptions} from './HomeStartOptions';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import { State } from '../state';
import { normalize } from 'node:path/win32';


export interface HomeNavigationPublicProps extends RouteComponentProps, ThemeProps, StyleProps {

}

interface HomeNavigationPrivateProps {
  onTutorialsClick: () => void;
  onSimulatorClick: () => void;
  locale: LocalizedString.Language;
}

type Props = HomeNavigationPublicProps & HomeNavigationPrivateProps;

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


const HomeNavigationContainer = styled('div', (props: ThemeProps) => ({
 
  alignItems: 'left',
  justifyContent: 'center',
  width: '100%',
  height: '100vh',
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
}));

const cardContainerMargin = () => {
  const windowWidth = window.innerWidth;

  const maxMargin = (windowWidth - (windowWidth * 0.8)) / 2;
  const minMargin = 40;

  return `${maxMargin > minMargin ? maxMargin : minMargin}px`;
};

class HomeNavigation extends React.PureComponent<Props> {
  private onAboutClick_ = (event: React.MouseEvent) => {
    window.location.href = 'https://www.kipr.org/kipr/about-kipr';
  };

  render() {
    const { props } = this;
    const { className, style, onTutorialsClick, onSimulatorClick, locale } = props;
    const theme = DARK;

    return (
      <HomeNavigationContainer theme={theme}>
        <Container className={className} style={style} theme={theme}>
          <MainMenu theme={theme}/>
          
          <LeftBar theme={theme} editorTarget={undefined} editorConsole={undefined} messages={[]} settings={undefined} onClearConsole={function (): void {
            throw new Error('Function not implemented.');
          } } onIndentCode={function (): void {
            throw new Error('Function not implemented.');
          } } onDownloadCode={function (): void {
            throw new Error('Function not implemented.');
          } } onResetCode={function (): void {
            throw new Error('Function not implemented.');
          } } editorRef={undefined}/> 
        </Container>

      </HomeNavigationContainer>
    );
  }
}

export default connect((state: State) => ({
  locale: state.i18n.locale,
}), dispatch => ({
  onTutorialsClick: () => dispatch(push('/tutorials')),
  onSimulatorClick: () => dispatch(push('/scene/jbcSandboxA')),
}))(HomeNavigation) as React.ComponentType<HomeNavigationPublicProps>;