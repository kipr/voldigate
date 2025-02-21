
import * as React from 'react';
import Dashboard from './pages/Dashboard';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';
import { State as ReduxState } from './state';
import { DARK, LIGHT, Theme } from './components/theme';


interface AppPrivateProps {

}

interface AppState {
  loading: boolean;
  storedTheme: Theme;
}

type Props = AppPrivateProps;
type State = AppState;

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      storedTheme: localStorage.getItem('ideEditorDarkMode') === 'true' ? DARK : LIGHT
    };
  }

  render() {
    return (
      <div style={{ overflow: 'hidden' }}>
        <Switch>
          <Route path="/" exact component={Dashboard} />
        </Switch>
      </div>
    );
  }
}

export default connect((state: ReduxState) => {
  return {

  };
}, dispatch => ({

}))(App) as React.ComponentType<AppPrivateProps>;