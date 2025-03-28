import * as React from 'react';
import SettingsDialog from './SettingsDialog';
import LocalizedString from '../util/LocalizedString';
import ProgrammingLanguage from 'ProgrammingLanguage';
import Root from './Root';
import KeepMotorsRunningDialog from './KeepMotorsRunningDialog';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Fa } from './Fa';
import { DARK, ThemeProps, LIGHT, Theme } from './theme';
import { faCog, faFolderTree, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import { State as ReduxState } from '../state';
import { Modal } from '../pages/Modal';
import { Size } from './Widget';
import { FileExplorer } from './FileExplorer';
import { Slider } from './Slider';
import { BLANK_PROJECT, Project } from '../types/projectTypes';
import { User } from '../types/userTypes';
import { InterfaceMode } from '../types/interfaceModes';
import { JSX } from 'react';
import { MotorServoSensorDisplay } from './MotorServoSensorDisplay';
import { Motors, Servos, Sensors, ServoType, DEFAULT_MOTORS, DEFAULT_SERVOS } from '../types/motorServoSensorTypes';

export interface LeftBarPublicProps extends StyleProps, ThemeProps {

  onThemeChange: (theme: Theme) => void;
}

interface LeftBarPrivateProps {
  locale: LocalizedString.Language;
}

interface LeftBarState {
  modal: Modal;
  settings: Settings;
  activePanel: number;
  sidePanelSize: Size.Type;
  sliderSizes: [number, number];
  isPanelVisible: boolean;
  storedTheme: Theme;
  users: User[];
  user?: User;
  isLoadUserFiles?: boolean;
  isAddNewFile?: boolean;
  reloadUser?: boolean;
  activeLanguage?: ProgrammingLanguage;
  fileType?: string;
  project?: Project;
  rehighlightProject?: Project;
  rehighlightFile?: string;
  contextMenuUser?: User;
  contextMenuProject?: Project;
  contextMenuFile?: string;

  deleteUserFlag?: boolean;
  deleteProjectFlag?: boolean;
  deleteFileFlag?: boolean;
  downloadUserFlag?: boolean;
  renameUserFlag?: boolean;
  downloadProjectFlag?: boolean;
  downloadFileFlag?: boolean;
  renameProjectFlag?: boolean;
  addProjectFlag?: boolean;

  addFileFlag?: boolean;
  fileName?: string;
  isClickFile: boolean;
  isAddNewProject?: boolean;
  isLeftBarOpen?: boolean;
  isReloadFiles?: boolean;
  isReloadRootUserFiles?: boolean;
  renameFileFlag?: boolean;

  loadedUserData?: Project[];
  userShown?: User;
  panelSelection: string;

  motorPositions?: { [key: string]: number };
  servoPositions?: ServoType[];

}
//

type Props = LeftBarPublicProps & LeftBarPrivateProps;
type State = LeftBarState;

const Container = styled('div', (props: ThemeProps) => ({
  //backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
  height: '100vh',
  overflow: 'visible',
  lineHeight: '28px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',

  zIndex: 0,
  width: '100vw',
  flexGrow: 1,
}));

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const Item = styled('div', (props: ThemeProps & ClickProps) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  // borderRight: `1px solid ${props.theme.borderColor}`,

  paddingRight: '20px',
  //marginBottom: '70px',
  height: '45px',
  opacity: props.disabled ? '0.5' : '1.0',
  ':last-child': {
    borderRight: 'none'
  },
  fontWeight: 400,
  ':hover': props.onClick && !props.disabled ? {
    cursor: 'pointer',
    backgroundColor: props.theme.hoverOptionBackground
  } : {},
  userSelect: 'none',
  transition: 'background-color 0.2s, opacity 0.2s'
}));

const ItemIcon = styled(Fa, {
  paddingLeft: '8px',
  alignItems: 'center',
  height: '30px'
});
const LeftBarContainer = styled('div', (props: ThemeProps & ClickProps) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '50px',
  height: '100vh',
  flexShrink: 0,
  justifyContent: 'space-between',
  backgroundColor: props.theme.leftBarContainerBackground,
  //borderRight: `2px solid ${props.theme.borderColor}`,
  boxShadow: `5px 0 6px ${props.theme.borderColor}`,
}));

