import * as React from 'react';
import { DARK, ThemeProps, LIGHT, Theme } from '../components/theme';
import { StyleProps } from '../style';
import { styled } from 'styletron-react';
import MainMenu from '../components/MainMenu';
import LeftBar from '../components/LeftBar';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import LocalizedString from '../util/LocalizedString';
import { State as ReduxState } from '../state';
import ProgrammingLanguage from '../ProgrammingLanguage';


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
  selectedProject: string;
  fileName: string;
  userName: string;
  activeLanguage: ProgrammingLanguage;
  projectName: string;
  fileType?: string;

  contextMenuUser_?: string;
  deleteUserFlag?: boolean;
  rootDeleteUserFlag?: boolean;
  rootDownloadUserFlag?: boolean;

  contextMenuProject_?: Project;
  deleteProjectFlag?: boolean;
  rootDeleteProjectFlag?: boolean;
  rootDownloadProjectFlag?: boolean;

  contextMenuFile_?: string;
  deleteFileFlag?: boolean;
  rootDeleteFileFlag?: boolean;
  rootDownloadFileFlag?: boolean;


  updatedUsers: [];
  loadedUserData?: Project[];

  theme: Theme;

}
type Project = {
  projectName: string;
  binFolderFiles: string[];
  includeFolderFiles: string[];
  srcFolderFiles: string[];
  dataFolderFiles: string[];
  projectLanguage: ProgrammingLanguage;
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

  componentDidMount(): void {
    console.log('Inside componentDidMount in HomeNavigation.tsx with state:', this.state);


  }

  async initializeRepo() {

  }
  componentDidUpdate = async (prevProps: Props, prevState: State) => {
    console.log('Inside componentDidUpdate in HomeNavigation.tsx with state:', this.state);

    if (prevState.isAddNewFile !== this.state.isAddNewFile) {
      console.log("HomeNav compDidUpdate prevState isAddNewFile is different -> Need to reload Files in FileExplorer");
      this.setState({ isReloadFiles: true });
    }
    if (prevState.userName !== this.state.userName) {
      console.log("HomeNav compDidUpdate userName changed to:", this.state.userName);
      this.setState({
        isLoadUserFiles: false
      }, () => {
        console.log("HomeNav compDidUpdate isLoadUserFiles: ", this.state.isLoadUserFiles);
      })
    }
  }

  private toggleLeftBar_ = () => {
    this.setState((prevState) => ({
      isleftbaropen__: !prevState.isleftbaropen__,
      isPanelVisible: !prevState.isPanelVisible,
    }));
  };

  private onProjectSelected = (userName: string, projectName: string, fileName: string, activeLanguage: ProgrammingLanguage, fileType: string) => {
    console.log("Selected project:", projectName);
    console.log("Selected file:", fileName);
    console.log("Selected language:", activeLanguage);
    console.log("onProjectSelected selected fileType:", fileType);

    console.log("onProjectSelected current state:", this.state);
    console.log("previous state fileName:", this.state.fileName);


    this.setState({
      userName,
      projectName,
      fileName: fileName,
      activeLanguage: activeLanguage,
      selectedProject: projectName
    }, () => {
      console.log('Inside onProjectSelected in HomeNavigation.tsx with state:', this.state);
    });

  };

  private onFileSelected = (selectedUserName: string, selectedProjectName: string, selectedFileName: string, selectedLanguage: ProgrammingLanguage, selectedFileType: string) => {
    console.log("onFileSelected Selected project:", selectedProjectName);
    console.log("onFileSelected Selected file:", selectedFileName);
    console.log("onFileSelected Selected language:", selectedLanguage);
    console.log("onFileSelected Selected fileType:", selectedFileType);

    console.log("onFileSelected current state:", this.state);
    console.log("onFileSelected previous state fileName:", this.state.fileName);

    this.setState({
      userName: selectedUserName,
      projectName: selectedProjectName,
      fileName: selectedFileName,
      activeLanguage: selectedLanguage,
      fileType: selectedFileType,
      isClickFile: true
    }, () => {
      console.log('Inside onFileSelected in HomeNavigation.tsx with state:', this.state);
    });

  };

  private onChangeProjectName_ = (projectName: string) => {

    console.log("onChangeProjectName_ projectName:", projectName);
    this.setState({
      projectName
    });
  }
  private onAddNewProject_ = (userName: string) => {

    console.log("homeNavigation onAddNewProject_ passed userName:", userName);
    console.log("homeNav onAddNewProject_ state: ", this.state);

    this.setState({
      isAddNewProject: true,
      userName: userName,
    });

  };

  private onAddNewFile_ = (userName: string, projectName: string, activeLanguage: ProgrammingLanguage, fileType: string) => {
    console.log("homeNavigation onAddNewFile_ passed userName:", userName);
    console.log("homeNavigation onAddNewFile_ passed projectName:", projectName);
    console.log("homeNavigation onAddNewFile_ passed activeLanguage:", activeLanguage);
    console.log("homeNavigation onAddNewFile_ passed fileType: ", fileType);
    this.setState({
      isAddNewFile: true,
      userName: userName,
      activeLanguage: activeLanguage,
      projectName: projectName,
      fileType: fileType
    });
  };

  private setAddNewProject_ = (isAddNewProject: boolean) => {
    this.setState({
      isAddNewProject: isAddNewProject
    });

    console.log("setAddNewProject_ isAddNewProject:", isAddNewProject);
  }

  private setAddNewFile_ = (isAddNewFile: boolean) => {
    this.setState({
      isAddNewFile: isAddNewFile
    });

    console.log("setAddNewFile_ isAddNewFile:", isAddNewFile);
  }

  private setClickFile_ = (isClickFile: boolean) => {
    this.setState({
      isClickFile: isClickFile
    });

    if (isClickFile == false) {
      this.setState({
        fileName: ''
      })
    }
    console.log("setClickFile_ isClickFile:", isClickFile);
  }

  private onUserSelected = (userName: string, loadUserData: boolean) => {
    console.log("HomeNav onUserSelected previous username:", this.state.userName);
    console.log("HomeNav onUserSelected: ", userName);
    try {
      if (this.state.userName != userName) {
        this.setState({
          isLoadUserFiles: false
        }, () => {
          console.log("HomeNav onUserSelected changed isLoadUserFiles flag to:", this.state.isLoadUserFiles);
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
      }, () => {
        console.log("HomeNav onUserSelected new userName:", this.state.userName);
      });
    }
    catch (error) {
      console.error(error);
    }

  };

  private onUserUpdate_ = (users: []) => {
    console.log("HomeNav onUserUpdate users:", users);
    this.setState({
      updatedUsers: users
    })
  }

  private onLoadUserData_ = (userData: Project[]) => {

    console.log("HomeNav onLoadUserData_ userData: ", userData);
    this.setState({
      loadedUserData: userData
    })
  }

  private onDeleteUser_ = (user: string, deleteUserFlag: boolean) => {

    console.log("HomeNav onDeleteUser_ user: ", user, "with deleteUserFlag: ", deleteUserFlag);
    this.setState({
      contextMenuUser_: user,
      rootDeleteUserFlag: deleteUserFlag
    })
  }

  private onDeleteProject_ = (userName: string, project: Project, deleteProjectFlag: boolean) => {

    console.log("HomeNav onDeleteProject_ project: ", project, "with deleteProjectFlag: ", deleteProjectFlag);
    this.setState({
      userName: userName,
      contextMenuProject_: project,
      rootDeleteProjectFlag: deleteProjectFlag
    })
  }

  private onDeleteFile_ = (userName: string, project: string, file: string, deleteFileFlag: boolean) => {

    console.log("HomeNav onDeleteFile_ file: ", file, "with deleteFileFlag: ", deleteFileFlag);
    this.setState({
      userName: userName,
      projectName: project,
      contextMenuFile_: file,
      rootDeleteFileFlag: deleteFileFlag
    })
  }

  private onDownloadUser_ = (user: string) => {

    console.log("HomeNav onDownloadUser_ user: ", user);
    this.setState({
      contextMenuUser_: user,
      rootDownloadUserFlag: true

    })
  }

  private onDownloadProject_ = (userName: string, project: Project) => {

    console.log("HomeNav onDownloadProject_ project: ", project);
    this.setState({
      userName: userName,
      contextMenuProject_: project,
      rootDownloadProjectFlag: true

    })
  }

  private onDownloadFile_ = (userName: string, project: string, file: string) => {

    console.log("HomeNav onDownloadFile_ file: ", file);
    this.setState({
      userName: userName,
      projectName: project,
      contextMenuFile_: file,
      rootDownloadFileFlag: true

    })
  }

  private onSetUserDeleteFlag_ = (deleteUserFlag: boolean) => {
    console.log("HomeNav onSetUserDeleteFlag_ deleteUserFlag: ", deleteUserFlag);
    this.setState({
      rootDeleteUserFlag: deleteUserFlag,
      contextMenuUser_: undefined
    })
  }

  private onSetProjectDeleteFlag_ = (deleteProjectFlag: boolean) => {
    console.log("HomeNav onSetProjectDeleteFlag_ deleteProjectFlag: ", deleteProjectFlag);
    this.setState({
      rootDeleteProjectFlag: deleteProjectFlag,
      contextMenuProject_: undefined
    })
  }

  private onSetFileDeleteFlag_ = (deleteFileFlag: boolean) => {
    console.log("HomeNav onSetFileDeleteFlag_ deleteFileFlag: ", deleteFileFlag);
    this.setState({
      rootDeleteFileFlag: deleteFileFlag,
      contextMenuProject_: undefined
    })
  }

  private onSetUserDownloadFlag_ = (downloadUserFlag: boolean) => {
    console.log("HomeNav onSetUserDownloadFlag_ downloadUserFlag: ", downloadUserFlag);
    this.setState({
      rootDownloadUserFlag: downloadUserFlag,
      contextMenuUser_: undefined
    })
  }

  private onSetProjectDownloadFlag_ = (downloadProjectFlag: boolean) => {
    console.log("HomeNav onSetProjectDownloadFlag_ downloadProjectFlag: ", downloadProjectFlag);
    this.setState({
      rootDownloadProjectFlag: downloadProjectFlag,
      contextMenuProject_: undefined
    })
  }

  private onSetFileDownloadFlag_ = (downloadFileFlag: boolean) => {
    console.log("HomeNav onSetFileDownloadFlag_ downloadFileFlag: ", downloadFileFlag);
    this.setState({
      rootDownloadFileFlag: downloadFileFlag,
      contextMenuFile_: undefined
    })
  }

  private onSetFileName_ = (fileName: string) => {
    console.log("HomeNav onSetFileName_ fileName: ", fileName);
    this.setState({
      fileName: fileName
    })
  }

  togglePanelVisibility = () => {
    console.log("Toggled");


  };

  private onThemeChange_ = (theme: Theme) => {
    console.log("HomeNav onThemeChange_ with theme: ", theme);
    this.props.onThemeChange(theme);

    this.setState({ theme: theme });


  }

  render() {
    const { props, state } = this;
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