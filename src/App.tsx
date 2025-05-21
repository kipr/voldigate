
import * as React from 'react';
import Dashboard from './pages/Dashboard';
import { connect } from 'react-redux';
import { State as ReduxState } from './state';
import { DARK, LIGHT, Theme } from './components/theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
      <div style={{ maxHeight: '100vh', maxWidth: '100vw' }}>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard history={undefined} location={undefined} match={undefined} theme={this.state.storedTheme} locale={'en-US'} />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default connect((state: ReduxState) => {
  return {

  };
}, dispatch => ({

}))(App) as React.ComponentType<AppPrivateProps>;