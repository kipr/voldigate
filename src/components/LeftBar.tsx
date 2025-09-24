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
import Classroom from 'types/classroomTypes';
import { UploadedUser } from 'ivygate/dist/types/user';
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
  classrooms?: Classroom[];
  modal: Modal;
  settings: Settings;
  activePanel: number;
  sidePanelSize: Size.Type;
  sliderSizes: [number, number];
  isMobile: boolean;
  isDesktop: boolean;
  isPanelVisible: boolean;
  storedTheme: Theme;
  consoleLayout: 'horizontal' | 'vertical';
  classroom?: Classroom;
  users: User[];
  user?: User;
  isLoadUserFiles?: boolean;
  isAddNewClassroom? : boolean;
  isAddNewFile?: boolean;
  reloadUser?: boolean;
  activeLanguage?: ProgrammingLanguage;
  fileType?: string;
  project?: Project;
  rehighlightProject?: Project;
  rehighlightFile?: string;
  contextMenuClassroom?: Classroom;
  contextMenuUser?: User;
  contextMenuProject?: Project;
  contextMenuFile?: string;
  toUploadUser?: User | UploadedUser;
  toUploadProject?: Project | UploadedProject;
  toUploadFiles?: FileInfo[];

  renameClassroomFlag?: boolean;

  moveUserFlag?: boolean;
  removeUserFlag?: boolean;
  deleteClassroomFlag?: boolean;
  deleteUserFlag?: boolean;
  deleteProjectFlag?: boolean;
  deleteFileFlag?: boolean;
  downloadUserFlag?: boolean;
  renameUserFlag?: boolean;
  downloadProjectFlag?: boolean;
  downloadFileFlag?: boolean;
  renameProjectFlag?: boolean;
  moveProjectFlag?: boolean;
  addProjectFlag?: boolean;
  simpleProjectLoadFlag?: boolean;
  toUploadUserFlag?: boolean;
  toUploadProjectFlag?: boolean;
  toUploadFilesFlag?: boolean;

  addFileFlag?: boolean;
  fileName?: string;
  isAddNewUser?: boolean;
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

  toPasteData?: {};
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
  overflow: 'visible',


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
  paddingTop: '1rem',
  paddingBottom: '2rem',
  fontSize: '1rem',
  width: '60px',
  height: '100vh',
  flexShrink: 0,
  alignItems: 'center',
  backgroundColor: props.theme.leftBarContainerBackground,
  border: `1px solid ${props.theme.borderColor}`,
  gap: '10px',

  // ✅ Most important part
  overflow: 'hidden', // This ensures no scrollbars and no visual overflow
  boxSizing: 'border-box',

  // Responsive behavior
  '@media (max-height: 1400px)': {
    fontSize: '0.8rem',
    paddingTop: '0.5rem',
    paddingBottom: '6rem',
    gap: '8px',
  },
  '@media (max-height: 500px)': {
    fontSize: '0.7rem',
    gap: '6px',
    width: '50px',
  },
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
  minWidth: '2.6em',
  backgroundColor: props.theme.fileContainerBackground,
  borderRight: `2px solid ${props.theme.borderColor}`,
}));


class LeftBar extends React.Component<Props, State> {

  private selectedFileRef: React.MutableRefObject<string>;
  private isClickedFileRef: React.MutableRefObject<boolean>;
  private clickTimeout: any;
  isMobile: boolean = window.innerWidth < 1030;
  isDesktop: boolean = window.innerWidth >= 1450;
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: Modal.NONE,
      settings: DEFAULT_SETTINGS,
      activePanel: 0,
      isMobile: window.innerWidth < 1030,
      isDesktop: window.innerWidth >= 1450,
      sidePanelSize: Size.Type.Minimized,
      sliderSizes: this.isMobile ? [10, 0] : this.isDesktop ? [3.7, 10] : [5, 10],
      isPanelVisible: false,
      isClickFile: false,
      storedTheme: localStorage.getItem('ideEditorDarkMode') === 'true' ? DARK : LIGHT,
      consoleLayout: localStorage.getItem('consoleLayout') === 'vertical' ? 'vertical' : 'horizontal',
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
    this.handleResize();
    const settingsFromStorage: Settings = {
      ...DEFAULT_SETTINGS,
      ideEditorDarkMode: localStorage.getItem('ideEditorDarkMode') === 'true' ? true : false,
      consoleLayout: localStorage.getItem('consoleLayout') === 'vertical' ? 'vertical' : 'horizontal',
      classroomView: localStorage.getItem('classroomView') === 'true' ? true : false,
    };

