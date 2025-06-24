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
import { faCog, faFolderTree, faWaveSquare, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import { Modal } from '../pages/Modal';
import { Size } from './Widget';
import { Slider } from './Slider';
import { BLANK_PROJECT, Project, UploadedProject } from '../types/projectTypes';
import { User } from '../types/userTypes';
import { InterfaceMode } from '../types/interfaceModes';
import { JSX, Suspense } from 'react';
import { Motors, ServoType, Servos, DEFAULT_SENSORS, DEFAULT_MOTORS, DEFAULT_SERVOS, SensorValues, SensorSelectionKey, SensorSelection, MotorVelocities, MotorPositions, GraphSelectionKey, ServoPositions } from '../types/motorServoSensorTypes';
import { IvygateFileExplorer, MotorServoSensorDisplay } from 'ivygate';
import { useProgramRun } from '../ProgramRunContext';
import { FileInfo } from 'types/fileInfo';
import axios from 'axios';
const TerminalView = React.lazy(() => import('./TerminalView'));

export interface LeftBarPublicProps extends StyleProps, ThemeProps {
  onThemeChange: (theme: Theme) => void;
  isRunning: boolean;
  propedMotorVelocities?: MotorVelocities;
  propedMotorPositions?: MotorPositions;
  propedServoPositions?: ServoType[];
  setShouldStreamMotorVelocities?: (shouldStreamMotorVelocities: boolean) => void;
  setGraphSelection?: (graphSelection: GraphSelectionKey[]) => void;
  repollServos?: (repollServoFlag: boolean) => void;
  clearMotorPosition?: (motor: Motors) => void;
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
  toUploadUser?: User;
  toUploadProject?: Project | UploadedProject;
  toUploadFiles?: FileInfo[];

  deleteUserFlag?: boolean;
  deleteProjectFlag?: boolean;
  deleteFileFlag?: boolean;
  downloadUserFlag?: boolean;
  renameUserFlag?: boolean;
  downloadProjectFlag?: boolean;
  downloadFileFlag?: boolean;
  renameProjectFlag?: boolean;
  addProjectFlag?: boolean;
  simpleProjectLoadFlag?: boolean;
  toUploadProjectFlag?: boolean;
  toUploadFilesFlag?: boolean;

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
  stoppedMotor?: number;
  stoppedMotorFlag?: boolean;
  stoppedAllMotorsFlag?: boolean;
  motorView?: 'Power' | 'Velocity';

  motorVelocities?: MotorVelocities

  servoPositions?: ServoType[];
  enabledServo?: ServoType;
  disabledServos?: ServoType[];
  enabledServoFlag?: boolean;
  disabledServoFlag?: boolean;
  disableAllServosFlag?: boolean;

  sensorDisplayShown?: boolean;
  sensorSelection?: SensorSelectionKey[] | null;
  sensorValues?: SensorValues;
  analogValues?: number;
  digitalValues?: number;
  accelValues?: number;
  gyroValues?: number;
  magnetoValues?: number;
  buttonValues?: number;

  graphSelection?: GraphSelectionKey[] | null;

  screenWidth: number;

  terminalDisplayShown?: boolean;
}


type Props = LeftBarPublicProps & LeftBarPrivateProps;
type State = LeftBarState;


const LeftBarWrapper = (props: Props) => {
  const { isRunning } = useProgramRun();
  const [motorVelocities, setMotorVelocities] = React.useState<MotorVelocities>({});
  const [motorPositions, setMotorPositions] = React.useState<MotorPositions>({});
  const [servoPositions, setServoPositions] = React.useState<ServoType[]>([]);
  const [shouldStreamMotorVelocities, setShouldStreamMotorVelocities] = React.useState(false);
  const [graphSelection, setGraphSelection] = React.useState<GraphSelectionKey[]>([]);
  const [repollServos, setRepollServos] = React.useState(false);


  const clearMotorPosition = async (motor: Motors) => {
    const num = parseInt(motor.split(" ")[1]);
    await axios.post('/clear-motor-position', { motor: num });
    const tempPositions: MotorPositions = {};
    tempPositions[num] = 0; // Clear it
    setMotorPositions(prevPositions => ({
      ...prevPositions,
      [`Motor ${num}`]: 0 // Clear the specific motor position
    }));
  };

  const repollServosHandler = (flag: boolean) => {
    setRepollServos(flag);
  };

  React.useEffect(() => {

    if (!isRunning || !graphSelection.includes('MotorVelocities')) return;

    const motorEventVelocitySource = new EventSource('/stream-motor-velocities');

    motorEventVelocitySource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const tempVelocities: MotorVelocities = {};

      for (let i = 0; i < 4; ++i) {
        if (data[`motor${i}`] !== undefined) {
          tempVelocities[`Motor ${i}`] = data[`motor${i}`] / 65536.0;

        }
      }

      setMotorVelocities(tempVelocities);
    };

    motorEventVelocitySource.onerror = (error) => {
      console.error("Error in motor velocities event source: ", error);
      motorEventVelocitySource.close();
    };

    return () => {
      motorEventVelocitySource.close();
      setMotorVelocities({
        "Motor 0": 0,
        "Motor 1": 0,
        "Motor 2": 0,
        "Motor 3": 0,
      });
    };
  }, [isRunning, graphSelection]);

  // Effect for motor positions
  React.useEffect(() => {
    if (!graphSelection.includes('MotorPositions')) return;

    const motorEventPositionSource = new EventSource('/stream-motor-positions');

    motorEventPositionSource.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      const tempPositions: MotorPositions = {};

      for (let i = 0; i < 4; ++i) {
        const motorKey = `Motor ${i}`;
        if (data[`motor${i}`] !== undefined) {
          const motorName: Motors = motorKey as Motors;

          tempPositions[motorName] = data[`motor${i}`];
        }
      }

      setMotorPositions(tempPositions);
    };

    motorEventPositionSource.onerror = (error) => {
      console.error("Error in motor positions event source: ", error);
      motorEventPositionSource.close();
    };

    return () => {
      motorEventPositionSource.close();

    };
  }, [isRunning, graphSelection, clearMotorPosition]);


  // Effect for servo positions
  React.useEffect(() => {
    if (!graphSelection.includes('ServoGraphs')) return;
    const servoEventPositionSource = new EventSource('/stream-servo-positions');

    servoEventPositionSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const tempServos: ServoType[] = [];
      for (let i = 0; i < 4; ++i) {
        if (data[i] !== undefined) {
          tempServos[i] = {
            name: Servos[`SERVO${i}` as keyof typeof Servos],
            value: data[i].value,
            enable: data[i].enable,
          }
        }
      }

      setServoPositions(tempServos);

    };

    servoEventPositionSource.onerror = (error) => {
      console.error("Error in servo positions event source: ", error);
      servoEventPositionSource.close();
    };

    return () => {
      servoEventPositionSource.close();

    };
  }, [isRunning, graphSelection]);


  React.useEffect(() => {
    if (repollServos) {
      const servoEventPositionSource = new EventSource('/stream-servo-positions');

      servoEventPositionSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        const tempServos: ServoType[] = [];
        for (let i = 0; i < 4; ++i) {
          if (data[i] !== undefined) {
            tempServos[i] = {
              name: Servos[`SERVO${i}` as keyof typeof Servos],
              value: data[i].value,
              enable: data[i].enable,
            }
          }
        }

        setServoPositions(tempServos);
        setRepollServos(false);
        servoEventPositionSource.close();
      };

      servoEventPositionSource.onerror = (error) => {
        console.error("Error in servo positions event source: ", error);
        servoEventPositionSource.close();
        setRepollServos(false);
      };

      return () => {
        servoEventPositionSource.close();
      };
    }
  }, [repollServos]);


  return <LeftBar
    {...props}
    isRunning={isRunning}
    propedMotorVelocities={motorVelocities}
    propedMotorPositions={motorPositions}
    propedServoPositions={servoPositions}
    setShouldStreamMotorVelocities={setShouldStreamMotorVelocities}
    setGraphSelection={setGraphSelection}
    repollServos={repollServosHandler}
    clearMotorPosition={clearMotorPosition}
  />;
};

