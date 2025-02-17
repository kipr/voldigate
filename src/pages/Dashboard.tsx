import * as React from 'react';
import { DARK, ThemeProps } from '../components/theme';
import { StyleProps } from '../style';
import { styled } from 'styletron-react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import LocalizedString from '../util/LocalizedString';
import { State as ReduxState } from '../state';
import HomeNavigation from '../components/HomeNavigation';
import { Theme, LIGHT } from '../components/theme';

export interface DashboardPublicProps extends RouteComponentProps, ThemeProps, StyleProps {

}

interface DashboardPrivateProps {
  onTutorialsClick: () => void;
  onSimulatorClick: () => void;
  locale: LocalizedString.Language;

}

interface DashboardState {
  storedTheme: Theme;
}

type Props = DashboardPublicProps & DashboardPrivateProps;
type State = DashboardState;

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

class Dashboard extends React.PureComponent<Props, State> {

  constructor(props: Props) {

    super(props);
    this.state = {
      storedTheme: localStorage.getItem('ideEditorDarkMode') === 'true' ? DARK : LIGHT
    };
  }




  private onAboutClick_ = (event: React.MouseEvent) => {
    window.location.href = 'https://www.kipr.org/kipr/about-kipr';
  };

  private onThemeChange_ = (theme: Theme) => {
    console.log("Dashboard onThemeChange_ with theme: ", theme);  

  };
  componentDidMount(): void {
    console.log("Dashboard mount with state.storedTheme: ", this.state.storedTheme);
  }


  render() {
    const { props, state } = this;
    const { className, style, onTutorialsClick, onSimulatorClick, locale } = props;
    const { storedTheme } = state;
    console.log("Dashboard theme: ", storedTheme);
    return (
      <>

        <HomeNavigation
          theme={storedTheme}
          history={undefined}
          location={undefined}
          match={undefined}
          onThemeChange={this.onThemeChange_}>
        </HomeNavigation>
      </>

    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale,
}), dispatch => ({

}))(Dashboard) as React.ComponentType<DashboardPublicProps>;