    this.setState({
      settings: settingsFromStorage,
    })
  }


  async componentDidUpdate(prevProps: Props, prevState: State) {
    console.log("LeftBar compDidUpdate props:", this.props);
    console.log("LeftBar compDidUpdate state:", this.state);
    this.isMobile = window.innerWidth < 1030;

    if (prevState.isMobile !== this.isMobile) {
      console.log("LeftBar isMobile changed from: ", prevState.isMobile, " to: ", this.isMobile);
      this.setState({
        isMobile: this.isMobile,
        sliderSizes: this.isMobile ? [10, 0] : [4, 8.3],
      })
      this.forceUpdate();
    }


    if (prevState.sliderSizes !== this.state.sliderSizes) {
      console.log("LeftBar sliderSizes changed from: ", prevState.sliderSizes, " to: ", this.state.sliderSizes);
    }
    if (this.state.settings !== prevState.settings) {
      console.log("LeftBar settings changed from: ", prevState.settings, " to: ", this.state.settings);
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
    window.removeEventListener('resize', this.handleResize);
  }

  private getSliderSizes(): [number, number] {
    const { isMobile, isDesktop, isPanelVisible, panelSelection } = this.state;
    console.log("getSliderSizes state:", this.state);

    if (panelSelection === 'motor_sensor_servo') {
      console.log("motorServoSensor isMobile:", isMobile, "isDesktop:", isDesktop, "isPanelVisible:", isPanelVisible);
      return isMobile ? [10, 0] : isDesktop ? [5, 10] : [5.5, 9];
    }
    if (panelSelection === 'fileExplorer') {
      console.log("isMobile:", isMobile, "isDesktop:", isDesktop, "isPanelVisible:", isPanelVisible);
      return isMobile ? [10, 0] : isDesktop ? [3.7, 10] : [5.5, 9];
    }
    if (!isPanelVisible) {
      return isMobile ? [10, 0] : [4, 8.3];
    }
    return isMobile ? [10, 0] : [4, 8.3];
  }


  private handleResize = () => {
    console.log("LeftBar handleResize called, window.innerWidth:", window.innerWidth);
    const isMobileNow = window.innerWidth < 1030;
    if (this.state.isMobile !== isMobileNow) {
      this.setState({
        isMobile: isMobileNow,
        //  sliderSizes: isMobileNow ? [10, 0] : [4, 8.3],
      });
    }
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
    this.setState({ settings: nextSettings }, () => {
      console.log("LeftBar settings changed:", this.state.settings);
    });
  };

  private onModalClick_ = (modal: Modal) => () => this.setState({ modal });
  private onModalClose_ = () => this.setState({ modal: Modal.NONE });

  private selectPanel = (panel: string) => {
    const {
      isPanelVisible,
      panelSelection,
      motorPositions,
      servoPositions,
      graphSelection,
    } = this.state;

    const { setShouldStreamMotorVelocities, setGraphSelection } = this.props;

    const isMobileNow = window.innerWidth < 1030;

    const isMotorDefault = JSON.stringify(motorPositions) === JSON.stringify(DEFAULT_MOTORS);
    const hasEnabledServos = servoPositions.some(servo => servo.enable);
    const isSamePanel = panel === panelSelection;

    console.log("window.innerWidth:", window.innerWidth, "→ isMobile:", isMobileNow);

    if (isPanelVisible) {
      if (!isSamePanel) {
        setShouldStreamMotorVelocities(panel === "motor_sensor_servo");
        this.setState({
          panelSelection: panel,
          // sliderSizes: newSizes,
        });
      } else if (panel === "motor_sensor_servo") {
        if (isMotorDefault) {
          setShouldStreamMotorVelocities(false);
          this.setState({ isPanelVisible: false });
        } else {
          this.onModalClick_(Modal.KEEPMOTORSRUNNING)();
        }

        this.setState({
          isPanelVisible: hasEnabledServos,
        }, () => {
          if (hasEnabledServos) {
            this.onModalClick_(Modal.KEEPMOTORSRUNNING)();
          }
        });
      } else {
        if (panel === "terminal") {
          this.setState({ terminalDisplayShown: false });
        }
        this.setState({
          isPanelVisible: false,
          panelSelection: '',
        });
      }

      if (graphSelection) {
        const filtered = graphSelection.filter(g => g !== 'MotorPositions' && g !== 'ServoGraphs');
        if (filtered.length !== graphSelection.length) {
          setGraphSelection(filtered);
        }
      }
    } else {

      setShouldStreamMotorVelocities(panel === "motor_sensor_servo");

      if (panel === "terminal") {
        this.setState({ terminalDisplayShown: true });
      }

      this.setState({
        // sliderSizes: newSizes,
        panelSelection: panel,
        isPanelVisible: true,
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
    console.log("LeftBar setRootInfo user:", user, "project:", project, "fileName:", fileName, "activeLanguage:", activeLanguage);
    this.selectedFileRef.current = fileName;
    this.setState({
      userShown: user,
      project: project,
      fileName: fileName,
    })

  };

  private onUserUpdate_ = (users: User[]) => {
    console.log("LeftBar onUserUpdate users:", users);
    if (JSON.stringify(this.state.users) !== JSON.stringify(users)) {
      this.setState({ users });
    }
    if (this.state.reloadUser) {
      this.setState({ reloadUser: false });
    }
  };

  private onUserSelected_ = (user: User, loadUserData: boolean) => {
    console.log("LeftBar onUserSelected user:", user, "loadUserData:", loadUserData);
    console.log("LeftBar onUserSelected state:", this.state);
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
    console.log("LeftBar onLoadUserData userData:", userData, "loadedUser:", loadedUser, "renamedUser:", renamedUser, "oldUserName:", oldUserName);
    console.log("LeftBar onLoadUserData state:", this.state);
    console.log("LeftBar onLoadUserData users:", this.state.users);
    const usersArray = Array.isArray(this.state.users)
      ? this.state.users
      : (Object.values(this.state.users) as User[]);


    console.log("LeftBar onLoadUserData usersArray:", usersArray);


    if (loadedUser) {
      let userIndex = usersArray.findIndex(user => user.userName === (renamedUser ? oldUserName : loadedUser.userName));
      let projectIndex = loadedUser.projects?.findIndex(project => project.projectName === (this.state.project ? this.state.project.projectName : ''));
      console.log("LeftBar onLoadUserData userIndex:", userIndex);
      console.log("LeftBar onLoadUserData projectIndex:", projectIndex);  

      if (userIndex !== -1) { // Check if the user exists in the list
        this.setState(prevState => (
          console.log("LeftBar onLoadUserData prevState:", prevState),

          {
            user: loadedUser,
            loadedUserData: userData,
            isReloadRootUserFiles: false,
            project: userData.length === 1 ? userData[0] : userData[projectIndex],
            users: usersArray.map((user, index) =>
              index === userIndex
                ? { ...loadedUser, projects: userData }
                : user
            ),
            userShown: loadedUser
          }));
      }

      if (this.state.userShown) {
        if (this.state.userShown.userName === loadedUser.userName) {
          this.setState({
           userShown: loadedUser
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


  private onLoadClassroomData_ = (classrooms: Classroom[], user: User) => {
    this.setState({
      classrooms: classrooms,
      user: user
    });
  };

  private onRenameClassroom_ = (classroom: Classroom) => {
    console.log("Renaming classroom:", classroom);
    this.setState({
      contextMenuClassroom: classroom,
      renameClassroomFlag: true
    });
  }

  private onSetRenameFlag_ = (renameFlag: boolean, renameType: 'Classroom' | 'User' | 'Project' | 'File') => {
    if(renameType === 'Classroom') {
      this.setState({
        renameClassroomFlag: renameFlag,
        contextMenuClassroom: undefined
      });
    }
    else if (renameType === 'User') {
      this.setState({
        renameUserFlag: renameFlag,
        contextMenuUser: undefined
      });
    }
    else if (renameType === 'Project') {
      this.setState({
        renameProjectFlag: renameFlag,
        contextMenuProject: undefined,
        contextMenuUser: undefined
      });
    }
    else if (renameType === 'File') {
      this.setState({
        renameFileFlag: renameFlag,
        contextMenuFile: undefined,
        contextMenuProject: undefined,
        contextMenuUser: undefined
      });
    }
  }

  private onDeleteClassroom_ = (classroom: Classroom) => {
    console.log("Deleting classroom:", classroom);
    this.setState({
      contextMenuClassroom: classroom,
      deleteClassroomFlag: true,
    })

  }



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
    const fullUser = Object.values(this.state.users).find(u => u.userName === user.userName);
    this.setState({
      contextMenuUser: fullUser,
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
    const fullUser = Object.values(this.state.users).find(u => u.userName === user.userName);
    this.setState({
      contextMenuUser: fullUser,
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

  private onRemoveUserFromClassroom_ = (user: User, classroom: Classroom) => {
    console.log("Removing user:", user, "from classroom:", classroom);

    this.setState({
      contextMenuClassroom: classroom,
      contextMenuUser: user,
      removeUserFlag: true

    })
  };

  private onUploadUser_ = (uploadedUser: UploadedUser) => {
    console.log("Uploading user:", uploadedUser);
    this.setState({
      toUploadUser: uploadedUser,
      toUploadUserFlag: true,
    });
  };

  private onSetUploadUserFlag_ = (toUploadUserFlag: boolean) => {
    this.setState({
      toUploadUserFlag: toUploadUserFlag,
      toUploadUser: undefined,
    });
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

  private onMoveProject_ = (user: User, project: Project) => {
    console.log("Moving project:", project, "for user:", user);
    this.setState({
      contextMenuUser: user,
      contextMenuProject: project,
      moveProjectFlag: true
    })
  }

  private onMoveUserToClassroom_ = (user: User) => {
    console.log("Moving user:", user);
    this.setState({
      contextMenuUser: user,
      moveUserFlag: true
    });
  }
  
  private onAddNewClassroom_ = (classroom: Classroom) => {
    console.log("Adding new classroom:", classroom);
    this.setState({
      classroom: classroom,
      isAddNewClassroom: true,
    });
  }

  private onAddNewUser_ = (classroom: Classroom) => {
    console.log("Adding new user for classroom:", classroom);
    this.setState({
      classroom: classroom,
      isAddNewUser: true,
    })
  }

  /**
   * Sets the state userName based on the user selected and sets isAddNewProject flag to true
   * @param user - The User object
   */
  private onAddNewProject_ = (user: User, classroom?: Classroom) => {
    console.log("LeftBar onAddNewProject user:", user, "classroom:", classroom);
    this.setState({
      isAddNewProject: true,
      user: user,
      classroom: classroom ? classroom : undefined,
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
    console.log("LeftBar onProjectSelected user:", user, "project:", project, "fileName:", fileName, "activeLanguage:", activeLanguage);
    if (this.state.userShown && this.state.userShown.interfaceMode === InterfaceMode.SIMPLE) {
      this.setState({
        simpleProjectLoadFlag: true,
        fileType: fileName.split('.').pop() || '',
        isClickFile: true,
        userShown: Object.values(this.state.users).find(u => u.userName === user.userName),
        project: project,
        fileName: fileName,
        activeLanguage: activeLanguage,
        user: user

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

  private onSetMoveProjectFlag_ = (moveProjectFlag: boolean) => {
    this.setState({
      moveProjectFlag: moveProjectFlag,
      contextMenuProject: undefined,
      contextMenuUser: undefined
    });
  };

  private onSetMoveUserFlag_ = (moveUserFlag: boolean) => {
    this.setState({
      moveUserFlag: moveUserFlag,
      contextMenuUser: undefined
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
      user: Object.values(this.state.users).find(u => u.userName === user.userName) || user,
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

  private onFileSelected_ = async (classroom: Classroom, user: User, project: Project, fileName: string, language: ProgrammingLanguage, fileType: string) => {
    console.log("LeftBar onFileSelected classroom:", classroom, "user:", user, "project:", project, "fileName:", fileName, "language:", language, "fileType:", fileType);
    this.isClickedFileRef.current = true;
    this.setState({
      classroom: classroom,
      user: Object.values(this.state.users).find(u => u.userName === user.userName) || user,
      project: project,
      fileName: fileName,
      activeLanguage: language,
      fileType: fileType,
      isClickFile: true,
      userShown: Object.values(this.state.users).find(u => u.userName === user.userName) || user,
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

  private onClassroomUpdate_ = (classrooms: Classroom[]) => {
    console.log("LeftBar onClassroomUpdate state:", this.state);
    console.log("LeftBar onClassroomUpdate props:", this.props);
    // this.setState({
    //   classrooms: classrooms
    // })

    this.setState(prevState => (
      console.log("LeftBar onClassroomUpdate prevState:", prevState),
      {
        classrooms: classrooms
      }
    ));
  };

  private onCopyObject_ = (object: any) => {
    console.log("LeftBar onCopyObject object:", object);
    console.log("LeftBar onCopyObject state:", this.state);
    console.log("LeftBar onCopyObject props:", this.props);



  };


  private onPasteObject_ = (toPasteData: {}) => {
    console.log("LeftBar onPasteObject toPasteObject:", toPasteData);
    console.log("LeftBar onPasteObject state:", this.state);
    console.log("LeftBar onPasteObject props:", this.props);
    this.setState({
      toPasteData: toPasteData
    }, () => {
      console.log("LeftBar onPasteObject state after setState:", this.state);
    })
  };

  render() {
    const { className, theme } = this.props;

    const {
      settings,
      classrooms,
      classroom,
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
      isAddNewUser,
      isAddNewFile,
      isAddNewProject,
      isReloadFiles,
      fileType,
      reloadUser,
      userShown,
      renameClassroomFlag,
      renameProjectFlag,
      renameUserFlag,
      renameFileFlag,
      removeUserFlag,
      downloadFileFlag,
      deleteFileFlag,
      deleteUserFlag,
      deleteProjectFlag,
      moveUserFlag,
      downloadUserFlag,
      downloadProjectFlag,
      addProjectFlag,
      moveProjectFlag,

      contextMenuClassroom,
      contextMenuFile,
      contextMenuProject,
      contextMenuUser,

    } = this.state;

    console.log("LeftBar render state:", this.state);

    let rootContent: JSX.Element;
    rootContent = (
      <RootContainer theme={theme}>

        <Root
          isLeftBarOpen={isPanelVisible}
          propSettings={settings}
          propedTheme={storedTheme}
          propClassroom={classroom}
          propFileName={fileName}
          propProject={project}
          propActiveLanguage={activeLanguage}
          propUser={user}
          propContextMenuClassroom={contextMenuClassroom}
          propContextMenuUser={contextMenuUser}
          propContextMenuProject={contextMenuProject}
          propContextMenuFile={contextMenuFile}
          reloadUserFlag={reloadUser}
          reloadRootUserFlag={isReloadRootUserFiles}
          simpleProjectLoadFlag={simpleProjectLoadFlag}
          addNewClassroomFlag={this.state.isAddNewClassroom}
          addNewUserFlag={isAddNewUser}
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
          onClassroomUpdate={this.onClassroomUpdate_}
          onUserUpdate={this.onUserUpdate_}
          loadUserDataFlag={isLoadUserFiles}
          onLoadUserData={this.onLoadUserData_}
          onLoadClassroomData={this.onLoadClassroomData_}

          moveUserFlag={moveUserFlag}
          removeUserFlag={removeUserFlag}
          deleteClassroomFlag={this.state.deleteClassroomFlag}
          deleteUserFlag={deleteUserFlag}
          deleteProjectFlag={deleteProjectFlag}
          deleteFileFlag={deleteFileFlag}

          downloadUserFlag={downloadUserFlag}
          downloadProjectFlag={downloadProjectFlag}
          downloadFileFlag={downloadFileFlag}
          moveProjectFlag={moveProjectFlag}

          renameClassroomFlag={renameClassroomFlag}
          renameUserFlag={renameUserFlag}
          renameProjectFlag={renameProjectFlag}
          renameFileFlag={renameFileFlag}
          resetAddNewUserFlag={() => this.setState({ isAddNewUser: false })}
          resetAddNewClassroomFlag={() => this.setState({ isAddNewClassroom: false })}
          resetDeleteClassroomFlag={() => this.setState({ deleteClassroomFlag: false })}
          resetDeleteUserFlag={this.onSetUserDeleteFlag_}
          resetDeleteProjectFlag={this.onSetProjectDeleteFlag_}
          resetDeleteFileFlag={this.onSetFileDeleteFlag_}

          resetDownloadUserFlag={this.onSetUserDownloadFlag_}
          resetDownloadProjectFlag={this.onSetProjectDownloadFlag_}
          resetDownloadFileFlag={this.onSetFileDownloadFlag_}

          resetFileExplorerFileSelection={this.setSelectedFileRef_}
          resetFileExplorerProjectSelection={this.onSetSelectedProject_}
          resetRenameFlag = {this.onSetRenameFlag_}
          resetRenameUserFlag={this.onSetRenameUserFlag_}
          resetRenameProjectFlag={this.onSetRenameProjectFlag_}
          resetRenameFileFlag={this.onSetRenameFileFlag}
          resetUploadUserFlag={this.onSetUploadUserFlag_}
          resetUploadFilesFlag={this.onSetUploadFilesFlag_}
          resetUploadProjectFlag={this.onSetUploadProjectFlag_}
          resetMoveProjectFlag={this.onSetMoveProjectFlag_}
          resetMoveUserFlag={this.onSetMoveUserFlag_}
          resetRemoveUserFlag={() => this.setState({ removeUserFlag: false })}

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
          propedUploadUserFlag={this.state.toUploadUserFlag}
          propedUploadProject={this.state.toUploadProject}
          propedUploadedProjectFlag={this.state.toUploadProjectFlag}
          propedUploadFiles={this.state.toUploadFiles}
          propedPasteData={this.state.toPasteData}


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
          onCopyObject={this.onCopyObject_}
          onPasteObject={this.onPasteObject_}
          onRenameClassroom={this.onRenameClassroom_}
          onProjectSelected={this.onProjectSelected_}
          onFileSelected={this.onFileSelected_}
          onUserSelected={this.onUserSelected_}
          onAddNewClassroom={this.onAddNewClassroom_}
          onAddNewUser={this.onAddNewUser_}
          onAddNewProject={this.onAddNewProject_}
          onAddNewFile={this.onAddNewFile_}
          onDeleteClassroom={this.onDeleteClassroom_}
          onDeleteUser={this.onDeleteUser_}
          onDeleteProject={this.onDeleteProject_}
          onDeleteFile={this.onDeleteFile_}
          onDownloadUser={this.onDownloadUser_}
          onRenameUser={this.onRenameUser_}
          onRemoveUserFromClassroom={this.onRemoveUserFromClassroom_}
          onDownloadProject={this.onDownloadProject_}
          onRenameProject={this.onRenameProject_}
          onMoveProject={this.onMoveProject_}
          onMoveUserToClassroom={this.onMoveUserToClassroom_}
          onDownloadFile={this.onDownloadFile_}
          onResetHighlightFlag={this.onResetHighlightFlag_}
          onReloadProjects={this.reloadRootUserProjects_}
          onUploadFiles={this.onUploadFiles_}
          onUploadProject={this.onUploadProject_}
          onUploadUser={this.onUploadUser_}
          addProjectFlag={addProjectFlag}
          addFileFlag={isAddNewFile}
          onRenameFile={this.onRenameFile_}
          userDeleteFlag={deleteUserFlag}
          renameUserFlag={renameUserFlag}
          reloadFilesFlag={isReloadFiles}
          propProjectShown={project}
          propUserShown={userShown}
          propUsers={users}
          propUserData={loadedUserData}
          propFileName={this.selectedFileRef.current}
          reloadUser={reloadUser}
          reHighlightProject={rehighlightProject}
          reHighlightFile={rehighlightFile}
          propSettings={settings}
          propClassrooms={classrooms}

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

    console.log("LeftBarWrapper render: ", this.state);
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
          <div style={{ flexGrow: 1, minHeight: 0 }} />

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
          minSizes={[500, 0]}
          sizes={this.getSliderSizes()}
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