const Container = styled('div', (props: ThemeProps) => ({
  color: props.theme.color,
  height: '100vh',
  maxHeight: '100vh',
  overflow: 'auto',
  lineHeight: '28px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  zIndex: 0,
  width: '100vw',
  flexGrow: 1,
}));

const RootContainer = styled('div', (props: ThemeProps) => ({
  height: '100%',
  flex: 1,
  display: 'flex',
  maxWidth: '99%',
  flexDirection: 'column',
  overflow: 'visible'
}));

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const Item = styled('div', (props: ThemeProps & ClickProps) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  paddingLeft: '0.5em',
  paddingRight: '0.5em',
  height: '2.7em',
  width: '100%',
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

}));

const ItemIcon = styled(Fa, {
  height: '1.8em',
  width: '1.8em',
  fontSize: '1em',
});

const LeftBarContainer = styled('div', (props: ThemeProps & ClickProps) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '10px',
  paddingBottom: '2.7em',
  fontSize: '1.5vw',
  width: '4.5vw',
  height: '100vh',
  flexShrink: 0,
  alignItems: 'center',
  backgroundColor: props.theme.leftBarContainerBackground,
  border: `1px solid ${props.theme.borderColor}`,
  gap: '10px',
}));

const TopButtons = styled('div', (props: ThemeProps & ClickProps) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
}));

