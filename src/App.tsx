
import * as React from 'react';


import { Route, Switch } from 'react-router';
import Dashboard from './pages/Dashboard';
import { connect } from 'react-redux';
import DocumentationWindow from './components/documentation/DocumentationWindow';
import { State as ReduxState } from './state';
import { DARK, LIGHT, Theme} from './components/theme';

export interface AppPublicProps  {

}

interface AppPrivateProps {
  login: () => void;
}

interface AppState {
  loading: boolean;
  storedTheme: Theme;
  
}

type Props = AppPublicProps & AppPrivateProps;
type State = AppState;

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      storedTheme: localStorage.getItem('ideEditorDarkMode') === 'true' ? DARK : LIGHT
    };
  }



  componentDidMount() {
    // const storedTheme = localStorage.getItem('ideEditorDarkMode');
 
    // console.log("App mount with storedTheme: ", storedTheme);
    console.log("App mount with storedTheme: ", this.state.storedTheme);
  
  }

  componentWillUnmount(): void {

  }

  render() {
    const { props, state } = this;

    const { loading, storedTheme } = state;


    return (
      <div style = {{overflow: 'hidden'}}>
        <Switch>
          <Route path="/" exact component={Dashboard} />
        </Switch>
        {/* <DocumentationWindow theme={storedTheme} /> */}
      </div>
    );
  }
}

export default connect((state: ReduxState) => {
  return {
    
  };
}, dispatch => ({
  
}))(App) as React.ComponentType<AppPublicProps>;