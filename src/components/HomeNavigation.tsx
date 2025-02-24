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
  contextMenuUser_?: string;
  contextMenuFile_?: string;
  activeLanguage: ProgrammingLanguage;

  contextMenuProject_?: Project;

  updatedUsers: [];
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
      theme: localStorage.getItem('ideEditorDarkMode') === 'true' ? DARK : LIGHT

    };

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
     * Sets the isLoadUserFiles flag based on the user selected
     * @param userName - The username of the user
     * @param loadUserData - A boolean value to set the state isLoadUserFiles
     */
  private onUserSelected = (userName: string, loadUserData: boolean) => {
    try {
      if (this.state.userName != userName) {
        this.setState({
          isLoadUserFiles: false
        })
      }
    }
    catch (error) {
      console.error(error);
    }

    try {

      this.setState({
        userName,
        isLoadUserFiles: loadUserData
      });
    }
    catch (error) {
      console.error(error);
    }

  };

  /**
   * Receives the updated list of users and sets the state updatedUsers
   * @param users - The list of users
   */
  private onUserUpdate_ = (users: []) => {
    this.setState({
      updatedUsers: users
    })
  };

  /**
   * Sets the state loadedUserData based on the list of projects
   * @param userData - The list of projects
   */
  private onLoadUserData_ = (userData: Project[]) => {
    this.setState({
      loadedUserData: userData
    })
  };

  /**
 * Sets the Root state's deleteUserFlag based on the user selected to be deleted
 * @param user - The username of the user
 * @param deleteUserFlag - A boolean value to set the state deleteUserFlag
 */
  private onDeleteUser_ = (user: string, deleteUserFlag: boolean) => {
    this.setState({
      contextMenuUser_: user,
      rootDeleteUserFlag: deleteUserFlag
    })
  };

  /**
   * Sets the Root state's downloadUserFlag based on the user selected to be downloaded
   * @param user - The username of the user
   */
  private onDownloadUser_ = (user: string) => {
    this.setState({
      contextMenuUser_: user,
      rootDownloadUserFlag: true
    })
  };

  /**
   * Sets the Root state's deleteUserFlag to given boolean value
   * @param deleteUserFlag - A boolean value to set the state deleteUserFlag
   */
  private onSetUserDownloadFlag_ = (downloadUserFlag: boolean) => {
    this.setState({
      rootDownloadUserFlag: downloadUserFlag,
      contextMenuUser_: undefined
    })
  };

  /**
   * Sets the Root state's deleteUserFlag to given boolean value
   * @param deleteUserFlag - A boolean value to set the state deleteUserFlag
   */
  private onSetUserDeleteFlag_ = (deleteUserFlag: boolean) => {
    this.setState({
      rootDeleteUserFlag: deleteUserFlag,
      contextMenuUser_: undefined
    })
  };

  /**
   * Sets the state based on the project selected from File Explorer
   * @param userName - The username of the user
   * @param projectName - The name of the project
   * @param fileName - The name of the file
   * @param activeLanguage - The programming language of the project
   * @param fileType - The type of file (header, source, data)
   */
  private onProjectSelected = (userName: string, projectName: string, fileName: string, activeLanguage: ProgrammingLanguage) => {

    this.setState({
      userName,
      projectName,
      fileName: fileName,
      activeLanguage: activeLanguage,
      selectedProject: projectName
    });

  };

  /**
   * Sets the state based on the project name
   * @param projectName - The name of the project
   */
  private onChangeProjectName_ = (projectName: string) => {
    this.setState({
      projectName
    });
  };

  /**
   * Sets the state userName based on the user selected and sets isAddNewProject flag to true
   * @param userName - The username of the user
   */
  private onAddNewProject_ = (userName: string) => {
    this.setState({
      isAddNewProject: true,
      userName: userName,
    });

  };

  /**
   * Resets isAddNewProject flag to given boolean value
   * @param isAddNewProject - A boolean value to set the state isAddNewProject
   */
  private setAddNewProject_ = (isAddNewProject: boolean) => {
    this.setState({
      isAddNewProject: isAddNewProject
    });
  };

  /**
   * Sets the user and project to be deleted based on the user and project selected
   * @param userName - The username of the user
   * @param project - The project to be deleted
   * @param deleteProjectFlag - A boolean value to set the state rootDeleteProjectFlag
   */
  private onDeleteProject_ = (userName: string, project: Project, deleteProjectFlag: boolean) => {
    this.setState({
      userName: userName,
      contextMenuProject_: project,
      rootDeleteProjectFlag: deleteProjectFlag
    })
  };

  /**
   * Sets the user and project to be downloaded based on the user and project selected
   * @param userName - The username of the user
   * @param project - The project to be downloaded
   */
  private onDownloadProject_ = (userName: string, project: Project) => {
    this.setState({
      userName: userName,
      contextMenuProject_: project,
      rootDownloadProjectFlag: true
    })
  };

  /**
   * Sets Root's deleteProjectFlag to given boolean value
   * @param deleteProjectFlag - A boolean value to set the state rootDeleteProjectFlag
   */
  private onSetProjectDeleteFlag_ = (deleteProjectFlag: boolean) => {
    this.setState({
      rootDeleteProjectFlag: deleteProjectFlag,
      contextMenuProject_: undefined
    })
  };

  /**
   * Sets Root's downloadProjectFlag to given boolean value
   * @param downloadProjectFlag - A boolean value to set the state rootDownloadProjectFlag
   */
  private onSetProjectDownloadFlag_ = (downloadProjectFlag: boolean) => {
    this.setState({
      rootDownloadProjectFlag: downloadProjectFlag,
      contextMenuProject_: undefined
    })
  };

  /**
   * Sets the state values based on the file selected from File Explorer
   * @param selectedUserName - The username of the user
   * @param selectedProjectName - The name of the project
   * @param selectedFileName - The name of the file
   * @param selectedLanguage - The programming language of the project
   * @param selectedFileType - The type of file (header, source, data)
   */
  private onFileSelected = (selectedUserName: string, selectedProjectName: string, selectedFileName: string, selectedLanguage: ProgrammingLanguage, selectedFileType: string) => {
    this.setState({
      userName: selectedUserName,
      projectName: selectedProjectName,
      fileName: selectedFileName,
      activeLanguage: selectedLanguage,
      fileType: selectedFileType,
      isClickFile: true
    });
  };

  /**
   * Sets the state values based on the file to be added and sets isAddNewFile flag to true
   * @param userName - The username of the user
   * @param projectName - The name of the project
   * @param activeLanguage - The programming language of the project
   * @param fileType - The type of file (header, source, data)
   */
  private onAddNewFile_ = (userName: string, projectName: string, activeLanguage: ProgrammingLanguage, fileType: string) => {
    this.setState({
      isAddNewFile: true,
      userName: userName,
      activeLanguage: activeLanguage,
      projectName: projectName,
      fileType: fileType
    });
  };

  /**
   * Sets the state isAddNewFile flag to given boolean value
   * @param isAddNewFile - A boolean value to set the state isAddNewFile
   */
  private setAddNewFile_ = (isAddNewFile: boolean) => {
    this.setState({
      isAddNewFile: isAddNewFile
    });
  };

  /**
   * Sets state isClickFile flag to given boolean value
   * @param isClickFile - A boolean value to set the state isClickFile
   */
  private setClickFile_ = (isClickFile: boolean) => {
    this.setState({
      isClickFile: isClickFile
    });

    if (isClickFile == false) {
      this.setState({
        fileName: ''
      })
    }
  };

  /**
   * Sets the state values based on the file to be deleted
   * @param userName - The username of the user of file to be deleted
   * @param project - The project to be deleted of file to be deleted
   * @param file - The file to be deleted
   * @param deleteFileFlag - A boolean value to set the state rootDeleteFileFlag
   */
  private onDeleteFile_ = (userName: string, project: string, file: string, deleteFileFlag: boolean) => {
    this.setState({
      userName: userName,
      projectName: project,
      contextMenuFile_: file,
      rootDeleteFileFlag: deleteFileFlag
    })
  }

  /**
   * 
   * @param userName - The username of the user of file to be downloaded
   * @param project - The project of file to be downloaded  
   * @param file - The file to be downloaded
   */
  private onDownloadFile_ = (userName: string, project: string, file: string) => {
    this.setState({
      userName: userName,
      projectName: project,
      contextMenuFile_: file,
      rootDownloadFileFlag: true

    })
  }

  /**
   * Sets the Root state's deleteFileFlag to given boolean value
   * @param deleteFileFlag - A boolean value to set the state rootDeleteFileFlag
   */
  private onSetFileDeleteFlag_ = (deleteFileFlag: boolean) => {
    this.setState({
      rootDeleteFileFlag: deleteFileFlag,
      contextMenuProject_: undefined
    })
  }

  /**
   * Sets the Root state's downloadFileFlag to given boolean value
   * @param downloadFileFlag - A boolean value to set the state rootDownloadFileFlag
   */
  private onSetFileDownloadFlag_ = (downloadFileFlag: boolean) => {
    this.setState({
      rootDownloadFileFlag: downloadFileFlag,
      contextMenuFile_: undefined
    })
  }

  /**
   * Sets the state fileName based on the file selected
   * @param fileName - The name of the file
   */
  private onSetFileName_ = (fileName: string) => {
    this.setState({
      fileName: fileName
    })
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
      activeLanguage,
      fileName,
      projectName,
      userName,
      isAddNewProject,
      isAddNewFile,
      isLoadUserFiles,
      isClickFile,
      isReloadFiles,
      fileType,
      updatedUsers,
      selectedProject,
      loadedUserData,
      contextMenuUser_,
      contextMenuFile_,
      deleteUserFlag,
      rootDeleteUserFlag,
      contextMenuProject_,
      rootDeleteProjectFlag,
      rootDeleteFileFlag,
      rootDownloadUserFlag,
      rootDownloadProjectFlag,
      rootDownloadFileFlag,
      theme
    } = state;


    return (
      <HomeNavigationContainer theme={theme}>

        <MainMenu theme={theme} />
        <LeftBarContainer theme={theme}>
          <LeftBar theme={theme}
            propedSelectedProjectName={this.state.projectName}
            propedOnProjectSelected={this.onProjectSelected}
            propedOnFileSelected={this.onFileSelected}
            propedOnUserSelected={this.onUserSelected}
            propedOnAddNewProject={this.onAddNewProject_}
            propedOnAddNewFile={this.onAddNewFile_}
            propedOnDeleteUser={this.onDeleteUser_}
            propedOnDeleteProject={this.onDeleteProject_}
            propedOnDeleteFile={this.onDeleteFile_}
            propedOnDownloadUser={this.onDownloadUser_}
            propedOnDownloadProject={this.onDownloadProject_}
            propedOnDownloadFile={this.onDownloadFile_}
            propedAddProjectFlag={isAddNewProject}
            propedAddFileFlag={isAddNewFile}
            propedUserDeleteFlag={deleteUserFlag}
            propedReloadFilesFlag={isReloadFiles}
            propedUsers={updatedUsers}
            propedUserData={loadedUserData}


            rootSelectedProject={selectedProject}
            rootIsLeftBarOpen={this.state.isleftbaropen__}
            rootFileName={fileName}
            rootProjectName={projectName}
            rootActiveLanguage={activeLanguage}
            rootUserName={userName}
            rootContextMenuUser={contextMenuUser_}
            rootContextMenuProject={contextMenuProject_}
            rootContextMenuFile={contextMenuFile_}
            rootAddNewProject={isAddNewProject}
            rootAddNewFile={isAddNewFile}
            rootClickFile={isClickFile}
            rootOtherFileType={fileType}
            rootSetAddNewProject={this.setAddNewProject_}
            rootSetAddNewFile={this.setAddNewFile_}
            rootSetClickFile={this.setClickFile_}
            rootSetFileName_={this.onSetFileName_}
            rootChangeProjectName={this.onChangeProjectName_}
            rootOnUserUpdate={this.onUserUpdate_}
            rootLoadUserDataFlag={isLoadUserFiles}
            rootOnLoadUserData={this.onLoadUserData_}
            rootDeleteUserFlag={rootDeleteUserFlag}
            rootDeleteProjectFlag={rootDeleteProjectFlag}
            rootDeleteFileFlag={rootDeleteFileFlag}
            rootDownloadUserFlag={rootDownloadUserFlag}
            rootDownloadProjectFlag={rootDownloadProjectFlag}
            rootDownloadFileFlag={rootDownloadFileFlag}
            rootSetDeleteUserFlag={this.onSetUserDeleteFlag_}
            rootSetDeleteProjectFlag={this.onSetProjectDeleteFlag_}
            rootSetDeleteFileFlag={this.onSetFileDeleteFlag_}
            rootSetDownloadUserFlag={this.onSetUserDownloadFlag_}
            rootSetDownloadProjectFlag={this.onSetProjectDownloadFlag_}
            rootSetDownloadFileFlag={this.onSetFileDownloadFlag_}


            onThemeChange={this.onThemeChange_}

          >

          </LeftBar>

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