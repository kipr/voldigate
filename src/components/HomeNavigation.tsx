import * as React from 'react';
import MainMenu from '../components/MainMenu';
import LeftBar from '../components/LeftBar';
import LocalizedString from '../util/LocalizedString';
import ProgrammingLanguage from '../ProgrammingLanguage';
import { DARK, ThemeProps, LIGHT, Theme } from '../components/theme';
import { StyleProps } from '../style';
import { styled } from 'styletron-react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { State as ReduxState } from '../state';
import { Project } from '../types/projectTypes';
import { User } from '../types/userTypes';
import { InterfaceMode } from '../types/interfaceModes';

export interface HomeNavigationPublicProps extends RouteComponentProps, ThemeProps, StyleProps {
  propedUsers?: string[];
  onThemeChange: (theme: Theme) => void;
}

interface HomeNavigationPrivateProps {
  onTutorialsClick: () => void;
  onSimulatorClick: () => void;
  locale: LocalizedString.Language;
}

interface HomeNavigationState {
  isleftbaropen__: boolean;
  isPanelVisible: boolean;
  isAddNewProject: boolean;
  isAddNewFile: boolean;
  isReloadFiles: boolean;
  isLoadUserFiles?: boolean;
  isClickFile: boolean;
  deleteUserFlag?: boolean;
  rootDeleteUserFlag?: boolean;
  rootDownloadUserFlag?: boolean;
  deleteProjectFlag?: boolean;
  rootDeleteProjectFlag?: boolean;
  rootDownloadProjectFlag?: boolean;
  deleteFileFlag?: boolean;
  rootDeleteFileFlag?: boolean;
  rootDownloadFileFlag?: boolean;

  selectedProject: string;
  fileName: string;
  userName: string;
  projectName: string;
  fileType?: string;
  user: User;
  contextMenuUser_?: User;
  contextMenuFile_?: string;
  activeLanguage: ProgrammingLanguage;

  contextMenuProject_?: Project;

  updatedUsers: User[];
  loadedUserData?: Project[];

  theme: Theme;

}

type Props = HomeNavigationPublicProps & HomeNavigationPrivateProps;
type State = HomeNavigationState;

const HomeNavigationContainer = styled('div', (props: ThemeProps) => ({

  alignItems: 'left',
  justifyContent: 'center',
  width: '100%',
  height: '100vh',
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
}));

const LeftBarContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
  alignItems: 'left',
  justifyContent: 'center',
  width: '100vh',

  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
}));



class HomeNavigation extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isleftbaropen__: false,
      isPanelVisible: false,
      isAddNewProject: false,
      isAddNewFile: false,
      isReloadFiles: false,
      isClickFile: false,
      fileName: '',
      userName: '',
      activeLanguage: 'c',
      projectName: '',
      selectedProject: '',
      updatedUsers: [],
      theme: localStorage.getItem('ideEditorDarkMode') === 'true' ? DARK : LIGHT,
      user: null,
    };

  }

  componentDidMount(): void {
    console.log("HomeNav compDidMount state: ", this.state);
  }

  componentDidUpdate = async (prevProps: Props, prevState: State) => {

    if (prevState.isAddNewFile !== this.state.isAddNewFile) {
      this.setState({ isReloadFiles: true });
    }
    if (prevState.userName !== this.state.userName) {
      this.setState({
        isLoadUserFiles: false
      })
    }
  }

  /**
   * Theme change handler
   * @param theme - The theme to be set
   */
  private onThemeChange_ = (theme: Theme) => {
    this.props.onThemeChange(theme);
    this.setState({ theme: theme });
  }

  render() {
    const { state } = this;
    const {

      theme
    } = state;


    return (
      <HomeNavigationContainer theme={theme}>

        <MainMenu theme={theme} locale={'en-US'}/>
        <LeftBarContainer theme={theme}>
          <LeftBar theme={theme}
            onThemeChange={this.onThemeChange_}
          />

        </LeftBarContainer>

      </HomeNavigationContainer>
    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale,
}), dispatch => ({
  onTutorialsClick: () => dispatch(push('/tutorials')),
  onSimulatorClick: () => dispatch(push('/scene/jbcSandboxA')),
}))(HomeNavigation) as React.ComponentType<HomeNavigationPublicProps>;