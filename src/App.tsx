
import * as React from 'react';


import { Route, Switch } from 'react-router';
import Loading from './components/Loading';
import Dashboard from './pages/Dashboard';
import { connect } from 'react-redux';
import DocumentationWindow from './components/documentation/DocumentationWindow';
import { State as ReduxState } from './state';
import { DARK } from './components/theme';

export interface AppPublicProps {

}

interface AppPrivateProps {
  login: () => void;
}

interface AppState {
  loading: boolean;
}

type Props = AppPublicProps & AppPrivateProps;
type State = AppState;

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true
    };
  }



  componentDidMount() {
  
  }

  componentWillUnmount(): void {

  }

  render() {
    const { props, state } = this;

    const { loading } = state;


    return (
      <>
        <Switch>
          <Route path="/" exact component={Dashboard} />
        </Switch>
        <DocumentationWindow theme={DARK} />
      </>
    );
  }
}

export default connect((state: ReduxState) => {
  return {
    
  };
}, dispatch => ({
  
}))(App) as React.ComponentType<AppPublicProps>;