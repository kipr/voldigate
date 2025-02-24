import * as React from 'react';
import LocalizedString from '../util/LocalizedString';
import HomeNavigation from '../components/HomeNavigation';
import { StyleProps } from '../style';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { State as ReduxState } from '../state';
import { Theme, LIGHT, DARK, ThemeProps } from '../components/theme';
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

class Dashboard extends React.PureComponent<Props, State> {

  constructor(props: Props) {

    super(props);
    this.state = {
      storedTheme: localStorage.getItem('ideEditorDarkMode') === 'true' ? DARK : LIGHT
    };
  }

  private onThemeChange_ = (theme: Theme) => {

    this.setState({
      storedTheme: theme
    })
  };

  render() {
    const { props, state } = this;
    const { storedTheme } = state;
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