const BottomButtons = styled('div', (props: ThemeProps & ClickProps) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',

}));

const DisplayContainer = styled('div', (props: ThemeProps & ClickProps) => ({
  flex: '1 1 0',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: '100%',
  backgroundColor: props.theme.fileContainerBackground,
  borderRight: `2px solid ${props.theme.borderColor}`,
}));


class LeftBar extends React.Component<Props, State> {

  private selectedFileRef: React.MutableRefObject<string>;
  private isClickedFileRef: React.MutableRefObject<boolean>;
  private clickTimeout: any;
  isMobile: boolean = window.innerWidth < 850;
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: Modal.NONE,
      settings: DEFAULT_SETTINGS,
      activePanel: 0,
      sidePanelSize: Size.Type.Minimized,
      sliderSizes: this.isMobile ? [10, 0] : [4, 9],
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
      simpleProjectLoadFlag: false,
      panelSelection: '',
      servoPositions: DEFAULT_SERVOS,
      motorPositions: DEFAULT_MOTORS,
      stoppedMotorFlag: false,
      stoppedAllMotorsFlag: false,
      sensorValues: DEFAULT_SENSORS,
      screenWidth: window.innerWidth,

    }
    this.selectedFileRef = React.createRef();
    this.isClickedFileRef = React.createRef();

    this.isClickedFileRef.current = false;
    this.clickTimeout = null;
  }

  async componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  async componentDidUpdate(prevProps: Props, prevState: State) {


    if (prevState.sliderSizes !== this.state.sliderSizes) {
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

      this.setState({
        isLoadUserFiles: false
      })
    }

    if (prevState.isAddNewFile !== this.state.isAddNewFile) {
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
  private handleResize = () => {
    this.setState({ screenWidth: window.innerWidth });
  };
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


  private selectPanel = (panel: string) => {

    const { isPanelVisible, panelSelection, motorPositions, servoPositions, sliderSizes, graphSelection } = this.state;
    const { setShouldStreamMotorVelocities, setGraphSelection } = this.props;

    const isMotorDefault = JSON.stringify(motorPositions) === JSON.stringify(DEFAULT_MOTORS);
    const hasEnabledServos = servoPositions.some(servo => servo.enable);

    const isSamePanel = panel === panelSelection;

    const getNewSizes = (): [number, number] => {
      if (panel === "motor_sensor_servo") return isPanelVisible ? [5, 9] : [5, 8];
      if (panel === "fileExplorer") {
        if (!isPanelVisible && this.isMobile) return [2, 4];
        return [4, 9];
      }
      return sliderSizes;
    };

    // Handle when panel is already visible
    if (isPanelVisible) {
      if (!isSamePanel) {
        // Switching to a different panel
        const newSizes = getNewSizes();
        setShouldStreamMotorVelocities(panel === "motor_sensor_servo");
        this.setState({
          panelSelection: panel,
          sliderSizes: [...newSizes]
        });
      } else if (panel === "motor_sensor_servo") {
        // Same panel reselected: check motor + servo state
        if (isMotorDefault) {
          setShouldStreamMotorVelocities(false);
          this.setState({ isPanelVisible: false });
        } else {
          this.onModalClick_(Modal.KEEPMOTORSRUNNING)();
        }

        this.setState({
          isPanelVisible: hasEnabledServos
        }, () => {
          if (hasEnabledServos) {
            this.onModalClick_(Modal.KEEPMOTORSRUNNING)();
          }
        });
      } else {
        // Same panel reselected and not motor_sensor_servo
        if (panel === "terminal") {
          this.setState({
            terminalDisplayShown: false,
          });
        }
        this.setState({
          isPanelVisible: false,
          panelSelection: ''
        });
      }

      // Clean up graph selections
      if (graphSelection) {
        const filtered = graphSelection.filter(g => g !== 'MotorPositions' && g !== 'ServoGraphs');
        if (filtered.length !== graphSelection.length) {
          setGraphSelection(filtered);
        }
      }

    } else {
      // Panel is not visible, show it and configure size
      const newSizes = getNewSizes();
      setShouldStreamMotorVelocities(panel === "motor_sensor_servo");

      if (panel === "terminal") {
        this.setState({
          terminalDisplayShown: true,
        })
      }

      this.setState({
        sliderSizes: [...newSizes],
        panelSelection: panel,
        isPanelVisible: true
      });
    }
  };

  private onKeepRunning_ = (keepRunningResponse: string) => {
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
    this.selectedFileRef.current = fileName;
  };


  private setRootInfo_ = (user: User, project: Project, fileName: string, activeLanguage: ProgrammingLanguage) => {
    this.selectedFileRef.current = fileName;
    this.setState({
      userShown: user,
      project: project,
      fileName: fileName,
    })

  };

  private onUserUpdate_ = (users: User[]) => {
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
    if (loadedUser) {

      let userIndex: number;
      if (renamedUser) {
        userIndex = this.state.users.findIndex(user => user.userName === oldUserName);

        if (userIndex !== -1) { // Check if the user exists in the list
          this.setState(prevState => (
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
            }));
        }


      }
      else {
        userIndex = this.state.users.findIndex(user => user.userName === loadedUser.userName);

        if (userIndex !== -1) { // Check if the user exists in the list
          this.setState(prevState => (
            {
              user: loadedUser,
              loadedUserData: userData,
              isReloadRootUserFiles: false,

              users: prevState.users.map((user, index) =>
                index === userIndex
                  ? { ...user, projects: userData } // Update the user's projects
                  : user // Keep the other users unchanged
              )
            }));
        }
      }

      if (this.state.userShown) {
        if (this.state.userShown.userName === loadedUser.userName) {
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
    this.setState({
      isReloadRootUserFiles: true
    })
  };


  private onSetRenameUserFlag_ = (renameUserFlag: boolean, renamedUser: User) => {
    if (renamedUser) {
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

    if (this.state.userShown && this.state.userShown.interfaceMode === InterfaceMode.SIMPLE) {
      this.setState({
        simpleProjectLoadFlag: true,
        fileType: fileName.split('.').pop() || '',
        isClickFile: true,
        userShown: user,
        project: project,
        fileName: fileName,
      });
    }
    else {
      this.setState({
        user: user,
        project: project,
        fileName: fileName,
        activeLanguage: activeLanguage,

      });
    }


  };

  private onUploadProject_ = (user: User, project: UploadedProject) => {
    this.setState({
      toUploadProjectFlag: true,
      toUploadUser: user,
      toUploadProject: project,
    })

  };

  private onSetUploadProjectFlag_ = (toUploadProjectFlag: boolean) => {
    this.setState({
      toUploadProjectFlag: toUploadProjectFlag
    });

    this.setState({
      toUploadProjectFlag: toUploadProjectFlag,
      toUploadProject: undefined,
      toUploadUser: undefined,

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
      this.setState({
        project: renamedProject
      })
    }
    this.setState({
      renameProjectFlag: renameProjectFlag
    })
  };

  private onSetSelectedProject_ = (project: Project, file: string) => {
    this.setState({
      rehighlightProject: project,
      rehighlightFile: file,
      project: project,
    });

  };

  private onResetHighlightFlag_ = () => {
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
    this.setState({
      user: user,
      project: project,
      contextMenuFile: fileName,
      deleteFileFlag: deleteFileFlag
    })
  };

  private onDownloadFile_ = (user: User, project: Project, fileName: string) => {
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
    this.isClickedFileRef.current = true;
    this.setState({
      user: user,
      project: project,
      fileName: fileName,
      activeLanguage: language,
      fileType: fileType,
      isClickFile: true,
      userShown: user
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

  };

  private onUploadFiles_ = (user: User, project: Project, files: FileInfo[]) => {
    this.setState({
      toUploadUser: user,
      toUploadProject: project,
      toUploadFiles: files,
      toUploadFilesFlag: true
    })
  };

  private onSetUploadFilesFlag_ = (toUploadFilesFlag: boolean) => {
    this.setState({
      toUploadFilesFlag: toUploadFilesFlag,
      toUploadUser: undefined,
      toUploadProject: undefined,
      toUploadFiles: []
    })
  };

  private storeMotorPositions_ = (view: 'Power' | 'Velocity', motorPositions: { [key: string]: number }) => {
    this.setState({
      motorView: view,
      motorPositions: motorPositions
    });
  };

  private stopMotor_ = (motor: Motors) => {
    let motorNumber: number = parseInt(motor.split(' ')[1]);
    this.setState({ stoppedMotor: motorNumber, stoppedMotorFlag: true });

  };

  private stopAllMotors_ = () => {
    this.setState({ stoppedAllMotorsFlag: true });
  }
  private onSetStoppedMotorFlag_ = (stoppedMotorFlag: boolean) => {
    this.setState({
      stoppedMotorFlag: stoppedMotorFlag
    })
  };

  private onSetStoppedAllMotorsFlag_ = (stoppedAllMotorsFlag: boolean) => {
    this.setState({
      stoppedAllMotorsFlag: stoppedAllMotorsFlag
    })
  }

  private clearMotorPosition_ = (motor: Motors) => {
    this.props.clearMotorPosition(motor);

  }

  private storeServoPositions_ = (servoPositions: ServoType[]) => {
    this.setState({
      servoPositions: servoPositions
    });
  }

  private onSetEnabledServoFlag_ = (enabledServoFlag: boolean) => {
    this.setState({
      enabledServoFlag: enabledServoFlag
    })
  }

  private onSetDisabledServoFlag_ = (disabledServoFlag: boolean) => {
    this.setState({
      disabledServoFlag: disabledServoFlag
    })
  }

  private onSetSensorDisplayShown_ = (sensorDisplayShown: boolean) => {
    this.setState({
      sensorDisplayShown: sensorDisplayShown
    })
  };

  private onSensorSelection_ = (selectedSensors: SensorSelectionKey[]) => {
    this.setState({
      sensorSelection: selectedSensors
    })

  };

  private onGraphSelection_ = (selectedGraphs: GraphSelectionKey[]) => {
    this.setState({
      graphSelection: selectedGraphs
    }, () => {
      this.props.setGraphSelection(this.state.graphSelection);
    })

  };

  private onSetAnalogValues_ = (analogValues: number) => {
    this.setState({
      analogValues: analogValues
    })
  };

  private onSetDigitalValues_ = (digitalValues: number) => {

    this.setState({
      digitalValues: digitalValues
    })
  };


  private onSetAccelValues_ = (accelValues: number) => {
    this.setState({
      accelValues: accelValues
    })
  };


  private onSetGyroValues_ = (gyroValues: number) => {
    this.setState({
      gyroValues: gyroValues
    })
  };

  private onSetMagnetoValues_ = (magnetoValues: number) => {
    this.setState({
      magnetoValues: magnetoValues
    })
  };

  private onSetButtonValues_ = (buttonValues: number) => {
    this.setState({
      buttonValues: buttonValues
    })
  };

  private fileExplorerOnCreation_ = (createdUser: User, createdProject: Project) => {
    this.setState({
      panelSelection: "fileExplorer",
      isPanelVisible: true,
      userShown: createdUser,
    });
  };

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
      simpleProjectLoadFlag,
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

      contextMenuFile,
      contextMenuProject,
      contextMenuUser,

    } = this.state;


    let rootContent: JSX.Element;
    rootContent = (
      <RootContainer theme={theme}>

        <Root
          isLeftBarOpen={isPanelVisible}

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
          simpleProjectLoadFlag={simpleProjectLoadFlag}

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
          resetUploadFilesFlag={this.onSetUploadFilesFlag_}
          resetUploadProjectFlag={this.onSetUploadProjectFlag_}

          propedMotorPositions={this.state.motorPositions}
          stoppedMotor={this.state.stoppedMotor}
          propedStoppedMotorFlag={this.state.stoppedMotorFlag}
          propedStoppedAllMotorsFlag={this.state.stoppedAllMotorsFlag}
          propedMotorView={this.state.motorView}
          resetStoppedMotorFlag={this.onSetStoppedMotorFlag_}
          resetStoppedAllMotorsFlag={this.onSetStoppedAllMotorsFlag_}

          propedServoPositions={this.state.servoPositions}
          enabledServo={this.state.enabledServo}
          disabledServos={this.state.disabledServos}
          propedEnabledServoFlag={this.state.enabledServoFlag}
          propedDisabledServoFlag={this.state.disabledServoFlag}
          resetEnabledServoFlag={this.onSetEnabledServoFlag_}
          resetDisabledServoFlag={this.onSetDisabledServoFlag_}

          propedSensorDisplayFlag={this.state.sensorDisplayShown}
          setAnalogValues={this.onSetAnalogValues_}
          setDigitalValues={this.onSetDigitalValues_}
          setAccelValues={this.onSetAccelValues_}
          setGyroValues={this.onSetGyroValues_}
          setMagnetoValues={this.onSetMagnetoValues_}
          setButtonValues={this.onSetButtonValues_}

          propedSensorSelection={this.state.sensorSelection}
          fileExplorerOnCreation={this.fileExplorerOnCreation_}

          propedTerminalDisplayFlag={this.state.terminalDisplayShown}

          propedUploadFilesFlag={this.state.toUploadFilesFlag}
          propedUploadUser={this.state.toUploadUser}
          propedUploadProject={this.state.toUploadProject}
          propedUploadedProjectFlag={this.state.toUploadProjectFlag}
          propedUploadFiles={this.state.toUploadFiles}


        />
      </RootContainer>
    )

    let fileExplorerContent: JSX.Element;

    fileExplorerContent = (
      <DisplayContainer theme={storedTheme}>

        <IvygateFileExplorer
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
          onUploadFiles={this.onUploadFiles_}
          onUploadProject={this.onUploadProject_}
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
      </DisplayContainer>
    );

    let motorServoSensorDisplay: JSX.Element;
    motorServoSensorDisplay = (
      <DisplayContainer theme={storedTheme}>
        <MotorServoSensorDisplay
          theme={storedTheme}
          locale="en-US"
          stopMotor={this.stopMotor_}
          stopAllMotors={this.stopAllMotors_}
          storeMotorPositions={this.storeMotorPositions_}
          getMotorPositions={() => this.state.motorPositions}
          storeServoPositions={this.storeServoPositions_}
          getServoPositions={() => this.state.servoPositions}
          sensorDisplayShown={this.onSetSensorDisplayShown_}
          sensorSelections={this.onSensorSelection_}
          graphSelections={this.onGraphSelection_}
          clearMotorPosition={this.clearMotorPosition_}
          propedSensorValues={this.state.sensorValues}
          propedAnalogValues={this.state.analogValues}
          propedDigitalValues={this.state.digitalValues}
          propedAccelValues={this.state.accelValues}
          propedGyroValues={this.state.gyroValues}
          propedMagnetoValues={this.state.magnetoValues}
          propedButtonValues={this.state.buttonValues}
          propedProgramRunning={this.props.isRunning}
          propedMotorVelocities={this.props.propedMotorVelocities}
          propedMotorPositions={this.props.propedMotorPositions}
          propedServoPositions={this.props.propedServoPositions}

        />


      </DisplayContainer>
    );

    let terminalDisplay: JSX.Element;
    terminalDisplay = (
      <DisplayContainer theme={storedTheme}>
        <Suspense fallback={<div>Loading Terminal...</div>}>
          <TerminalView
            theme={storedTheme}
            locale="en-US"
            className="terminal-view"
          />
        </Suspense>
      </DisplayContainer>
    )

    let contentDisplay: JSX.Element;
    switch (this.state.panelSelection) {
      case 'fileExplorer':
        contentDisplay = fileExplorerContent;
        break;
      case 'motor_sensor_servo':
        contentDisplay = motorServoSensorDisplay;
        break;
      case 'terminal':
        contentDisplay = terminalDisplay;
        break;
    };

    return (
      <Container className={className} theme={storedTheme}>

        <LeftBarContainer theme={storedTheme} >

          <TopButtons theme={storedTheme}>
            <Item theme={storedTheme} onClick={() => this.selectPanel('fileExplorer')}>
              <ItemIcon icon={faFolderTree} />
            </Item>
            <Item style={{}} theme={storedTheme} onClick={() => this.selectPanel('motor_sensor_servo')}>
              <ItemIcon icon={faWaveSquare} />
            </Item>
          </TopButtons>
          <div style={{ flexGrow: 1 }} />

          <BottomButtons theme={storedTheme}>
            <Item theme={storedTheme} onClick={() => this.selectPanel('terminal')}>
              <ItemIcon icon={faTerminal} />
            </Item>
            <Item theme={storedTheme} onClick={this.onModalClick_(Modal.SETTINGS)}>
              <ItemIcon icon={faCog} />
            </Item>
          </BottomButtons>


        </LeftBarContainer>
        <Slider
          isVertical={true}
          theme={storedTheme}
          minSizes={[0, 0]}
          sizes={this.state.sliderSizes}
          visible={[isPanelVisible, true]}
        >
          {contentDisplay}
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

export default LeftBarWrapper;