const FileExplorerContainer = styled('div', (props: ThemeProps & ClickProps) => ({
  flex: '1 1 0',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'visible',
  height: '100%',
  backgroundColor: props.theme.fileContainerBackground,
  borderRight: `2px solid ${props.theme.borderColor}`,
}));

const MotorServoSensorDisplayContainer = styled('div', (props: ThemeProps & ClickProps) => ({
  flex: '1 1 0',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  overflow: 'auto',
  height: '100%',

  backgroundColor: props.theme.fileContainerBackground,
  borderRight: `2px solid ${props.theme.borderColor}`,
  paddingBottom: '35px'
}));


export class LeftBar extends React.Component<Props, State> {

  private selectedFileRef: React.MutableRefObject<string>;
  private isClickedFileRef: React.MutableRefObject<boolean>;
  private clickTimeout: any;
  private clickInProgress: boolean = false;
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: Modal.NONE,
      settings: DEFAULT_SETTINGS,
      activePanel: 0,
      sidePanelSize: Size.Type.Minimized,
      sliderSizes: [10, 9],
      isPanelVisible: false,
      isClickFile: false,
      storedTheme: localStorage.getItem('ideEditorDarkMode') === 'true' ? DARK : LIGHT,
      users: [],
      user: {
        userName: '',
        interfaceMode: InterfaceMode.SIMPLE,
        projects: []
      },
      project: {
        projectName: '',
        includeFolderFiles: [],
        srcFolderFiles: [],
        dataFolderFiles: [],
        projectLanguage: 'c'
      },
      addFileFlag: false,
      addProjectFlag: false,
      panelSelection: '',
      motorPositions: DEFAULT_MOTORS

    }
    this.selectedFileRef = React.createRef();
    this.isClickedFileRef = React.createRef();

    this.isClickedFileRef.current = false;
    this.clickTimeout = null;

    this.clickInProgress = false;
  }

  async componentDidUpdate(prevProps: Props, prevState: State) {
    console.log("LeftBar compDidUPdate state: ", this.state);
    console.log("LeftBar compDidUPdate prevstate: ", prevState);
    console.log("LeftBar compDidUPdate prevProps: ", prevProps);
    console.log("LeftBar compDidUPdate props: ", this.props);

    if (prevState.sliderSizes !== this.state.sliderSizes) {
      console.log("LeftBar compDidUPdate sliderSizes changed from ", prevState.sliderSizes, " to ", this.state.sliderSizes);
      this.forceUpdate();
    }
    if (this.state.settings !== prevState.settings) {
      if (this.state.settings.ideEditorDarkMode) {
        this.setState({ storedTheme: DARK });
        this.props.onThemeChange(DARK);
      }
      else {
        this.setState({ storedTheme: LIGHT });
        this.props.onThemeChange(LIGHT);
      }
    }

    if (prevState.user !== this.state.user && (prevState.user !== undefined)) {
      console.log("LeftBar compDidUPdate user changed from ", prevState.user, " to ", this.state.user);
      this.setState({
        isLoadUserFiles: false
      })
    }

    if (prevState.isAddNewFile !== this.state.isAddNewFile) {
      console.log("LeftBar compDidUPdate isAddNewFile changed from ", prevState.isAddNewFile, " to ", this.state.isAddNewFile);
      this.setState({
        isReloadFiles: true
      })
    }

  }

  componentWillUnmount(): void {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }
  }
  /**
   * Settings change handler
   * @param changedSettings - Partial<Settings> - The settings that have been changed
   */
  private onSettingsChange_ = (changedSettings: Partial<Settings>) => {
    const nextSettings: Settings = {
      ...this.state.settings,
      ...changedSettings
    }
    this.props.onThemeChange(nextSettings.ideEditorDarkMode ? DARK : LIGHT);
    this.setState({ settings: nextSettings });
  };

  private onModalClick_ = (modal: Modal) => () => this.setState({ modal });
  private onModalClose_ = () => this.setState({ modal: Modal.NONE });

  /**
   * Toggle the visibility of the leftbar
   */
  private togglePanelVisibility = () => {
    this.setState((prevState) => {
      const newIsPanelVisible = !prevState.isPanelVisible;
      return {
        isPanelVisible: newIsPanelVisible,
      };
    });

  };


  private selectPanel = (panel: string) => {
    console.log("LeftBar selectPanel panel: ", panel);
    if (this.state.isPanelVisible) {

      if (panel !== this.state.panelSelection) {
        let newSizes: [number, number] = this.state.sliderSizes;
        if (panel === "motor_sensor_servo") {
          newSizes = [10, 9];
        }
        else if (panel === "fileExplorer") {
          newSizes = [5, 9];
        }
        this.setState({
          panelSelection: panel,
          sliderSizes: [...newSizes]
        })


      }
      else if (panel === "motor_sensor_servo") {
        console.log("motor_sensor_servo panel selected and visible");
        console.log("LeftBar motorPositions: ", this.state.motorPositions);
        console.log("LeftBar DEFAULT_MOTORS: ", DEFAULT_MOTORS);
        if (JSON.stringify(this.state.motorPositions) === JSON.stringify(DEFAULT_MOTORS)) {
          console.log("motorPositions is default");
          this.setState({
            isPanelVisible: false
          })
        }
        else {
          console.log("motorPositions is NOT default");

          this.onModalClick_(Modal.KEEPMOTORSRUNNING)();
        }

        console.log("Current servoPositions: ", this.state.servoPositions);
        const hasEnabledServos = this.state.servoPositions.some(servo => servo.enable);
        console.log("Servo Positions: ", this.state.servoPositions);
        console.log("Has enabled servos: ", hasEnabledServos);

        this.setState({
          isPanelVisible: hasEnabledServos ? this.state.isPanelVisible : false
        }, () => {
          if (hasEnabledServos) {
            this.onModalClick_(Modal.KEEPMOTORSRUNNING)();
          }
        });



      }
      else {
        this.setState({
          isPanelVisible: false
        })
      }
    }
    else {
      console.log("LeftBar panel is not visible");
      let newSizes: [number, number] = this.state.sliderSizes;
      if (panel === "motor_sensor_servo") {
        newSizes = [11, 9];
      }
      else if (panel === "fileExplorer") {
        newSizes = [5, 9];
      }

      this.setState({
        sliderSizes: [...newSizes], // Update the slider sizes dynamically
        panelSelection: panel,
        isPanelVisible: true
      });
    }

  };


  private onKeepRunning_ = (keepRunningResponse: string) => {
    console.log("LeftBar onKeepRunning_ keepRunningResponse: ", keepRunningResponse);
    console.log("LeftBar onKeepRunning_ motorPositions: ", this.state.motorPositions);
    if (keepRunningResponse === "yes") {
      this.setState({
        isPanelVisible: false
      })
    }
    if (keepRunningResponse === "no") {
      this.setState({
        isPanelVisible: false,
        motorPositions: DEFAULT_MOTORS,
        servoPositions: DEFAULT_SERVOS
      })
    }
    this.onModalClose_();
  };
  private setSelectedFileRef_ = (fileName: string) => {
    console.log("LeftBar setSelectedFileRef_ fileName: ", fileName);
    this.selectedFileRef.current = fileName;
  };


  private setRootInfo_ = (user: User, project: Project, fileName: string, activeLanguage: ProgrammingLanguage) => {
    console.log("LeftBar setRootInfo_ user: ", user, " project: ", project, " fileName: ", fileName, " activeLanguage: ", activeLanguage);
    this.selectedFileRef.current = fileName;
    this.setState({
      userShown: user,
      project: project,
      fileName: fileName,
    })

  };

  private onUserUpdate_ = (users: User[]) => {
    console.log("LeftBar onUserUpdate_ users: ", users);
    if (JSON.stringify(this.state.users) !== JSON.stringify(users)) {
      this.setState({ users });
    }
    if (this.state.reloadUser) {
      this.setState({ reloadUser: false });
    }
  };

  private onUserSelected_ = (user: User, loadUserData: boolean) => {
    try {
      if (this.state.user !== user) {
        this.setState({ isLoadUserFiles: false });
      }
    }
    catch (error) {
      console.error('Error selecting user:', error);
    }

    try {
      this.setState({
        user: user,
        isLoadUserFiles: loadUserData
      });
    }
    catch (error) {
      console.error('Error selecting user:', error);
    }
  };

  /**
   * Sets the state loadedUserData based on the list of projects
   * @param userData - The list of projects
   */
  private onLoadUserData_ = (userData: Project[], loadedUser: User, renamedUser?: boolean, oldUserName?: string) => {
    console.log("LeftBar onLoadUserData_ userData: ", userData);
    console.log("LeftBar onLoadUserData_ loadedUser: ", loadedUser);
    console.log("LeftBar onLoadUserData_ state: ", this.state);


    if (loadedUser) {

      let userIndex: number;
      if (renamedUser) {
        console.log("LeftBar onLoadUserData_ renamedUser: ", renamedUser, "with oldUserName: ", oldUserName);
        userIndex = this.state.users.findIndex(user => user.userName === oldUserName);
        console.log("LeftBar onLoadUserData_ userIndex: ", userIndex);
        if (userIndex !== -1) { // Check if the user exists in the list
          this.setState(prevState => (
            console.log("LeftBar onLoadUserData_ prevState: ", prevState),
            {
              user: loadedUser,
              loadedUserData: userData,
              isReloadRootUserFiles: false,

              users: prevState.users.map((user, index) =>
                index === userIndex
                  ? loadedUser // Update the user's projects
                  : user // Keep the other users unchanged
              ),
              userShown: loadedUser
            }), () => {
              console.log("LeftBar onLoadUserData_ AFTER state: ", this.state);
            });
        }


      }
      else {
        userIndex = this.state.users.findIndex(user => user.userName === loadedUser.userName);

        if (userIndex !== -1) { // Check if the user exists in the list
          this.setState(prevState => (
            console.log("LeftBar onLoadUserData_ prevState: ", prevState),
            {
              user:loadedUser,
              loadedUserData: userData,
              isReloadRootUserFiles: false,

              users: prevState.users.map((user, index) =>
                index === userIndex
                  ? { ...user, projects: userData } // Update the user's projects
                  : user // Keep the other users unchanged
              )
            }), () => {
              console.log("LeftBar onLoadUserData_ AFTER state: ", this.state);
            });
        }
      }

      if (this.state.userShown) {
        if (this.state.userShown.userName === loadedUser.userName) {
          console.log("LeftBar onLoadUserData_ userShown: ", this.state.userShown);
          this.setState({
            userShown: {
              ...this.state.userShown,
              projects: userData
            }
          })
        }
      }
    }
    else {
      this.setState({
        user: {
          ...this.state.user,
          projects: userData
        },
        loadedUserData: userData,
        isReloadRootUserFiles: false
      });
    }

  };

  /**
 * Sets the Root state's deleteUserFlag to given boolean value
 * @param deleteUserFlag - A boolean value to set the state deleteUserFlag
 */
  private onSetUserDeleteFlag_ = (deleteUserFlag: boolean) => {
    this.setState({
      deleteUserFlag: deleteUserFlag,
      contextMenuUser: undefined
    });
  };

  /**
   * Sets the Root state's deleteUserFlag to given boolean value
   * @param deleteUserFlag - A boolean value to set the state deleteUserFlag
   */
  private onSetUserDownloadFlag_ = (downloadUserFlag: boolean) => {
    this.setState({
      downloadUserFlag: downloadUserFlag,
      contextMenuUser: undefined
    });

  };

  /**
 * Sets the Root state's deleteUserFlag based on the user selected to be deleted
 * @param user - The User object
 * @param deleteUserFlag - A boolean value to set the state deleteUserFlag
 */
  private onDeleteUser_ = (user: User, deleteUserFlag: boolean) => {
    this.setState({
      contextMenuUser: user,
      deleteUserFlag: deleteUserFlag
    });
  };

  /**
   * Sets the Root state's downloadUserFlag based on the user selected to be downloaded
   * @param user - The User object
   */
  private onDownloadUser_ = (user: User) => {
    this.setState({
      contextMenuUser: user,
      downloadUserFlag: true
    });
  };

  private onRenameUser_ = (user: User) => {
    this.setState({
      contextMenuUser: user,
      renameUserFlag: true
    });
  }

  private reloadUser_ = async () => {

    this.setState({
      reloadUser: true
    })
  };

  private reloadRootUserProjects_ = async () => {
    console.log("LeftBar reloadUserProjects_ loadedUserData: ", this.state.loadedUserData);
    console.log("LeftBar reloadUserProjects isloadUserFiles: ", this.state.isLoadUserFiles);

    this.setState({
      isReloadRootUserFiles: true
    })
  };


  private onSetRenameUserFlag_ = (renameUserFlag: boolean, renamedUser: User) => {
    if (renamedUser) {
      console.log("LeftBar onSetRenameUserFlag_ renamedUser: ", renamedUser);
      this.setState({
        user: renamedUser
      })
    }
    this.setState({
      renameUserFlag: renameUserFlag
    })
  };


  /**
   * Sets the state based on the project name
   * @param projectName - The name of the project
   */
  private onChangeProjectName_ = (projectName: string) => {
    this.setState({
      project: {
        ...this.state.project,
        projectName: projectName
      }
    });
  };


  /**
   * Sets the user and project to be deleted based on the user and project selected
   * @param user - The User object
   * @param project - The project to be deleted
   * @param deleteProjectFlag - A boolean value to set the state rootDeleteProjectFlag
   */
  private onDeleteProject_ = (user: User, project: Project, deleteProjectFlag: boolean) => {
    this.setState({
      user: user,
      contextMenuProject: project,
      deleteProjectFlag: deleteProjectFlag
    });
  };

  /**
   * Sets the user and project to be downloaded based on the user and project selected
   * @param user - The User object
   * @param project - The project to be downloaded
   */
  private onDownloadProject_ = (user: User, project: Project) => {
    this.setState({
      user: user,
      contextMenuProject: project,
      downloadProjectFlag: true
    });
  };

  private onRenameProject_ = (user: User, project: Project) => {
    this.setState({
      user: user,
      contextMenuUser: user,
      contextMenuProject: project,
      renameProjectFlag: true
    })

  }
  /**
   * Sets the state userName based on the user selected and sets isAddNewProject flag to true
   * @param user - The User object
   */
  private onAddNewProject_ = (user: User) => {
    console.log("LeftBar onAddNewProject_ user: ", user);
    this.setState({
      isAddNewProject: true,
      user: user
    });

  };


  /**
   * Resets isAddNewProject flag to given boolean value
   * @param isAddNewProject - A boolean value to set the state isAddNewProject
   */
  private setAddNewProject_ = (isAddNewProject: boolean, newProj?: Project) => {
    if (newProj) {
      console.log("LeftBar setAddNewProject_ state: ", this.state);
      console.log("LeftBar setAddNewProject_ newProj: ", newProj);
      this.selectedFileRef.current = newProj.srcFolderFiles[0];
      this.setState({
        rehighlightProject: newProj,
        project: newProj,
        fileName: newProj.srcFolderFiles[0]
      })
    }
    this.setState({
      isAddNewProject: isAddNewProject
    });
  };


  /**
   * Sets the state based on the project selected from File Explorer
   * @param userName - The username of the user
   * @param projectName - The name of the project
   * @param fileName - The name of the file
   * @param activeLanguage - The programming language of the project
   * @param fileType - The type of file (header, source, data)
   */
  private onProjectSelected_ = (user: User, project: Project, fileName: string, activeLanguage: ProgrammingLanguage) => {

    this.setState({
      user: user,
      project: project,
      fileName: fileName,
      activeLanguage: activeLanguage,

    });

  };

  /**
   * Sets Root's deleteProjectFlag to given boolean value
   * @param deleteProjectFlag - A boolean value to set the state rootDeleteProjectFlag
   */
  private onSetProjectDeleteFlag_ = (deleteProjectFlag: boolean) => {
    this.setState({
      deleteProjectFlag: deleteProjectFlag,
      contextMenuProject: undefined
    });
  };


  /**
   * Sets Root's downloadProjectFlag to given boolean value
   * @param downloadProjectFlag - A boolean value to set the state rootDownloadProjectFlag
   */
  private onSetProjectDownloadFlag_ = (downloadProjectFlag: boolean) => {
    this.setState({
      downloadProjectFlag: downloadProjectFlag,
      contextMenuProject: undefined
    });
  };

  private onSetRenameProjectFlag_ = (renameProjectFlag: boolean, renamedProject: Project) => {
    if (renamedProject) {
      console.log("LeftBar onSetRenameProjectFlag_ renamedProject: ", renamedProject);
      this.setState({
        project: renamedProject
      })
    }
    this.setState({
      renameProjectFlag: renameProjectFlag
    })
  };


  private onSetSelectedProject_ = (project: Project, file: string) => {
    console.log("LeftBar onSetSelectedProject_ project: ", project, " file: ", file);
    this.setState({
      rehighlightProject: project,
      rehighlightFile: file
    });

  };

  private onResetHighlightFlag_ = () => {
    console.log("onResetHighlightFlag_ prevProps.rehighlightProject: ", this.state.rehighlightProject, " prevProps.rehighlightFile: ", this.state.rehighlightFile);
    this.setState((prevProps) => {
      return {
        rehighlightProject: BLANK_PROJECT,
        rehighlightFile: ''
      }

    });
  }

  private onAddNewFile_ = (user: User, project: Project, activeLanguage: ProgrammingLanguage, fileType: string) => {
    this.setState({
      isAddNewFile: true,
      user: user,
      activeLanguage: activeLanguage,
      fileType: fileType,
      project: project
    });

  };

  /**
 * Sets the state fileName based on the file selected
 * @param fileName - The name of the file
 */
  private onSetFileName_ = (fileName: string) => {
    this.setState({
      fileName: fileName
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


  private onDeleteFile_ = (user: User, project: Project, fileName: string, deleteFileFlag: boolean) => {
    console.log("LeftBar onDeleteFile_ user: ", user, " project: ", project, " fileName: ", fileName, " deleteFileFlag: ", deleteFileFlag);
    this.setState({
      user: user,
      project: project,
      contextMenuFile: fileName,
      deleteFileFlag: deleteFileFlag
    })
  };

  private onDownloadFile_ = (user: User, project: Project, fileName: string) => {
    console.log("LeftBar onDownloadFile_ user: ", user, " project: ", project, " fileName: ", fileName);
    this.setState({
      user: user,
      project: project,
      contextMenuFile: fileName,
      downloadFileFlag: true
    })
  };

  private onRenameFile_ = (user: User, project: Project, renameFile: string) => {
    this.setState({
      user: user,
      project: project,
      contextMenuUser: user,
      contextMenuProject: project,
      contextMenuFile: renameFile,
      renameFileFlag: true
    })

  }

  private onSetRenameFileFlag = (renameFileFlag: boolean, renameFile: string) => {
    if (renameFile) {
      console.log("LeftBar onSetRenameUserFlag_ renameFile: ", renameFile);
      this.selectedFileRef.current = renameFile;
      this.setState({
        fileName: renameFile
      })
    }
    this.setState({
      renameFileFlag: renameFileFlag
    })
  };
  
  /**
 * Sets the Root state's downloadFileFlag to given boolean value
 * @param downloadFileFlag - A boolean value to set the state rootDownloadFileFlag
 */
  private onSetFileDownloadFlag_ = (downloadFileFlag: boolean) => {
    this.setState({
      downloadFileFlag: downloadFileFlag,
      contextMenuFile: undefined
    })
  }

  /**
 * Sets the Root state's deleteFileFlag to given boolean value
 * @param deleteFileFlag - A boolean value to set the state rootDeleteFileFlag
 */
  private onSetFileDeleteFlag_ = (deleteFileFlag: boolean) => {
    this.setState({
      deleteFileFlag: deleteFileFlag,
      contextMenuProject: undefined
    })
  }

  private onFileSelected_ = async (user: User, project: Project, fileName: string, language: ProgrammingLanguage, fileType: string) => {
    console.log("LeftBar onFileSelected_ user: ", user, " project: ", project, " fileName: ", fileName, " language: ", language, " fileType: ", fileType);
    console.log("LeftBar before state: ", this.state);
    this.isClickedFileRef.current = true;
    this.setState({
      user: user,
      project: project,
      fileName: fileName,
      activeLanguage: language,
      fileType: fileType,
      isClickFile: true,
      userShown: user
    }, () => {

      console.log("LeftBar onFileSelected_ state: ", this.state);

    })
  };

  /**
   * Sets state isClickFile flag to given boolean value
   * @param isClickFile - A boolean value to set the state isClickFile
   */
  private setClickFile_ = (isClickFile: boolean) => {
    console.log("LeftBar setClickFile_ isClickFile: ", isClickFile);
    //this.isClickedFileRef.current = isClickFile;
    this.setState({
      isClickFile: isClickFile
    });

  };

  private storeMotorPositions_ = (motorPositions: { [key: string]: number }) => {
    console.log("LeftBar storeMotorPositions_ motorPositions: ", motorPositions);
    this.setState({
      motorPositions: motorPositions
    });
  };

  private storeServoPositions_ = (servoPositions: ServoType[]) => {
    console.log("LeftBar storeServoPositions_ servoPositions: ", servoPositions);
    this.setState({
      servoPositions: servoPositions
    });
  }

  render() {
    const { className, theme } = this.props;

    const {
      settings,
      modal,
      sliderSizes,
      isPanelVisible,
      storedTheme,
      users,
      user,
      project,
      rehighlightProject,
      rehighlightFile,
      fileName,
      activeLanguage,
      loadedUserData,
      isReloadRootUserFiles,
      isLoadUserFiles,
      isClickFile,
      isAddNewFile,
      isAddNewProject,
      isLeftBarOpen,
      isReloadFiles,
      fileType,
      reloadUser,
      userShown,
      renameProjectFlag,
      renameUserFlag,
      renameFileFlag,

      downloadFileFlag,
      deleteFileFlag,
      deleteUserFlag,
      deleteProjectFlag,
      downloadUserFlag,
      downloadProjectFlag,
      addProjectFlag,
      addFileFlag,

      contextMenuFile,
      contextMenuProject,
      contextMenuUser,
      panelSelection

    } = this.state;

    let rootContent: JSX.Element;
    rootContent = (
      <div style={{ height: '80%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Root
          isLeftBarOpen={isLeftBarOpen}
          history={undefined}
          location={undefined}
          match={undefined}
          propedTheme={storedTheme}
          propFileName={fileName}
          propProject={project}
          propActiveLanguage={activeLanguage}
          propUser={user}
          propContextMenuUser={contextMenuUser}
          propContextMenuProject={contextMenuProject}
          propContextMenuFile={contextMenuFile}
          reloadUserFlag={reloadUser}
          reloadRootUserFlag={isReloadRootUserFiles}

          addNewProject={isAddNewProject}
          addNewFile={isAddNewFile}
          clickFile={isClickFile}
          otherFileType={fileType}
          setRootInfo={this.setRootInfo_}
          setAddNewProject={this.setAddNewProject_}
          setAddNewFile={this.setAddNewFile_}
          setClickFile={this.setClickFile_}
          setFileName_={this.onSetFileName_}
          changeProjectName={this.onChangeProjectName_}
          onUserUpdate={this.onUserUpdate_}
          loadUserDataFlag={isLoadUserFiles}
          onLoadUserData={this.onLoadUserData_}



          deleteUserFlag={deleteUserFlag}
          deleteProjectFlag={deleteProjectFlag}
          deleteFileFlag={deleteFileFlag}

          downloadUserFlag={downloadUserFlag}
          downloadProjectFlag={downloadProjectFlag}
          downloadFileFlag={downloadFileFlag}

          renameUserFlag={renameUserFlag}
          renameProjectFlag={renameProjectFlag}
          renameFileFlag={renameFileFlag}

          resetDeleteUserFlag={this.onSetUserDeleteFlag_}
          resetDeleteProjectFlag={this.onSetProjectDeleteFlag_}
          resetDeleteFileFlag={this.onSetFileDeleteFlag_}

          resetDownloadUserFlag={this.onSetUserDownloadFlag_}
          resetDownloadProjectFlag={this.onSetProjectDownloadFlag_}
          resetDownloadFileFlag={this.onSetFileDownloadFlag_}

          resetFileExplorerFileSelection={this.setSelectedFileRef_}
          resetFileExplorerProjectSelection={this.onSetSelectedProject_}
          resetRenameUserFlag={this.onSetRenameUserFlag_}
          resetRenameProjectFlag={this.onSetRenameProjectFlag_}
          resetRenameFileFlag={this.onSetRenameFileFlag}

          propedMotorPositions={this.state.motorPositions}
        />
      </div>
    )

    let fileExplorerContent: JSX.Element;

    fileExplorerContent = (
      console.log("LeftBar render() fileExplorerContent state: ", this.state),
      <FileExplorerContainer theme={storedTheme}>
        <FileExplorer
          theme={storedTheme}
          locale="en-US"
          propsSelectedProjectName={project.projectName}
          onProjectSelected={this.onProjectSelected_}
          onFileSelected={this.onFileSelected_}
          onUserSelected={this.onUserSelected_}
          onAddNewProject={this.onAddNewProject_}
          onAddNewFile={this.onAddNewFile_}
          onDeleteUser={this.onDeleteUser_}
          onDeleteProject={this.onDeleteProject_}
          onDeleteFile={this.onDeleteFile_}
          onDownloadUser={this.onDownloadUser_}
          onRenameUser={this.onRenameUser_}
          onDownloadProject={this.onDownloadProject_}
          onRenameProject={this.onRenameProject_}
          onDownloadFile={this.onDownloadFile_}
          onResetHighlightFlag={this.onResetHighlightFlag_}
          onReloadProjects={this.reloadRootUserProjects_}
          addProjectFlag={addProjectFlag}
          addFileFlag={isAddNewFile}
          onRenameFile={this.onRenameFile_}
          userDeleteFlag={deleteUserFlag}
          renameUserFlag={renameUserFlag}
          reloadFilesFlag={isReloadFiles}
          propUserShown={userShown}
          propUsers={users}
          propUserData={loadedUserData}
          propFileName={this.selectedFileRef.current}
          reloadUser={reloadUser}
          reHighlightProject={rehighlightProject}
          reHighlightFile={rehighlightFile}

          style={{
            flex: 1,
            width: `${sliderSizes[0] * 100}%`,
            height: '100%',

            zIndex: 1,
          }}

        />


      </FileExplorerContainer>
    );

    let motorServoSensorDisplay: JSX.Element;
    motorServoSensorDisplay = (
      console.log("LeftBar render() motorServoSensorDisplay state: ", this.state),
      <MotorServoSensorDisplayContainer theme={storedTheme}>
        <MotorServoSensorDisplay
          theme={storedTheme}
          locale="en-US"

          storeMotorPositions={this.storeMotorPositions_}
          getMotorPositions={() => this.state.motorPositions}
          storeServoPositions={this.storeServoPositions_}
          getServoPositions={() => this.state.servoPositions}

        />


      </MotorServoSensorDisplayContainer>
    );


    return (
      console.log("LeftBar render() state: ", this.state),
      <Container className={className} theme={storedTheme}>

        <LeftBarContainer theme={storedTheme} >
          <Item theme={storedTheme} onClick={() => this.selectPanel('fileExplorer')}>
            <ItemIcon icon={faFolderTree} />
          </Item>
          <Item style={{ marginTop: '15px' }} theme={storedTheme} onClick={() => this.selectPanel('motor_sensor_servo')}>
            <ItemIcon icon={faWaveSquare} />
          </Item>

          <Item style={{ marginBottom: '50px', marginTop: 'auto' }} theme={storedTheme} onClick={this.onModalClick_(Modal.SETTINGS)}>
            <ItemIcon icon={faCog} />
          </Item>


        </LeftBarContainer>
        <Slider
          // key={this.state.sliderSizes.join('-')}
          isVertical={true}
          theme={storedTheme}
          minSizes={[50, 0]}
          sizes={this.state.sliderSizes}
          visible={[isPanelVisible, true]}

        >
          {this.state.panelSelection === 'fileExplorer' ? fileExplorerContent : motorServoSensorDisplay}
          {rootContent}
        </Slider>


        {modal.type === Modal.Type.Settings && (
          <SettingsDialog
            theme={storedTheme}
            settings={settings}
            onSettingsChange={this.onSettingsChange_}
            reloadUser={this.reloadUser_}
            onClose={this.onModalClose_}
            users={users}
          />
        )}

        {modal.type === Modal.Type.KeepMotorsRunning && (
          <KeepMotorsRunningDialog
            theme={storedTheme}
            onClose={this.onModalClose_}
            onKeepRunning={this.onKeepRunning_}

          />
        )}


      </Container >

    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale
}))(LeftBar) as React.ComponentType<LeftBarPublicProps>;