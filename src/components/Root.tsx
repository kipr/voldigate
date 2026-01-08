import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import Dict from '../Dict';
import ProgrammingLanguage from '../ProgrammingLanguage';
import AboutDialog from './AboutDialog';
import LocalizedString from '../util/LocalizedString';
import DocumentationLocation from '../state/State/Documentation/DocumentationLocation';
import tr from '@i18n';
import NewFileDialog from './NewFileDialog';
import EditorPage from './EditorPage';
import CreateProjectDialog from './CreateProjectDialog';
import DeleteUserProjectFileDialog from './DeleteUserProjectFileDialog';
import DownloadUserProjectFileDialog from './DownloadUserProjectFileDialog';
import SaveFileDialog from './SaveFileDialog';
import RenameUserProjectFileDialog from './RenameUserProjectFileDialog';
import { State as ReduxState } from '../state';
import { styled } from 'styletron-react';
import { DARK, Theme } from './theme';
import { Layout } from './Layout';
import { StyledText } from '../util';
import { Message } from 'ivygate';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import { DEFAULT_FEEDBACK, Feedback } from '../Feedback';
import { Editor } from './Editor';
import { connect } from 'react-redux';
import { HomeStartOptions } from './HomeStartOptions';
import { Modal } from '../pages/Modal';
import { Project, SimClassroomProject, UploadedProject } from 'ivygate/dist/types/project';
import { InterfaceMode } from '../types/interfaceModes';
import { UploadedUser, User } from 'ivygate/dist/types/user';
import { SensorSelectionKey, ServoType } from 'types/motorServoSensorTypes';
import { programRunContextHelper } from '../ProgramRunContext';
import parseMessages, { sort, toStyledText } from '../util/parse-messages';
import { FileInfo } from 'types/fileInfo';
import MoveProjectDialog from './MoveProjectDialog';
import Classroom from 'ivygate/dist/types/classroomTypes';
import CreateUserDialog from './CreateUserDialog';
import RemoveUserFromClassroomDialog from './RemoveUserFromClassroomDialog';
import MoveUserToClassroomDialog from './MoveUserToClassroomDialog';
import CreateClassroomDialog from './CreateClassroomDialog';


export interface RootPublicProps {
  propClassroom?: Classroom | null;
  propFileName: string;
  propProject: Project;
  otherFileType?: string;
  propUser: User;
  propContextMenuClassroom?: Classroom;
  propContextMenuUser?: User;
  propContextMenuFile?: string;
  loadUserDataFlag: boolean;
  addNewClassroomFlag?: boolean;
  addNewUserFlag?: boolean;
  addNewProject: boolean;
  addNewFile: boolean;
  simpleProjectLoadFlag?: boolean;
  clickFile: boolean;
  deleteClassroomFlag?: boolean;
  moveUserFlag?: boolean;
  removeUserFlag?: boolean;
  deleteUserFlag?: boolean;
  downloadUserFlag?: boolean;
  renameClassroomFlag?: boolean;
  renameUserFlag?: boolean;
  renameProjectFlag?: boolean;
  moveProjectFlag?: boolean;
  isLeftBarOpen: boolean;
  deleteProjectFlag?: boolean;
  downloadProjectFlag?: boolean;
  deleteFileFlag?: boolean;
  downloadFileFlag?: boolean;
  renameFileFlag?: boolean;
  reloadUserFlag?: boolean;
  reloadRootUserFlag?: boolean;
  propActiveLanguage: ProgrammingLanguage;
  propContextMenuProject?: Project;
  propedTheme: Theme;
  propSettings: Settings;
  propedMotorPositions?: { [key: string]: number };
  stoppedMotor?: number;
  propedStoppedMotorFlag?: boolean;
  propedStoppedAllMotorsFlag?: boolean;
  propedMotorView?: 'Power' | 'Velocity';
  propedServoPositions?: ServoType[];
  enabledServo?: ServoType;
  disabledServos?: ServoType[];
  propedEnabledServoFlag?: boolean;
  propedDisabledServoFlag?: boolean;
  propedStoppedAllServosFlag?: boolean;
  propedSensorDisplayFlag?: boolean;
  propedSensorSelection: SensorSelectionKey[];
  propedTerminalDisplayFlag?: boolean;

  propedUploadUser: User | UploadedUser;
  propedUploadUserFlag: boolean;
  propedUploadProject: Project | UploadedProject;
  propedUploadFiles: FileInfo[];
  propedUploadFilesFlag: boolean;
  propedUploadedProjectFlag: boolean;
  propedPasteData?: {};
  changeProjectName: (projectName: string) => void;
  setAddNewProject: (addNewProject: boolean, newProj?: Project) => void;
  setAddNewFile: (addNewFile: boolean) => void;
  setClickFile: (clickFile: boolean) => void;
  setRootInfo: (user: User, project: Project, fileName: string, activeLanguage: ProgrammingLanguage) => void;
  setFileName_: (fileName: string) => void;
  onClassroomUpdate: (classrooms: Classroom[]) => void;
  onUserUpdate: (users: User[]) => void;
  onLoadUserData: (userData: Project[], loadedUser?: User, renamedUser?: boolean, oldUserName?: string) => void;
  onLoadClassroomData: (classroomData: Classroom[], user: User) => void;
  resetAddNewUserFlag: (addNewUserFlag: boolean) => void;
  resetAddNewClassroomFlag: (addNewClassroomFlag: boolean) => void;
  resetDeleteClassroomFlag: (deleteClassroomFlag: boolean) => void;
  resetDeleteUserFlag: (deleteUserFlag: boolean) => void;
  resetRemoveUserFlag: (removeUserFlag: boolean) => void;
  resetDeleteProjectFlag: (deleteProjectFlag: boolean) => void;
  resetDeleteFileFlag: (deleteFileFlag: boolean) => void;
  resetDownloadUserFlag: (downloadUserFlag: boolean) => void;
  resetDownloadProjectFlag: (downloadProjectFlag: boolean) => void;
  resetDownloadFileFlag: (downloadFileFlag: boolean) => void;
  resetUploadUserFlag: (uploadUserFlag: boolean) => void;
  resetUploadFilesFlag: (uploadFilesFlag: boolean) => void;
  resetUploadProjectFlag: (uploadProjectFlag: boolean) => void;
  resetFileExplorerFileSelection: (resetSelectionToFile: string) => void;
  resetFileExplorerProjectSelection: (resetSelectionToProject: Project, resetSelectionToFile: string) => void;
  resetRenameFlag: (renameFlag: boolean, renameType?: string) => void;
  resetRenameUserFlag: (renameUserFlag: boolean, renamedUser?: User) => void;
  resetRenameProjectFlag: (renameProjectFlag: boolean, renamedProject?: Project) => void;
  resetRenameFileFlag: (renameFileFlag: boolean, renamedFile?: string) => void;
  resetStoppedMotorFlag: (stoppedMotorFlag: boolean) => void;
  resetStoppedAllMotorsFlag: (stoppedAllMotorsFlag: boolean) => void;
  resetEnabledServoFlag: (enabledServoFlag: boolean) => void;
  resetDisabledServoFlag: (disabledServoFlag: boolean) => void;
  resetMoveProjectFlag: (moveProjectFlag: boolean) => void;
  resetMoveUserFlag: (moveUserFlag: boolean) => void;
  setAnalogValues: (analogValue: number) => void;
  setDigitalValues: (digitalValue: number) => void;
  setAccelValues: (accelValue: number) => void;
  setGyroValues: (gyroValue: number) => void;
  setMagnetoValues: (magnetoValue: number) => void;
  setButtonValues: (buttonValue: number) => void;
  fileExplorerOnCreation: (user: User, project: Project) => void;
}

interface RootPrivateProps {
  editorRef: React.MutableRefObject<Editor>;
  locale: LocalizedString.Language;
  onClearConsole: () => void;
  onIndentCode: () => void;
  onDownloadCode: () => void;
  onResetCode: () => void;
  onDocumentationClick: () => void;
  onDocumentationPush: (location: DocumentationLocation) => void;
  onDocumentationSetLanguage: (language: 'c' | 'python') => void;
  onDocumentationGoToFuzzy: (query: string, language: 'c' | 'python') => void;
}

interface RootState {

  rootClassroom?: Classroom | null;
  rootUser: User;
  rootProject: Project,
  rootInterfaceMode?: InterfaceMode,
  toDeleteName_?: string;
  toDeleteType_?: string;
  toDownloadName_?: string;
  toDownloadType_?: string;
  toSaveName_?: string;
  toSaveType_?: string;
  toSaveCode_?: string;
  toRenameName_?: string;
  toRenameType_?: string;
  toMoveProject_?: Project;
  toMoveUser_?: User;
  toRemoveUser_?: User;
  toRemoveClassroom_?: Classroom;
  otherFileType?: string;
  tempNewFile?: string;
  projectName: string;
  fileName: string;
  userName: string;
  windowInnerHeight: number;
  isHomeStartOptionsVisible: boolean;
  isNewFileDialogVisible: boolean;
  isEditorPageVisible: boolean;
  isCreateProjectDialogVisible: boolean;
  isCreateNewUserDialogVisible: boolean;
  isOpenUserProject: boolean;
  isMoveProjectDialogVisible: boolean;
  isSaveCodePromptVisible: boolean;
  isRenameUserProjectFileDialogVisible: boolean;
  isRemoveUserFromClassroomDialogVisible: boolean;
  isMoveUserToClassroomDialogVisible: boolean;
  addNewProject: boolean;
  addNewFile: boolean;
  isRunning: boolean;
  compileStatus: 'idle' | 'compiling' | 'success' | 'warning' | 'error';
  clickFileState: boolean;
  deleteClassroomFlag_?: boolean;
  deleteUserFlag_?: boolean;
  deleteProjectFlag_?: boolean;
  deleteFileFlag_?: boolean;
  downloadUserFlag_?: boolean;
  downloadProjectFlag_?: boolean;
  downloadFileFlag_?: boolean;
  saveCodePromptFlag?: boolean;

  layout: Layout;
  activeLanguage: ProgrammingLanguage;
  modal: Modal;
  theme: Theme;
  settings: Settings;
  feedback: Feedback;
  editorConsole: StyledText;
  code: Dict<string>;
  includeFiles: [];
  srcFiles: [];
  userDataFiles: [];
  projects: Project[] | null;
  users: User[];
  messages: Message[];
  classrooms?: Classroom[];

  rootMotorPositions: { [key: string]: number };
  rootwidth: number;

  analog?: number;
}

type Props = RootPublicProps & RootPrivateProps;
type State = RootState;

// We can't set innerheight statically, becasue the window can change
// but we also must use innerheight to fix mobile issues
interface ContainerProps {
  $windowInnerHeight: number,

}

const RootContainer = styled('div', (props: ContainerProps & { rootwidth: number }) => ({

  width: '100%',
  height: `${props.$windowInnerHeight}px`, // fix for mobile, see https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html
  display: 'flex',
  flexDirection: 'column',
  //alignItems: 'center',
  justifyItems: 'center',
  overflow: 'visible',
  flex: '4 1 0',
  maxHeight: '100vh',
}));

const STDOUT_STYLE = (theme: Theme) => ({
  color: theme.color
});

const STDERR_STYLE = (theme: Theme) => ({
  color: 'red'
});

const STDWAR_STYLE = (theme: Theme) => ({
  color: theme.compileWarningColor
});

class Root extends React.Component<Props, State> {
  private editorRef: React.MutableRefObject<Editor>;
  private prevPropsRef: React.MutableRefObject<Props>;
  private toSaveCodeRef: React.MutableRefObject<Dict<string>>;

  constructor(props: Props) {
    super(props);

    this.state = {
      rootUser: {
        userName: '',
        interfaceMode: InterfaceMode.SIMPLE,
        projects: [],
        classroomName: '',
        type: 'user'
      },
      rootProject: {
        projectName: '',
        includeFolderFiles: [],
        srcFolderFiles: [],
        dataFolderFiles: [],
        projectLanguage: 'c'
      },
      layout: Layout.Side,
      activeLanguage: 'c',
      code: {
        'c': window.localStorage.getItem('code-c') || '',
        'cpp': window.localStorage.getItem('code-cpp') || '',
        'python': window.localStorage.getItem('code-python') || '',
        'plaintext': window.localStorage.getItem('code-plaintext') || '',
        'graphical': window.localStorage.getItem('code-graphical') || ''
      },
      modal: Modal.NONE,
      editorConsole: StyledText.text({ text: LocalizedString.lookup(tr('Welcome to the KIPR IDE!\n'), props.locale), style: STDOUT_STYLE(this.props.propedTheme) }),
      messages: [],
      settings: DEFAULT_SETTINGS,
      feedback: DEFAULT_FEEDBACK,
      windowInnerHeight: window.innerHeight,
      isHomeStartOptionsVisible: false,
      isNewFileDialogVisible: false,
      isEditorPageVisible: false,
      isCreateProjectDialogVisible: false,
      isCreateNewUserDialogVisible: false,
      isOpenUserProject: false,
      isMoveProjectDialogVisible: false,
      isSaveCodePromptVisible: false,
      isRenameUserProjectFileDialogVisible: false,
      isRemoveUserFromClassroomDialogVisible: false,
      isMoveUserToClassroomDialogVisible: false,
      clickFileState: false,
      projectName: '',
      fileName: '',
      userName: '',
      addNewProject: this.props.addNewProject,
      addNewFile: this.props.addNewFile,
      includeFiles: [],
      srcFiles: [],
      userDataFiles: [],
      users: [],
      projects: [],
      saveCodePromptFlag: false,
      isRunning: false,
      compileStatus: 'idle',
      theme: this.props.propedTheme,
      rootMotorPositions: {},
      rootwidth: 100
    };

    this.editorRef = React.createRef();
    this.prevPropsRef = React.createRef();
    this.toSaveCodeRef = { current: { 'c': '', 'cpp': '', 'python': '', 'plaintext': '', 'graphical': '' } };
  }

  async componentDidMount() {

    window.addEventListener('resize', this.onWindowResize_);
    await this.loadUsers();
    await this.loadClassrooms();
    this.setState({
      isHomeStartOptionsVisible: true
    })

    if (this.props.propUser.userName !== '' && this.props.propProject.projectName !== '' && this.props.propFileName !== '') {
      console.log("ROOT COMPDIDMOUNT ENDED with props: ", this.props);
      this.setState({
        rootUser: this.props.propUser,
        rootProject: this.props.propProject,
        userName: this.props.propUser.userName,
        projectName: this.props.propProject.projectName,
        fileName: this.props.propFileName,
        activeLanguage: this.props.propActiveLanguage,
        isOpenUserProject: true,
        isHomeStartOptionsVisible: false,
        isNewFileDialogVisible: false,
        isEditorPageVisible: true
      });
    }
  }

  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<RootState>): boolean {
    console.log("root shouldcompoupdate nextProps: ", nextProps);
    if (this.state.saveCodePromptFlag == true) {
      if (nextProps.propFileName === "") {
        return true;
      }
      else if ((nextProps.propFileName !== this.props.propFileName) || (nextProps.propProject !== this.props.propProject)) {
        this.saveFile_(nextProps.propFileName);
        return false;
      }

    }
    return true;
  }

  componentWillUnmount(): void {
    console.log("ROOT UNMOUNTED called");
    this.stopSensorWebSocket();
  }

  componentDidUpdate = async (prevProps: Props, prevState: State) => {

    console.log("Root componentDidUpdate called with props: ", this.props);
    console.log("Root componentDidUpdate prevProps: ", prevProps);
    console.log("Root componentDidUpdate state: ", this.state);
    console.log("Root componentDidUpdate prevState: ", prevState);
    console.log("Root componentDidUpdate toSaveCodeRef: ", this.toSaveCodeRef.current);
    const displayNowVisible = this.props.propedSensorDisplayFlag && !prevProps.propedSensorDisplayFlag;
    const displayNowHidden = !this.props.propedSensorDisplayFlag && prevProps.propedSensorDisplayFlag;


    if (prevProps.addNewClassroomFlag !== this.props.addNewClassroomFlag && this.props.addNewClassroomFlag) {
      this.addNewClassroom_();

    }
    if (prevProps.propedUploadUserFlag !== this.props.propedUploadUserFlag && this.props.propedUploadUserFlag) {
      console.log("Root compDidUpdate propedUploadUserFlag: ", this.props.propedUploadUserFlag);
      this.uploadUser_(this.props.propedUploadUser);
    }
    if (prevProps.propedPasteData !== this.props.propedPasteData && this.props.propedPasteData) {
      console.log("Root compDidUpdate toPasteData: ", this.props.propedPasteData);
      this.pasteObject(this.props.propedPasteData);
    }
    if (prevProps.renameClassroomFlag !== this.props.renameClassroomFlag && this.props.renameClassroomFlag) {
      console.log("Root compDidUpdate renameClassroomFlag: ", this.props.renameClassroomFlag);
      this.renameClassroom_();

    }
    if (prevProps.moveUserFlag !== this.props.moveUserFlag && this.props.moveUserFlag) {
      await this.loadUsers();
      const moveUser = Object.values(this.state.users).find(user => user.userName === this.props.propContextMenuUser?.userName);
      this.moveUserToClassroom_(moveUser);
    }
    if (prevProps.removeUserFlag !== this.props.removeUserFlag && this.props.removeUserFlag) {
      this.removeUserFromClassroom_(this.props.propContextMenuUser, this.props.propContextMenuClassroom);
    }
    if (prevProps.addNewUserFlag !== this.props.addNewUserFlag && this.props.addNewUserFlag) {
      this.addNewUser_();
    }
    if (prevProps.moveProjectFlag !== this.props.moveProjectFlag && this.props.moveProjectFlag) {
      console.log("Root compDidUpdate moveProjectFlag: ", this.props.moveProjectFlag);
      this.moveProject_();

    }
    if (prevProps.propedUploadedProjectFlag !== this.props.propedUploadedProjectFlag && this.props.propedUploadedProjectFlag) {

      console.log("UPLOADE PROJECT FLAG TRIGGERED");
      const uploadProjectResponse = await axios.post('/upload-project', {
        user: this.props.propedUploadUser,
        project: this.props.propedUploadProject,
        srcFiles: this.props.propedUploadProject.srcFolderFiles,
        includeFiles: this.props.propedUploadProject.includeFolderFiles,
        dataFiles: this.props.propedUploadProject.dataFolderFiles
      });

      if (uploadProjectResponse.status === 200) {

        this.props.onLoadUserData(await this.loadUserProjects(false, false, this.props.propedUploadUser as User), this.props.propedUploadUser as User, false);
        this.props.resetUploadProjectFlag(false); // Reset the flag and indicate success
        const files = this.props.propedUploadProject.srcFolderFiles as FileInfo[];
        const mainFile = files.find(file => file.name.includes('main'));

        if (mainFile) {

          console.log("UPDATE TOSAVECODEREF UPLOADpROJECT");
          this.toSaveCodeRef.current[this.props.propedUploadProject.projectLanguage] = mainFile.content;
        }
        this.props.setRootInfo(this.props.propedUploadUser as User, uploadProjectResponse.data.createdProject, mainFile.name, this.props.propedUploadProject.projectLanguage);

        this.setState({
          rootUser: this.props.propedUploadUser as User,
          rootProject: uploadProjectResponse.data.createdProject,
          userName: this.props.propedUploadUser.userName,
          projectName: uploadProjectResponse.data.createdProject.projectName,
          fileName: `main.${this.props.propedUploadProject.projectLanguage}`,
          activeLanguage: this.props.propedUploadProject.projectLanguage,
          isEditorPageVisible: true,
          isHomeStartOptionsVisible: this.state.isHomeStartOptionsVisible ? false : this.state.isHomeStartOptionsVisible,
        })
      }
      else {
        console.error("Root compDidUpdate uploadProjectResponse failed: ", uploadProjectResponse.data);
        this.props.resetUploadProjectFlag(false); // Reset the flag and indicate failure
      }

    }
    if (prevProps.propedUploadFilesFlag !== this.props.propedUploadFilesFlag && this.props.propedUploadFilesFlag) {


      const uploadFileResponse = await axios.post('/upload-file', {
        user: this.props.propedUploadUser,
        project: this.props.propedUploadProject,
        files: this.props.propedUploadFiles
      });

      if (uploadFileResponse.status === 200) {
        this.props.onLoadUserData(await this.loadUserProjects(false, false, this.props.propedUploadUser as User), this.props.propedUploadUser as User, false);
        if (this.props.propSettings.classroomView) {
          await this.loadUsers();
          await this.loadClassrooms();

        }
      }

    }

    if (prevProps.propedSensorSelection !== this.props.propedSensorSelection) {
      this.sendSensorMessage(this.props.propedSensorSelection);
    }

    if (displayNowVisible) {
      this.startSensorWebSocket(); // Create the connection
    }

    if (displayNowHidden) {
      this.stopSensorWebSocket(); // Clean up connection
    }

    if (prevProps.propedSensorSelection === this.props.propedSensorSelection && this.props.propedSensorSelection !== undefined && displayNowVisible) {
      if (this.props.propedSensorSelection !== null) {
        const trySend = () => {
          if (this.socket?.readyState === WebSocket.OPEN) {

            this.sendSensorMessage(this.props.propedSensorSelection);
          } else {
            setTimeout(trySend, 50);
          }
        };
        trySend();
      }
    }

    if (prevProps.renameUserFlag !== this.props.renameUserFlag && this.props.renameUserFlag) {
      this.renameUser_();
    }
    if (prevProps.renameProjectFlag !== this.props.renameProjectFlag && this.props.renameProjectFlag) {
      this.renameProject_();
    }
    if (prevProps.renameFileFlag !== this.props.renameFileFlag && this.props.renameFileFlag) {
      this.renameFile_();
    }

    if (prevProps.propedServoPositions !== this.props.propedServoPositions) {
      this.props.propedServoPositions.forEach((servo, index) => {
        const prev = prevProps.propedServoPositions[index];
        const next = this.props.propedServoPositions[index];

        const valueChanged = prev.value !== next.value;
        const enableChanged = prev.enable !== next.enable;

        if ((valueChanged || enableChanged)) {
          if (next.enable === true) {
            this.enableServo(next);
          }
          else if (next.enable === false) {
            this.disableServos([next]);
          }
          this.moveServo(next);
        }
      });
    }
    if (prevProps.propedMotorPositions !== this.props.propedMotorPositions) {
      if (this.props.propedStoppedMotorFlag && this.props.stoppedMotor !== undefined) {
        this.stopMotor(this.props.stoppedMotor);
        this.props.resetStoppedMotorFlag(false);
        this.setState({
          rootMotorPositions: this.props.propedMotorPositions
        });
      }
      else if (this.props.propedStoppedAllMotorsFlag) {
        this.stopAllMotors();
        this.props.resetStoppedAllMotorsFlag(false)
        this.setState({
          rootMotorPositions: this.props.propedMotorPositions
        })
      }
      else {
        Object.keys(this.props.propedMotorPositions).forEach(motor => {
          if (prevProps.propedMotorPositions[motor] !== this.props.propedMotorPositions[motor]) {
            let motorNumber: number = parseInt(motor.split(' ')[1]);
            let motorName = `Motor ${motorNumber}`;
            this.moveMotor(this.props.propedMotorView, motorNumber, this.props.propedMotorPositions[motorName]);
          }
        });
        this.setState({
          rootMotorPositions: this.props.propedMotorPositions
        });
      }
    }

    if (prevProps.reloadRootUserFlag !== this.props.reloadRootUserFlag && this.props.reloadRootUserFlag) {
      console.log("Root compDidUpdate reloadRootUserFlag: ", this.props.reloadRootUserFlag);
      const userProj = await this.loadUserProjects(false, false, this.props.propUser);
      console.log("Root compDidUpdate usrProj: ", userProj);
      console.log("Root compDidUpdate reloadRootUserFlag: ", this.props.reloadRootUserFlag);
      this.props.onLoadUserData(userProj);
    }
    if (prevProps.reloadUserFlag !== this.props.reloadUserFlag && this.props.reloadUserFlag) {
      this.props.onUserUpdate(await this.loadUsers());

    }

    if (prevProps.propedTheme.themeName !== this.props.propedTheme.themeName) {
      const messages = this.state.messages;

      const getStyleForText = (text: string): React.CSSProperties => {
        const matchedMessage = messages.find(
          m => m.message === text || m.file === text
        );

        if (matchedMessage) {
          switch (matchedMessage.severity) {
            case "error":
              return STDERR_STYLE(this.props.propedTheme);
            case "warning":
              return STDWAR_STYLE(this.props.propedTheme);
            default:
              return STDOUT_STYLE(this.props.propedTheme);
          }
        }

        return STDOUT_STYLE(this.props.propedTheme);
      };

      const applyStyleUpdate = (node: StyledText): StyledText => {
        switch (node.type) {
          case StyledText.Type.Text:
            return {
              ...node,
              style: {
                ...node.style,
                ...getStyleForText(node.text)
              }
            };
          case StyledText.Type.Composition:
            return {
              ...node,
              items: node.items.map(applyStyleUpdate)
            };
          default:
            return node;
        }
      };


      const updatedConsole = applyStyleUpdate(this.state.editorConsole);

      this.setState({
        theme: this.props.propedTheme,
        editorConsole: updatedConsole,
      });
    }


    if (prevProps.addNewProject !== this.props.addNewProject) {
      if (this.props.addNewProject) {
        this.setState({
          rootUser: this.props.propUser,
          userName: this.props.propUser.userName,
          modal: Modal.CREATEPROJECT,
        });
      }
    }

    if (prevProps.loadUserDataFlag !== this.props.loadUserDataFlag && this.props.loadUserDataFlag) {
      const userProj = await this.loadUserProjects(false, false, this.props.propUser);
      console.log("Root compDidUpdate usrProj: ", userProj);
      this.props.onLoadUserData(userProj, this.props.propUser, false, this.props.propUser.userName);

    }

    if (prevProps.deleteClassroomFlag !== this.props.deleteClassroomFlag && this.props.deleteClassroomFlag) {
      this.deleteClassroom_();
    }
    if (prevProps.deleteUserFlag !== this.props.deleteUserFlag && this.props.deleteUserFlag) {
      this.deleteUser_();
    }
    if (prevProps.deleteProjectFlag !== this.props.deleteProjectFlag && this.props.deleteProjectFlag) {
      this.deleteProject_();
    }

    if (prevProps.deleteFileFlag !== this.props.deleteFileFlag && this.props.deleteFileFlag) {
      this.deleteFile_();
    }

    if (prevProps.downloadUserFlag !== this.props.downloadUserFlag && this.props.downloadUserFlag) {
      this.downloadUser_();
    }

    if (prevProps.downloadProjectFlag !== this.props.downloadProjectFlag && this.props.downloadProjectFlag) {
      this.downloadProject_();
    }

    if (prevProps.downloadFileFlag !== this.props.downloadFileFlag && this.props.downloadFileFlag) {
      this.downloadFile_();
    }

    if (prevProps.addNewFile !== this.props.addNewFile) {

      if (this.props.addNewFile) {
        const { propUser, propProject } = this.props;
        switch (this.props.otherFileType) {
          case 'h':
            this.setState({
              activeLanguage: this.props.propActiveLanguage
            });
            break;
          case 'c':
            this.setState({
              activeLanguage: 'c'
            });
            break;
          case 'cpp':
            this.setState({
              activeLanguage: 'cpp'
            });
            break;
          case 'py':
            this.setState({
              activeLanguage: 'python'
            });
            break;
          case 'txt':
            this.setState({
              activeLanguage: 'plaintext'
            });
            break;

        }

        this.setState({
          isNewFileDialogVisible: true,
          modal: Modal.CREATEFILE,
          rootUser: propUser,
          rootProject: propProject,
          userName: propUser.userName,
          projectName: propProject.projectName,
        })

      }
    }
    if (((this.state.tempNewFile) && this.state.saveCodePromptFlag == false)) {
      this.setState({
        rootUser: this.props.propUser,
        rootProject: this.props.propProject,
        userName: this.props.propUser.userName,
        projectName: this.props.propProject.projectName,
        otherFileType: this.props.otherFileType,
        fileName: this.state.tempNewFile,
        clickFileState: false,
        activeLanguage: this.props.propActiveLanguage,
      });

      if (this.state.isHomeStartOptionsVisible == true) {
        this.setState({
          isHomeStartOptionsVisible: false
        });
      }

      if (this.state.isEditorPageVisible == false) {
        this.setState({
          isEditorPageVisible: true
        });
      }

      console.log("UPDATE CODE CALLED TEMPNEWFILE")
      this.updateCode(this.state.tempNewFile);
      this.props.setClickFile(false);
      this.clearTempName_();
    }

    if ((this.props.clickFile && this.state.saveCodePromptFlag == false)) {
      const { propUser, propProject, propActiveLanguage, propFileName, otherFileType, propClassroom } = this.props;
      console.log("Root compDidUpdate clickFile props: ", this.props);
      this.props.resetFileExplorerFileSelection(this.props.propFileName);
      switch (otherFileType) {
        case 'h':
          const rootUpdateHeader = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/include/${propFileName}` } });
          console.log("UPDATE TOSAVECODEREF CLICKFILE HEADER");
          this.toSaveCodeRef.current[propActiveLanguage] = rootUpdateHeader.data;
          this.setState({
            code: {
              ...this.state.code,
              [propActiveLanguage]: rootUpdateHeader.data
            },
            isHomeStartOptionsVisible: false
          });

          break;
        case 'src':
          let rootUpdateCode: AxiosResponse<string>;
          console.log("compDidUPdate clickfile props: ", this.props);
          rootUpdateCode = this.state.tempNewFile ?
            await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/src/${this.state.tempNewFile}` } }) :
            await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/src/${propFileName}` } });
          console.log("Root compdidUPdate clickFiletoSaveCodeRef: ", this.toSaveCodeRef.current);
          this.setState({
            code: {
              ...this.state.code,
              [propActiveLanguage]: rootUpdateCode.data
            },
            isHomeStartOptionsVisible: false
          }, () => {
            console.log("UPDATE TOSAVECODEREF CLICKFILE SRC");
            //this.toSaveCodeRef.current[propActiveLanguage] = rootUpdateCode.data;
          });

          break;
        case 'txt':
          const rootUpdateUserFiles = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/data/${propFileName}` } });
          this.setState({
            code: {
              ...this.state.code,
              [propActiveLanguage]: rootUpdateUserFiles.data
            },
            isHomeStartOptionsVisible: false
          });
          console.log("UPDATE TOSAVECODEREF CLICKFILE DATA FILES");
          this.toSaveCodeRef.current[propActiveLanguage] = rootUpdateUserFiles.data;
          break;
      }

      this.setState({
        rootUser: Object.values(this.state.users).find(user => user.userName === propUser.userName) || this.state.rootUser,
        rootProject: this.props.propProject,
        userName: this.props.propUser.userName,
        projectName: this.props.propProject.projectName,
        fileName: this.props.propFileName,
        otherFileType: this.props.otherFileType,
        clickFileState: false,
        activeLanguage: this.props.propActiveLanguage,
        isHomeStartOptionsVisible: false,
        isEditorPageVisible: true

      }, () => {
        console.log("UPDATE CODE CALLED CLICKFILE")
        this.updateCode(this.props.propFileName);
        this.props.setClickFile(false);
      });

    }

    this.prevPropsRef.current = this.props;
  }

  private socket?: WebSocket;


  private sendSensorMessage = (sensorSelections: SensorSelectionKey[]) => {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "stop-all" }));

      sensorSelections.forEach((sensorSelection) => {
        switch (sensorSelection) {
          case 'Analog':
            this.socket.send(JSON.stringify({ type: "start-analog" }));
            break;
          case "Digital":
            this.socket.send(JSON.stringify({ type: "start-digital" }));
            break;
          case "Accelerometer":
            this.socket.send(JSON.stringify({ type: "start-accelerometer" }));
            break;
          case "Gyroscope":
            this.socket.send(JSON.stringify({ type: "start-gyroscope" }));
            break;
          case "Magnetometer":
            this.socket.send(JSON.stringify({ type: "start-magnetometer" }));
            break;
          case "Button":
            this.socket.send(JSON.stringify({ type: "start-button" }));
            break;
          default:
            console.warn("Unknown sensor selection:", sensorSelection);
        }
      });

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "analog") {
            this.props.setAnalogValues(data.value);
          }
          if (data.type === "digital") {
            this.props.setDigitalValues(data.value);
          }
          if (data.type === "accel") {
            this.props.setAccelValues(data.value);
          }
          if (data.type === "gyro") {
            this.props.setGyroValues(data.value);
          }
          if (data.type === "magneto") {
            this.props.setMagnetoValues(data.value);
          }
          if (data.type === "button") {
            this.props.setButtonValues(data.value);
          }
        } catch (error) {
          console.error("Invalid WebSocket message:", error);
        }
      };
    }
  };
  private startSensorWebSocket = async () => {
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/sensors`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection opened');

    };

    this.socket.onclose = () => {
      console.log("WebSocket closed");
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  };

  private stopSensorWebSocket = () => {
    if (this.socket) {
      this.socket?.send(JSON.stringify({ type: "stop-all" }));
      this.socket.close();
      this.socket = undefined;
    }
  };


  private enableServo = async (servo: ServoType) => {
    let servoNumber: number = parseInt(servo.name.split(' ')[1]);
    let servoValue: number = servo.value;
    try {

      const servoResponse = await axios.post('/enable-servo', { servo: servoNumber, value: servoValue });
    }
    catch (error) {
      console.error("Root enableServo caught error: ", error);
    }
  }

  private disableServos = async (servos: ServoType[]) => {
    if (servos.length > 1) {
      try {
        const disableAllServosResponse = await axios.post('/disable-all-servos');

      }
      catch (error) {
        console.error("Root disableAllServos caught error: ", error);
      }
    }
    else {
      let servoNumber: number = parseInt(servos[0].name.split(' ')[1]);
      let servoValue: number = servos[0].value;

      try {

        const servoResponse = await axios.post('/disable-servo', { servo: servoNumber, value: servoValue });
      }
      catch (error) {
        console.error("Root disableServo caught error: ", error);
      }
    }
  }

  private moveServo = async (servo: ServoType) => {
    let servoNumber: number = parseInt(servo.name.split(' ')[1]);
    let servoValue: number = servo.value;
    try {
      const servoResponse = await axios.post('/move-servo', { servo: servoNumber, value: servoValue });
    }
    catch (error) {
      console.error("Root moveServo caught error: ", error);
    }
  }

  private moveMotor = async (view: 'Power' | 'Velocity', motor: number, value: number) => {
    try {
      const motorResponse = await axios.post('/move-motor', { view: view, motor: motor, value: value });
    }
    catch (error) {
      console.error("Root moveMotor caught error: ", error);
    }
  }

  private stopMotor = async (motor: number) => {
    try {
      const motorResponse = await axios.post('/stop-motor', { motor: motor });

    }
    catch (error) {
      console.error("Root stopMotor caught error: ", error);
    }
  }

  private stopAllMotors = async () => {
    try {
      const allOffMotorResponse = await axios.post('/stop-all-motors');
    }
    catch (error) {
      console.error("Root stopAllMotors caught error: ", error);
    }
  }

  /**
   * Updates this.state.code with the contents of the file from tempNewFile
   * @param tempNewFile - the name of the file to update
   */
  private updateCode = async (tempNewFile: string) => {
    console.log("UPDATE TOSAVECODEREF updateCode ");

    const { propUser, propProject, propActiveLanguage, otherFileType } = this.props;
    switch (otherFileType) {
      case 'h':
        const rootUpdateHeader = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/include/${tempNewFile}` } });
        this.toSaveCodeRef.current[propActiveLanguage] = rootUpdateHeader.data;
        this.setState({
          code: {
            ...this.state.code,
            [propActiveLanguage]: rootUpdateHeader.data
          },
          saveCodePromptFlag: false
        });
        break;
      case 'c':
      case 'cpp':
      case 'py':
      case 'graphical':
        const rootUpdateCode = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/src/${tempNewFile}` } });

        console.log("Root updateCode fetched code: ", rootUpdateCode.data);
        this.setState({
          code: {
            ...this.state.code,
            [propActiveLanguage]: rootUpdateCode.data
          },
          saveCodePromptFlag: false
        }, () => {
          //this.toSaveCodeRef.current[propActiveLanguage] = rootUpdateCode.data;
        });
        break;
      case 'txt':
        const rootUpdateUserFiles = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/data/${tempNewFile}` } });
        this.toSaveCodeRef.current[propActiveLanguage] = rootUpdateUserFiles.data;
        this.setState({
          code: {
            ...this.state.code,
            [propActiveLanguage]: rootUpdateUserFiles.data
          },
          saveCodePromptFlag: false
        });
        break;
    }
  }

  private loadClassrooms = async (): Promise<Classroom[]> => {
    try {
      const getClassroomResponse = await axios.get('/load-classrooms', { params: { filePath: "/home/kipr/Documents/KISS" } });
      console.log("Root loadClassrooms response: ", getClassroomResponse.data);
      if (getClassroomResponse.data.classrooms.length == 0) {
        this.props.onClassroomUpdate([]);
        return [];
      }
      else {
        const classroomDirectories: Classroom[] = getClassroomResponse.data.classrooms.map((classroomData: any) => ({
          name: classroomData.name,
          users: classroomData.users,

        }));
        console.log("Root loadClassrooms classroomDirectories: ", classroomDirectories);

        const classroomArr: Classroom[] = classroomDirectories;

        const sortedClassrooms = classroomArr.sort((a, b) =>
          a.name.localeCompare(b.name)
        );



        this.setState({
          classrooms: sortedClassrooms,
        }, () => {
          this.props.onClassroomUpdate(sortedClassrooms);
          console.log("Root state: ", this.state);
        })
        return sortedClassrooms;

      }
    }
    catch (error) {
      console.error("Root loadClassrooms caught error: ", error);
      return [];
    }
  };
  private loadUsers = async (): Promise<User[]> => {
    try {
      const getUserResponse = await axios.get('/load-users', {
        params: { filePath: "/home/kipr/Documents/KISS" }
      });

      console.log("Root loadUsers response: ", getUserResponse.data);

      let users = getUserResponse.data.users;

      if (!users || Object.keys(users).length === 0) {
        this.props.onUserUpdate([]);
        return [];
      }

      const usersArr: User[] = Object.values(users);

      const sortedUsers = usersArr.sort((a, b) =>
        a.userName.localeCompare(b.userName)
      );

      console.log("Root loadUsers sortedUsers: ", sortedUsers);

      this.setState({ users: sortedUsers }, () => {
        this.props.onUserUpdate(this.state.users);
      });

      return sortedUsers;

    } catch (error) {
      console.error("Root loadUsers caught error: ", error);
      return [];
    }
  };



  private loadUserProjects = async (openedUserDialog?: boolean, createdUserDialog?: boolean, desiredUser?: User): Promise<Project[]> => {
    console.log("Root loadUserProjects called with openedUserDialog: ", openedUserDialog, " createdUserDialog: ", createdUserDialog, " desiredUser: ", desiredUser);
    let chosenUser: User;
    if ((openedUserDialog || createdUserDialog) && desiredUser) {
      chosenUser = desiredUser;
    }
    else if (desiredUser) {
      chosenUser = desiredUser;
    }
    else {
      chosenUser = this.props.propUser;
    }
    console.log("Root loadUserProjects chosenUser: ", chosenUser);
    try {

      const response = await axios.get('/get-projects', { params: { userName: chosenUser.userName } });
      console.log("Root loadUserProjects response: ", response.data);
      const userDirectories = response.data.directories;
      const userProjects = response.data.projects;

      console.log("Client sees includeFolderFiles:", userProjects[0].includeFolderFiles);

      const projects: Project[] = userProjects;


      console.log("Root loadUserProjects after mapping projects: ", projects);

      return projects;
    }
    catch (error) {
      console.error("Root loadUserProjects error: ", error);
      return [];
    }
  }

  private uploadUser_ = async (toUploadUser: User | UploadedUser) => {
    console.log("Root uploadUser_ called with toUploadUser: ", toUploadUser);
    let classroomName = '';
    let configFile;
    if ('configFile' in toUploadUser && toUploadUser.configFile) {
      configFile = toUploadUser.configFile;
    }
    if ('classroomName' in toUploadUser && toUploadUser.classroomName) {
      classroomName = toUploadUser.classroomName || '';
    }
    console.log("Root uploadUser_ configFile: ", configFile);

    const uploadedUser: User = {
      userName: toUploadUser.userName,
      interfaceMode: toUploadUser.interfaceMode,
      projects: toUploadUser.projects as Project[] || [],
      classroomName: classroomName,
      type: 'user'
    }
    const uploadResponse = await axios.post('/upload-user', { user: uploadedUser, configFile: configFile });
    console.log("Root uploadUser_ uploadResponse: ", uploadResponse);

    if (uploadResponse.status === 200) {
      console.log("Root uploadUser_ successful upload: ", uploadResponse.data);
      await this.loadUsers();
      this.props.resetUploadUserFlag(false); // Reset the flag and indicate success
      if (this.props.propSettings.classroomView) {
        const updatedClassrooms = await this.loadClassrooms();
        console.log("Root onCloseProjectDialog_ updatedClassrooms: ", updatedClassrooms);

        this.props.onLoadClassroomData(updatedClassrooms, this.state.rootUser);


      }
    }
  }

  private pasteObject = async (toPasteData: {}) => {
    console.log("Root pasteObject called with toPasteData: ", toPasteData);
    const pasteResponse = await axios.post('/paste-object', { pasteData: toPasteData });
    console.log("Root pasteObject pasteResponse: ", pasteResponse);
    if (pasteResponse.status === 200) {
      console.log("Root pasteObject successful paste: ", pasteResponse.data);
      await this.loadUsers();

    }

  }

  private addNewClassroom_ = () => {
    this.setState({
      modal: Modal.CREATECLASSROOM,

    });
  }

  private addNewUser_ = () => {
    this.setState({
      modal: Modal.CREATEUSER,

    }, () => {
      this.props.resetAddNewUserFlag(false);
    })
  }

  private deleteClassroom_ = () => {
    this.setState({
      modal: Modal.DELETEUSERPROJECTFILE,
      deleteClassroomFlag_: true,
      rootUser: this.props.propUser,
      userName: this.props.propUser.userName,
      toDeleteName_: this.props.propContextMenuClassroom.name,
      toDeleteType_: 'classroom'
    });

  }

  private deleteUser_ = () => {
    this.setState({
      modal: Modal.DELETEUSERPROJECTFILE,
      deleteUserFlag_: true,
      toDeleteName_: this.props.propContextMenuUser.userName,
      toDeleteType_: 'user'
    });
  }

  private deleteProject_ = () => {
    this.setState({
      modal: Modal.DELETEUSERPROJECTFILE,
      deleteProjectFlag_: true,
      rootUser: this.props.propUser,
      userName: this.props.propUser.userName,
      toDeleteName_: this.props.propContextMenuProject.projectName,
      toDeleteType_: 'project'

    });
  }

  private deleteFile_ = () => {
    this.setState({
      modal: Modal.DELETEUSERPROJECTFILE,
      deleteFileFlag_: true,
      rootUser: this.props.propUser,
      rootProject: this.props.propProject,
      userName: this.props.propUser.userName,
      projectName: this.props.propProject.projectName,
      toDeleteName_: this.props.propContextMenuFile,
      toDeleteType_: 'file'
    });
  }

  private downloadUser_ = () => {
    this.setState({
      modal: Modal.DOWNLOADUSERPROJECTFILE,
      downloadUserFlag_: true,
      toDownloadName_: this.props.propContextMenuUser.userName,
      toDownloadType_: 'user'
    });

  }

  private downloadProject_ = () => {
    this.setState({
      modal: Modal.DOWNLOADUSERPROJECTFILE,
      downloadProjectFlag_: true,
      rootUser: this.props.propUser,
      userName: this.props.propUser.userName,
      toDownloadName_: this.props.propContextMenuProject.projectName,
      toDownloadType_: 'project'
    });

  }

  private downloadFile_ = () => {
    this.setState({
      modal: Modal.DOWNLOADUSERPROJECTFILE,
      downloadFileFlag_: true,
      rootUser: this.props.propUser,
      rootProject: this.props.propProject,
      userName: this.props.propUser.userName,
      projectName: this.props.propProject.projectName,
      toDownloadName_: this.props.propContextMenuFile,
      toDownloadType_: 'file'
    });
  }

  private renameClassroom_ = () => {
    this.setState({
      modal: Modal.RENAMEUSERPROJECTFILE,
      isRenameUserProjectFileDialogVisible: true,
      toRenameName_: this.props.propContextMenuClassroom.name,
      toRenameType_: 'Classroom'
    })

  }

  private renameUser_ = () => {
    this.setState({
      modal: Modal.RENAMEUSERPROJECTFILE,
      isRenameUserProjectFileDialogVisible: true,
      toRenameName_: this.props.propContextMenuUser.userName,
      toRenameType_: 'User'
    })
  }

  private renameProject_ = () => {
    this.setState({
      modal: Modal.RENAMEUSERPROJECTFILE,
      isRenameUserProjectFileDialogVisible: true,
      toRenameName_: this.props.propContextMenuProject.projectName,
      toRenameType_: 'Project'
    })
  }

  private renameFile_ = () => {
    this.setState({
      modal: Modal.RENAMEUSERPROJECTFILE,
      isRenameUserProjectFileDialogVisible: true,
      toRenameName_: this.props.propContextMenuFile,
      toRenameType_: 'File'
    })
  }

  private moveProject_ = () => {
    this.setState({
      modal: Modal.MOVEPROJECT,
      isMoveProjectDialogVisible: true,
      toMoveProject_: this.props.propContextMenuProject,

    });
  }


  private saveFile_(tempNewFile_: string): void {

    this.props.setFileName_('');
    this.setState({
      modal: Modal.SAVEFILE,
      isSaveCodePromptVisible: true,
      toSaveName_: this.state.fileName,
      clickFileState: false,
      tempNewFile: tempNewFile_,
      toSaveType_: 'file',
    })
  }

  private removeUserFromClassroom_ = (user: User, classroom: Classroom) => {
    console.log("Root removeUserFromClassroom called with user: ", user, " classroom: ", classroom);
    this.setState({
      modal: Modal.REMOVEUSERFROMCLASSROOM,
      isRemoveUserFromClassroomDialogVisible: true,
      toRemoveUser_: user,
      toRemoveClassroom_: classroom,

    })
  };

  private moveUserToClassroom_ = (user: User) => {
    console.log("Root moveUserToClassroom_ called with user: ", user);
    this.setState({
      modal: Modal.MOVEUSERTOCLASSROOM,
      isMoveUserToClassroomDialogVisible: true,
      toMoveUser_: user
    });
  }

  private onWindowResize_ = () => {
    this.setState({ windowInnerHeight: window.innerHeight });
  };

  private onActiveLanguageChange_ = (language: ProgrammingLanguage) => {
    this.setState({
      activeLanguage: language
    }, () => {
      this.props.onDocumentationSetLanguage(language === 'python' ? 'python' : 'c');
    });
  };

  private onCloseRenameUserProjectFileDialog_ = async (renamedType: string, user: User, renamedData: {}) => {
    console.log("Root onCloseRenameUserProjectFileDialog_ renamedData: ", renamedData);
    if (renamedType === 'Classroom') {
      const updatedClassrooms = await this.loadClassrooms();
      console.log("Root onCloseRenameUserProjectFileDialog_ after loadClassrooms: ", updatedClassrooms);

      this.setState({
        classrooms: updatedClassrooms,
      });

      this.props.onClassroomUpdate(updatedClassrooms);
      this.props.resetRenameFlag(false, "Classroom");

      this.setState({
        modal: Modal.NONE,
        isRenameUserProjectFileDialogVisible: false,
      });

    }
    else if (renamedType === 'User') {

      user = {
        ...user,
        userName: renamedData['newUserName'],
      }
      let loadUserProject = await this.loadUserProjects(false, false, user);
      this.props.onLoadUserData(loadUserProject, user, true, renamedData['oldUserName']);

      //this.props.resetRenameUserFlag(false, user);
      this.props.resetRenameFlag(false, "User");

      if (this.state.isEditorPageVisible) {
        this.setState({
          rootUser: user,
        })
      }
      this.setState({
        modal: Modal.NONE,
        isRenameUserProjectFileDialogVisible: false,
      });
    }
    else if (renamedType === 'Project') {
      let newRenamedProject = {
        ...this.state.rootProject,
        projectName: renamedData['newProjectName'],
      }

      let loadUserProject = await this.loadUserProjects(false, false, user);
      this.props.onLoadUserData(loadUserProject, user);
      if (this.state.isEditorPageVisible) { // User Project file already open
        this.setState(prevState => ({
          rootUser: {
            ...prevState.rootUser,
            projects: prevState.rootUser.projects.map(project =>
              project.projectName === renamedData['oldProjectName']
                ? { ...project, projectName: renamedData['newProjectName'] }
                : project
            )
          },
          rootProject: {
            ...prevState.rootProject,
            projectName: renamedData['newProjectName']
          }
        }));
      }
      this.setState({
        modal: Modal.NONE,
        isRenameUserProjectFileDialogVisible: false,
      });
      this.props.resetRenameFlag(false, "Project");
    }
    else if (renamedType === 'File') {
      console.log("Root onCloseRenameUserProjectFileDialog_ renamedData: ", renamedData);
      const updatedUsers = await this.loadUsers();
      console.log("Root onCloseRenameUserProjectFileDialog_ after loadUsers: ", updatedUsers);
      const updatedUser =
        Object.values(updatedUsers).find(u => u.userName === this.state.rootUser.userName);

      const nextRootProject =
        updatedUser?.projects
          .filter(this.isProject)
          .find(p => p.projectName === this.state.rootProject.projectName)
        || this.state.rootProject;

      this.setState({
        rootUser: updatedUser || this.state.rootUser,
        rootProject: nextRootProject,
        fileName: renamedData["newFileName"],
      });

      this.setState({
        modal: Modal.NONE,
        isRenameUserProjectFileDialogVisible: false,
      });
      this.props.resetRenameFlag(false, "File");
    }
    await this.loadUsers();

    if (this.props.propSettings.classroomView) {
      await this.loadClassrooms();
    }
  }

  private onCloseMoveProjectDialog_ = async (newUser: User) => {
    console.log("Root onCloseMoveProjectDialog_ called");
    console.log("Root onCloseMoveProjectDialog_ newUser: ", newUser);

    let loadedUsers = await this.loadUsers();
    console.log("Root onCloseMoveProjectDialog_ loadedUsers: ", loadedUsers);

    const newlyModifiedUser = loadedUsers.find(user => user.userName === newUser.userName);
    console.log("Root onCloseMoveProjectDialog_ newlyModifiedUser: ", newlyModifiedUser);
    this.props.onLoadUserData(await this.loadUserProjects());
    this.setState({
      modal: Modal.NONE,
      isMoveProjectDialogVisible: false,
    }, async () => {
      this.props.resetMoveProjectFlag(false);

      if (this.state.isEditorPageVisible && (this.state.toMoveProject_.projectName === this.state.rootProject.projectName)) {
        //If just moved project is the one currently open, update the state to reflect the new project
        this.setState({
          rootProject: this.state.toMoveProject_,
          projectName: this.state.toMoveProject_.projectName,
          fileName: `main.${ProgrammingLanguage.FILE_EXTENSION[this.state.activeLanguage]}`,
          rootUser: newlyModifiedUser,
        }, async () => {
          this.props.onLoadUserData(await this.loadUserProjects(false, false, newlyModifiedUser), newlyModifiedUser);
          this.props.setRootInfo(this.state.rootUser, this.state.rootProject, this.state.fileName, this.state.activeLanguage);


        });

      }


    })
  };

  private onCloseProjectDialog_ = async (newProjName: string, newProjLanguage: ProgrammingLanguage, newInterfaceMode: InterfaceMode) => {
    const { rootUser, rootProject } = this.state;
    console.log("Root onCloseProjectDialog_ state: ", this.state);


    console.log("UPDATE TOSAVECODEREF oncloseProjectdialog ");
    this.toSaveCodeRef.current[newProjLanguage] = ProgrammingLanguage.DEFAULT_CODE[newProjLanguage];


    //update classroom specific user data

    let rootClassroomName = this.state.rootUser.classroomName;
    console.log("Root onCloseProjectDialog_ rootClassroom: ", rootClassroomName);


    console.log("Root onCloseProjectDialog_ state before setState: ", this.state);
    console.log("Root onCloseProjectDialog_ DEFAULT CODE: ", ProgrammingLanguage.DEFAULT_CODE[newProjLanguage]);
    this.setState(prevState => ({
      modal: Modal.NONE,
      rootUser: {
        ...prevState.rootUser,
        interfaceMode: newInterfaceMode ? newInterfaceMode : prevState.rootUser.interfaceMode,
        projects: [
          ...prevState.rootUser.projects,
          {
            projectName: newProjName,
            projectLanguage: newProjLanguage,
            includeFolderFiles: [],
            srcFolderFiles: [`main.${ProgrammingLanguage.FILE_EXTENSION[newProjLanguage]}`],
            dataFolderFiles: []
          }
        ]
      },
      rootProject: {
        projectName: newProjName,
        projectLanguage: newProjLanguage,
        includeFolderFiles: [],
        srcFolderFiles: [`main.${ProgrammingLanguage.FILE_EXTENSION[newProjLanguage]}`],
        dataFolderFiles: []
      },
      userName: prevState.userName,
      projectName: newProjName,
      activeLanguage: newProjLanguage,
      fileName: `main.${ProgrammingLanguage.FILE_EXTENSION[newProjLanguage]}`,
      code: {
        ...prevState.code,
        [newProjLanguage]: ProgrammingLanguage.DEFAULT_CODE[newProjLanguage]
      }

    }), async () => {

      console.log("Root onCloseProjectDialog_ after setState: ", this.state);
      console.log("UPDATE TOSAVECODEREF closeprojectdialog after state ");
      this.toSaveCodeRef.current[newProjLanguage] = ProgrammingLanguage.DEFAULT_CODE[newProjLanguage];

      console.log("Root onCloseProjectDialog_ toSaveCodeRef: ", this.toSaveCodeRef.current);



      try {
        const response = await axios.post('/initialize-project', { user: this.state.rootUser, project: this.state.rootProject, classroomName: rootClassroomName, interfaceMode: this.state.rootUser.interfaceMode });
        console.log("CreateProjectDialog response: ", response);

        if (response.status === 200) {
          await this.loadUsers();
          await this.loadClassrooms();
        }
      }
      catch (error) {

        console.error("Root onCloseProjectDialog_ intializing project error: ", error);
      }

      try {

        this.setState((prevState) => {
          const prevStateUsers = Array.isArray(prevState.users) ? prevState.users : (Object.values(prevState.users) as User[]);
          const userNames = prevStateUsers.map(user => user.userName);

          console.log("Root onCloseProjectDialog_ rootUser: ", this.state.rootUser);
          if (!userNames.includes(this.state.rootUser.userName)) {
            prevStateUsers.push(this.state.rootUser);

          }
          console.log("Root onCloseProjectDialog_ prevStateUsers: ", prevStateUsers);

          return { users: prevStateUsers };
        }, () => {

          this.props.onUserUpdate(this.state.users);
        });


      }
      catch (error) {
        console.error("Root onCloseProjectDialog_ error: ", error);
      }

      if (this.props.propSettings.classroomView && rootClassroomName && rootClassroomName !== '') {
        try {
          const classroomExists = this.state.classrooms.find(c => c.name === rootClassroomName);
          const userInClassroom = classroomExists?.users.find(u => u.userName === this.state.rootUser.userName);
          if (classroomExists && !userInClassroom) {
            console.log("Root onCloseProjectDialog_ rootClassroom exists: ", rootClassroomName);
            const addUserProjectToClassroomResponse = await axios.post('/add-user-project-to-classroom', {
              user: this.state.rootUser,

            });
            console.log("Root onCloseProjectDialog_ addUserProjectToClassroomResponse: ", addUserProjectToClassroomResponse);
          }
        }
        catch (error) {
          console.error("Root onCloseProjectDialog_ adding user to classroom error: ", error);
        }
      }

      if (this.state.isHomeStartOptionsVisible == true) {
        this.setState({
          isHomeStartOptionsVisible: false
        });
      }

      if (this.state.isEditorPageVisible == false) {
        this.props.fileExplorerOnCreation(this.state.rootUser, this.state.rootProject);
        this.setState({
          isEditorPageVisible: true
        });
      }



      console.log("Root onCloseProjectDialog_ rootUser: ", this.state.rootUser);
      const userProjects = await this.loadUserProjects(false, true, this.state.rootUser);
      console.log("Root onCloseProjectDialog_ userProjects: ", userProjects);
      console.log("Root onCloseProjectDialog_ rootUser: ", this.state.rootUser);
      this.props.onLoadUserData(await this.loadUserProjects(false, true, this.state.rootUser), this.state.rootUser);
      if (this.props.propSettings.classroomView) {
        const updatedClassrooms = await this.loadClassrooms();
        console.log("Root onCloseProjectDialog_ updatedClassrooms: ", updatedClassrooms);

        this.props.onLoadClassroomData(updatedClassrooms, this.state.rootUser);


      }
      else {
        this.props.onLoadUserData(await this.loadUserProjects(false, true, this.state.rootUser), this.state.rootUser);
      }
      if (this.props.addNewProject) {

        this.setState({
          addNewProject: false
        });
      }

      this.props.setAddNewProject(false, this.state.rootProject);

    });


  }

  private isProject(p: Project | SimClassroomProject): p is Project {
    return "includeFolderFiles" in p && "srcFolderFiles" in p && "dataFolderFiles" in p;
  }


  private onCloseNewFileDialog_ = async (newFileName: string, fileType: string) => {
    const prePath = `/home/kipr/Documents/KISS`;
    console.log("UPDATE TOSAVECODEREF closenewfiledialog ");
    let filePath = '';
    const { userName, activeLanguage, projectName } = this.state;
    console.log("Root onCloseNewFileDialog_ called with: ", { newFileName, fileType, userName, activeLanguage, projectName });
    switch (fileType) {
      case 'h':
        this.toSaveCodeRef.current[activeLanguage] = ProgrammingLanguage.DEFAULT_HEADER_CODE;

        this.setState(prevState => ({
          code: {
            ...prevState.code,
            [activeLanguage]: ProgrammingLanguage.DEFAULT_HEADER_CODE
          },
          rootProject: {
            ...prevState.rootProject,
            includeFolderFiles: [...prevState.rootProject.includeFolderFiles, `${newFileName}.h`]
          },
          rootUser: {
            ...prevState.rootUser,
            projects: prevState.rootUser.projects.map(p => {
              if (
                p.projectName === prevState.rootProject.projectName &&
                this.isProject(p)
              ) {
                return {
                  ...p,
                  includeFolderFiles: [...p.includeFolderFiles, `${newFileName}.h`],
                };
              }
              return p;
            }),
          }
        }), async () => {
          filePath = `${prePath}/${userName}/${projectName}/include/${newFileName}.h`;
          const fileContents = this.state.code[activeLanguage];
          await axios.post('/save-file-content', { filePath, fileContents });
          await this.loadUserProjects();
        }
        )
        break;
      case 'c':
      case 'cpp':
      case 'py':
        this.toSaveCodeRef.current[activeLanguage] = ProgrammingLanguage.BLANK_CODE[activeLanguage];

        this.setState(prevState => ({
          code: {
            ...prevState.code,
            [activeLanguage]: ProgrammingLanguage.BLANK_CODE[activeLanguage]
          },
          rootProject: {
            ...prevState.rootProject,
            srcFolderFiles: [...prevState.rootProject.srcFolderFiles, `${newFileName}.${fileType}`]
          },      
          rootUser: {
            ...prevState.rootUser,
            projects: prevState.rootUser.projects.map(p => {
              if (
                p.projectName === prevState.rootProject.projectName &&
                this.isProject(p)
              ) {
                return {
                  ...p,
                  includeFolderFiles: [...p.srcFolderFiles,`${newFileName}.${fileType}`],
                };
              }
              return p;
            }),
          }
           
        }), async () => {
          filePath = `${prePath}/${userName}/${projectName}/src/${newFileName}.${fileType}`;
          const fileContents = this.toSaveCodeRef.current[activeLanguage];
          await axios.post('/save-file-content', { filePath, fileContents });
          await this.loadUserProjects();

        });

        break;
      case 'txt':
        this.toSaveCodeRef.current[activeLanguage] = ProgrammingLanguage.DEFAULT_USER_DATA_CODE;


        this.setState(prevState => ({
          code: {
            ...prevState.code,
            [activeLanguage]: ProgrammingLanguage.DEFAULT_USER_DATA_CODE
          },
          rootProject: {
            ...prevState.rootProject,
            dataFolderFiles: [...prevState.rootProject.dataFolderFiles, `${newFileName}.txt`]
          },
          rootUser: {
            ...prevState.rootUser,
            projects: prevState.rootUser.projects.map(p => {
              if (
                p.projectName === prevState.rootProject.projectName &&
                this.isProject(p)
              ) {
                return {
                  ...p,
                  includeFolderFiles: [...p.dataFolderFiles, `${newFileName}.txt`],
                };
              }
              return p;
            }),
          }
         
        }), async () => {
          filePath = `${prePath}/${userName}/${projectName}/data/${newFileName}.txt`;
          const fileContents = this.state.code[activeLanguage];
          await axios.post('/save-file-content', { filePath, fileContents });
          await this.loadUserProjects();
        });
        break;
    }

    this.props.resetFileExplorerFileSelection(`${newFileName}.${fileType}`);

    this.setState({
      isCreateProjectDialogVisible: false,
      modal: Modal.NONE,
      fileName: `${newFileName}.${fileType}`,
      projectName: this.props.propProject.projectName,
    }, async () => {
      this.props.onLoadUserData(await this.loadUserProjects(), this.state.rootUser)

      if (this.state.isHomeStartOptionsVisible == true) {
        this.setState({
          isHomeStartOptionsVisible: false
        });
      }

      if (this.state.isEditorPageVisible == false) {
        this.setState({
          isEditorPageVisible: true
        });
      }

      this.props.setAddNewFile(false);

    });
  }

  private onCreateProjectDialogOpen_ = (name: string, interfaceMode: InterfaceMode, classroom?: Classroom | null) => {
    console.log("CreateProjectDialog opened with:", { name, interfaceMode, classroom });
    console.log("Root onCreateProjectDialogOpen_ state before setState: ", this.state);

    let newRootUser = this.state.rootUser.userName !== name ?
      { userName: name, interfaceMode: interfaceMode, projects: [], classroomName: classroom ? classroom.name : this.state.rootUser.classroomName, type: 'user' as const } : this.state.rootUser;
    this.setState({
      rootUser: newRootUser,
      rootInterfaceMode: interfaceMode,
      userName: name,
      isCreateNewUserDialogVisible: false,
      isCreateProjectDialogVisible: true,
      modal: Modal.CREATEPROJECT
    });
  }

  private onEditorPageOpen_ = () => {
    this.setState({
      isHomeStartOptionsVisible: false,
      isNewFileDialogVisible: false,
      isEditorPageVisible: true
    });
  };

  private handleFileNameChange = (name: string) => {
    this.setState({
      fileName: name
    });
  }

  private onOpenUserProject_ = async (passedUser: User, project: Project, fileName: string, projectLanguage: ProgrammingLanguage) => {
    const [file, extension] = fileName.split('.');
    let filePath = '';

    switch (extension) {
      case 'c':
      case 'cpp':
      case 'py':
      case 'graphical':
        filePath = `/home/kipr/Documents/KISS/${passedUser.userName}/${project.projectName}/src/${fileName}`;
        break;
      case 'h':
        filePath = `/home/kipr/Documents/KISS/${passedUser.userName}/${project.projectName}/include/${fileName}`;
        break;
      case 'txt':
        filePath = `/home/kipr/Documents/KISS/${passedUser.userName}/${project.projectName}/data/${fileName}`;
        break;
    }
    const getProjects = await this.loadUserProjects(true, false, passedUser);
    let toOpenProject = getProjects.find(project => project.projectName === project.projectName);
    let toOpenProjectMainCode = await axios.get('/get-file-contents', { params: { filePath: `${filePath}` } });
    console.log("UPDATE TOSAVECODEREF openuserproject ");
    this.toSaveCodeRef.current[projectLanguage] = toOpenProjectMainCode.data;
    this.setState({
      rootUser: passedUser,
      userName: passedUser.userName,
      projectName: project.projectName,
      rootProject: project,
      activeLanguage: project.projectLanguage,
      code: {
        ...this.state.code,
        [project.projectLanguage]: toOpenProjectMainCode.data
      },
      fileName: fileName,
      isEditorPageVisible: true,
    }, async () => {
      this.props.setRootInfo(passedUser, project, fileName, projectLanguage);
      this.props.onLoadUserData(await this.loadUserProjects(false, true, this.state.rootUser), this.state.rootUser);
    });

    if (this.state.isHomeStartOptionsVisible == true) {
      this.setState({
        isHomeStartOptionsVisible: false
      });
    }


  }

  private onChangeProjectName = (name: string) => {
    this.setState({
      projectName: name
    });
  }

  private onCodeChange_ = (code: string) => {
    const { activeLanguage } = this.state;
    console.log("UPDATE TOSAVECODEREF ONCODECHANGE ");
    const prevCode = this.toSaveCodeRef.current?.[activeLanguage] ?? "";
    const defaultCode = ProgrammingLanguage.DEFAULT_CODE[activeLanguage];
    console.log("onCodeChange_ called with code: ", code);
    console.log("OnCodeChange prevCode: ", prevCode);
    console.log("OnCodeChange toSaveCodeRef.current[C] ", this.toSaveCodeRef.current['c']);
    const theSame = code === this.toSaveCodeRef.current[activeLanguage];
    console.log("onCodeChange_ theSame: ", theSame);
    // Compare before updating
    if (prevCode !== defaultCode && prevCode !== '') {
      if (code === this.state.code[activeLanguage]) {
        // No change in code, do nothing
        console.log("onCodeChange_ code is same as previous, no change.");

      }
      else if (prevCode !== code && this.state.saveCodePromptFlag === false) {
        console.log("onCodeChange_ setting saveCodePromptFlag to true");
        this.setState(
          {
            saveCodePromptFlag: true,
          });
      }
    }
    if (!this.toSaveCodeRef.current || Object.keys(this.toSaveCodeRef.current).length === 0) {
      console.warn('⚠️ this.toSaveCodeRef.current is unexpectedly empty in onCodeChange_', this.toSaveCodeRef.current);
      console.trace();
    }
    // Update ref after checking
    this.toSaveCodeRef.current[activeLanguage] = code;

    console.log("onCodeChange_ called toSaveCodeRef.current: ", this.toSaveCodeRef.current);
  };


  private eventSource: EventSource | null = null;
  private onErrorMessageClick_ = (line: number) => () => {
    if (this.editorRef.current) this.editorRef.current.ivygate.revealLineInCenter(line);
  };

  private onRunClick_ = async () => {
    const { props, state } = this;
    const { locale } = props;
    const { activeLanguage, editorConsole, userName, projectName, fileName } = state;

    this.onSaveCode_();
    this.setState({ isRunning: true });
    programRunContextHelper.setIsRunning(true);

    this.eventSource = new EventSource(`/run-code?userName=${userName}&projectName=${projectName}&fileName=${fileName}&activeLanguage=${activeLanguage}`);

    let nextConsole = StyledText.extend(editorConsole, StyledText.text({
      text: LocalizedString.lookup(tr('Running...\n'), locale),
      style: STDOUT_STYLE(this.state.theme)
    }));

    this.setState({ editorConsole: nextConsole });

    // Listen for streamed output
    this.eventSource.onmessage = (event) => {
      let output = event.data;

      const filteredLines = output.split("\n").filter(line => {
        // Remove all lines that start with [core/wombat]
        return !line.startsWith("[core/wombat]");
      });

      if (filteredLines.length === 0) return; // nothing to append

      const cleanOutput = filteredLines.join("\n");

      this.setState((prevState) => ({
        editorConsole: StyledText.extend(
          prevState.editorConsole,
          StyledText.text({
            text: LocalizedString.lookup(tr(cleanOutput + '\n'), locale),
            style: STDOUT_STYLE(prevState.theme)
          })
        )
      }));
    };

    this.eventSource.onerror = (error) => {
      this.eventSource.close();
      this.setState({ isRunning: false });
      programRunContextHelper.setIsRunning(false);
    };

    // Close connection when the process ends
    this.eventSource.addEventListener("end", () => {

      this.eventSource.close();
      this.setState({ isRunning: false });
      programRunContextHelper.setIsRunning(false);
    });
  };

  private onStopClick_ = async () => {
    await fetch("/stop-code", { method: "POST" });
    if (this.eventSource) {
      this.eventSource.close();
      this.setState({ isRunning: false });
      programRunContextHelper.setIsRunning(false);
    }
  };

  private onCompileClick_ = async () => {
    const { locale } = this.props;
    const { userName, projectName, fileName, activeLanguage } = this.state;

    try {
      console.log("UPDATE TOSAVECODEREF ONCOMPILECLICK ");
      if (this.toSaveCodeRef !== undefined && this.toSaveCodeRef.current[activeLanguage] != '') {
        await this.onSaveCode_();
      }

      let compilingConsole: StyledText = StyledText.text({
        text: LocalizedString.lookup(tr(''), locale),
        style: STDOUT_STYLE(this.state.theme)
      });
      compilingConsole = StyledText.extend(compilingConsole, StyledText.text({
        text: LocalizedString.lookup(tr('Compiling...\n'), locale),
        style: STDOUT_STYLE(this.state.theme)
      }));
      this.setState({
        editorConsole: compilingConsole,
        compileStatus: 'idle'
      }, async () => {

        let response: AxiosResponse<any>;
        let messages: Message[];

        if (activeLanguage === 'graphical') {

          if (this.toSaveCodeRef.current[activeLanguage] === undefined || this.toSaveCodeRef.current[activeLanguage] === '') {

            const failedResponse: AxiosResponse<any> = {
              data: { message: 'Nothing to compile!' },
              status: 200,
              statusText: 'OK',
              headers: {},
              config: {
                headers: undefined
              },
            };
            response = failedResponse;
          } else {
            response = await axios.post('/convert-xml-to-c', { filePath: `/home/kipr/Documents/KISS/${userName}/${projectName}/src/xmlToC.c`, xml: this.toSaveCodeRef.current[activeLanguage] });
            if (response.data.error === 'No blocks found!') {
              console.log("NO BLOCKS");

            }
            else {
              response = await axios.post('/compile-code', { userName, projectName, fileName: 'xmlToC.c', activeLanguage });

            }
          }

        }
        else {
          response = await axios.post('/compile-code', { userName, projectName, fileName, activeLanguage }); // This calls the backend route
          if(response){
            this.setState({ compileStatus: 'compiling'})
            if(response.status === 200){
              this.setState({ compileStatus: 'idle'})
            }
          }
        }
        let nextConsole: StyledText;

        switch (activeLanguage) {
          case 'c':
          case 'cpp': {

            if (response.data.message === 'successful') {

              
              if (response.data.warnings && response.data.warnings.length > 0) {
                this.setState({ compileStatus: 'warning'})
                messages = sort(parseMessages(response.data.warnings));
                for (const message of messages) {
                  if (nextConsole === undefined) {
                    console.log("Compile click messages: ", messages);
                    nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                      text: LocalizedString.lookup(tr(`${message.file}:${message.ranges[0].start.line}\n`), locale),
                      style: STDOUT_STYLE(this.state.theme)
                    }));
                  }
                  nextConsole = StyledText.extend(nextConsole, toStyledText(message, this.state.theme, {
                    onClick: message.ranges.length > 0
                      ? this.onErrorMessageClick_(message.ranges[0].start.line)
                      : undefined
                  }));

                }
                nextConsole = StyledText.extend(nextConsole, StyledText.text({
                  text: LocalizedString.lookup(tr('Compilation Succeeded with Warnings!\n'), locale),
                  style: STDOUT_STYLE(this.state.theme)
                }));
              }
              else {
                this.setState({ compileStatus: 'success'})
                nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                  text: LocalizedString.lookup(tr('Compilation Succeeded!\n'), locale),
                  style: STDOUT_STYLE(this.state.theme)
                }));
              }


            }

            else if (response.data.message === 'failed') {
              console.log("Compile click response: ", response);

              messages = sort(parseMessages(response.data.error));
              this.setState({ compileStatus: 'error'});


              for (const message of messages) {
                if (nextConsole === undefined) {

                  nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                    text: LocalizedString.lookup(tr(`${message.file}:${message.ranges[0].start.line}\n`), locale),
                    style: STDERR_STYLE(this.state.theme)
                  }));
                }
                nextConsole = StyledText.extend(nextConsole, toStyledText(message, this.state.theme, {
                  onClick: message.ranges.length > 0
                    ? this.onErrorMessageClick_(message.ranges[0].start.line)
                    : undefined
                }));

              }
              nextConsole = StyledText.extend(nextConsole, StyledText.text({
                text: LocalizedString.lookup(tr('Compilation failed.\n'), locale),
                style: STDERR_STYLE(this.state.theme)
              }));

            }
            this.setState({
              messages: messages,
              editorConsole: nextConsole
            });
            break;
          }
          case 'python': {
            if (response.data.message === 'successful') {
              nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                text: LocalizedString.lookup(tr('Compilation Succeeded!\n'), locale),
                style: STDOUT_STYLE(this.state.theme)
              }));
              this.setState({
                compileStatus: 'success'
              });
            }
            else {
              let wombatDirectory = '/home/kipr/Documents/KISS/';
              let filteredError = response.data.error.replaceAll(wombatDirectory, '');
              nextConsole = StyledText.extend(
                compilingConsole,
                StyledText.text({
                  text: LocalizedString.lookup(tr('Compilation Failed!\n'), locale) + filteredError,
                  style: STDERR_STYLE(this.state.theme),
                })
              );
              this.setState({
                compileStatus: 'error'
              });
            }
            this.setState({
              editorConsole: nextConsole
            });
            break;
          }
          case 'graphical': {

            if (response.data.error === 'No blocks found!') {

              nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                text: LocalizedString.lookup(tr('No blocks found! Please add blocks to your graphical project.\n'), locale),
                style: STDERR_STYLE(this.state.theme)
              }));
            } else if (response.data.message === 'Nothing to compile!') {
              nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                text: LocalizedString.lookup(tr('Nothing to compile! Please add blocks to your graphical project.\n'), locale),
                style: STDERR_STYLE(this.state.theme)
              }));

            }
            else if (response.data.message === 'successful') {
              nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                text: LocalizedString.lookup(tr('Compilation Succeeded!\n'), locale),
                style: STDOUT_STYLE(this.state.theme)
              }));
            }
            this.setState({
              editorConsole: nextConsole
            });
            break;
          }
        }

      });

    } catch (error) {
      console.error('Error running the code:', error);
    }
  };

  private onSaveClick_ = async () => {
    await this.onSaveCode_();
    const { locale } = this.props;

    let savingConsole: StyledText = StyledText.text({
      text: LocalizedString.lookup(tr(''), locale),
      style: STDOUT_STYLE(this.state.theme)
    });
    savingConsole = StyledText.extend(savingConsole, StyledText.text({
      text: LocalizedString.lookup(tr('Saving...\n'), locale),
      style: STDOUT_STYLE(this.state.theme)
    }));

    this.setState({
      editorConsole: savingConsole
    })
  }

  private onSaveCode_ = async () => {
    const [name, extension] = this.state.fileName.split('.');
    this.setState({
      saveCodePromptFlag: false
    }, async () => {
      const { userName, activeLanguage, projectName, fileName } = this.state;
      const fileContents = this.toSaveCodeRef.current[activeLanguage] || this.state.code[activeLanguage];
      const prePath = `/home/kipr/Documents/KISS`;
      let filePath = '';
      switch (extension) {
        case 'c':
        case 'cpp':
        case 'py':
        case 'graphical':

          filePath = `${prePath}/${userName}/${projectName}/src/${fileName}`;
          break;
        case 'txt':
          filePath = `${prePath}/${userName}/${projectName}/data/${fileName}`;
          break;
        case 'h':
          filePath = `${prePath}/${userName}/${projectName}/include/${fileName}`;
          break;

      }
      console.log("onSaveCode_ filePath: ", filePath);
      console.log("onSaveCode_ fileContents: ", fileContents);
      const updateFileContent = await axios.post('/save-file-content', { filePath, fileContents });
      if (updateFileContent.status === 200 && updateFileContent.data === 'File saved successfully') {
        let savedConsole: StyledText = StyledText.extend(this.state.editorConsole, StyledText.text({
          text: LocalizedString.lookup(tr('File saved successfully!\n'), this.props.locale),
          style: STDOUT_STYLE(this.state.theme)

        }));
        this.setState({
          editorConsole: savedConsole
        });
      }

      this.setState({
        code: {
          ...this.state.code,
          [this.state.activeLanguage]: fileContents
        },
        saveCodePromptFlag: false,
        toSaveCode_: undefined
      });
    });
  };


  /**
   * Actions to do after a dialog is closed after selecting "Yes"
   * @param confirmedName - name of the item to be confirmed
   * @param confirmedType - type of the item to be confirmed (user, project, file)
   * @param action - action to be taken (delete, download, save)
   */
  private onConfirm_ = async (confirmedName: string, confirmedType: string, action: string, object?: Classroom | User | Project | string) => {
    console.log("Root onConfirm_ state: ", this.state);
    console.log("Root onConfirm_ props: ", this.props);
    console.log("Root onConfirm_ object: ", object);
    try {
      switch (action) {
        case 'delete':
          this.onModalClose_();
          switch (confirmedType) {
            case 'classroom':
              const deleteClassroomResponse = await axios.post('/delete-classroom', { classroomName: confirmedName });
              if (deleteClassroomResponse.status === 200) {
                this.loadUsers();
                if (this.props.propSettings.classroomView) {
                  this.setState(prevState => ({
                    classrooms: prevState.classrooms.filter(classroom => classroom.name !== confirmedName)
                  }));
                  this.props.onClassroomUpdate(await this.loadClassrooms());
                  this.loadClassrooms();
                }
                this.props.resetDeleteClassroomFlag(false);
              }

              break;
            case 'user':
              const deleteUserResponse = await axios.post('/delete-user', { user: object });
              this.loadUsers();
              if (this.state.isEditorPageVisible && this.state.rootUser.userName === (object as User).userName) {
                this.setState({
                  isEditorPageVisible: false,
                  isHomeStartOptionsVisible: true
                });
              }
              if (this.props.propSettings.classroomView) {
                this.props.onClassroomUpdate(await this.loadClassrooms());
              }
              break;
            case 'project':
              const deleteProjectResponse = await axios.post('/delete-project', { userName: this.state.userName, projectName: confirmedName });
              //this.props.onLoadUserData(await this.loadUserProjects());
              this.loadUsers();
              if (this.state.isEditorPageVisible && this.state.rootProject.projectName === confirmedName) {
                this.setState({
                  isEditorPageVisible: false,
                  isHomeStartOptionsVisible: true
                });
              }
              if (this.props.propSettings.classroomView) {
                this.props.onClassroomUpdate(await this.loadClassrooms());
              }
              break;
            case 'file':
              const [name, extension] = confirmedName.split('.');
              const deleteFileResponse = await axios.post('/delete-file', { userName: this.state.userName, projectName: this.state.projectName, fileName: confirmedName, fileType: extension });
              this.loadUsers();

              //this.props.onLoadUserData(await this.loadUserProjects());
              if (this.state.isEditorPageVisible && this.state.fileName === confirmedName) {
                this.setState({
                  isEditorPageVisible: false,
                  isHomeStartOptionsVisible: true
                });
              }
              if (this.props.propSettings.classroomView) {
                this.props.onClassroomUpdate(await this.loadClassrooms());
              }
              break;
          }
          break;
        case 'download':
          this.onModalClose_();
          switch (confirmedType) {
            case 'user':
              try {
                const downloadUserResponse = await fetch('/download-zip', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userName: confirmedName }),
                });

                if (downloadUserResponse.ok) {
                  const blob = await downloadUserResponse.blob();
                  const url = URL.createObjectURL(blob);
                  const element = document.createElement('a');
                  element.href = url;
                  element.download = `${confirmedName}.zip`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);

                  URL.revokeObjectURL(url);
                } else {
                  const error = await downloadUserResponse.json();
                  console.error('Error downloading ZIP:', error.error);
                }
              }
              catch (error) {
                console.error("Error downloading ZIP:", error);
              }
              break;
            case 'project':
              try {
                const downloadUserResponse = await fetch('/download-zip', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userName: this.state.userName, projectName: confirmedName }),
                });

                if (downloadUserResponse.ok) {
                  const blob = await downloadUserResponse.blob();
                  const url = URL.createObjectURL(blob);

                  const element = document.createElement('a');
                  element.href = url;
                  element.download = `${confirmedName}.zip`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);

                  URL.revokeObjectURL(url);
                } else {
                  const error = await downloadUserResponse.json();
                  console.error('Error downloading ZIP:', error.error);
                }
              }
              catch (error) {
                console.error("Error downloading ZIP:", error);
              }
              break;
            case 'file':
              try {
                const downloadUserResponse = await fetch('/download-zip', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userName: this.state.userName, projectName: this.state.projectName, fileName: confirmedName }),
                });

                if (downloadUserResponse.ok) {
                  const blob = await downloadUserResponse.blob();
                  const url = URL.createObjectURL(blob);
                  const element = document.createElement('a');
                  element.href = url;
                  element.download = `${confirmedName}`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                  URL.revokeObjectURL(url);
                } else {
                  const error = await downloadUserResponse.json();
                  console.error('Error downloading ZIP:', error.error);
                }
              }
              catch (error) {
                console.error("Error downloading ZIP:", error);
              }
              break;
          }
          break;
        case 'save':
          console.log("UPDATE TOSAVECODEREF ONCONFIRM SAVE ");
          const [name, extension] = confirmedName.split('.');
          this.onModalClose_('save');
          let saveFileResponse = '';
          switch (extension) {
            case 'c':
              saveFileResponse = await axios.post('/save-file-content', { filePath: `/home/kipr/Documents/KISS/${this.state.userName}/${this.state.projectName}/src/${this.state.fileName}`, fileContents: this.toSaveCodeRef.current.c });
              this.setState({
                code: {
                  ...this.state.code,
                  [this.state.activeLanguage]: this.toSaveCodeRef.current[this.state.activeLanguage]
                },
                saveCodePromptFlag: false,
                fileName: this.state.tempNewFile,
                activeLanguage: 'c',
                toSaveCode_: undefined
              });
              break;
            case 'cpp':
              saveFileResponse = await axios.post('/save-file-content', { filePath: `/home/kipr/Documents/KISS/${this.state.userName}/${this.state.projectName}/src/${this.state.fileName}`, fileContents: this.toSaveCodeRef.current.cpp });
              this.setState({
                code: {
                  ...this.state.code,
                  [this.state.activeLanguage]: this.toSaveCodeRef.current[this.state.activeLanguage]
                },
                saveCodePromptFlag: false,
                fileName: this.state.tempNewFile,
                activeLanguage: 'cpp',
                toSaveCode_: undefined
              });
              break;
            case 'py':
              saveFileResponse = await axios.post('/save-file-content', { filePath: `/home/kipr/Documents/KISS/${this.state.userName}/${this.state.projectName}/src/${this.state.fileName}`, fileContents: this.toSaveCodeRef.current.python });
              this.setState({
                code: {
                  ...this.state.code,
                  [this.state.activeLanguage]: this.toSaveCodeRef.current[this.state.activeLanguage]
                },
                saveCodePromptFlag: false,
                fileName: this.state.tempNewFile,
                activeLanguage: 'python',
                toSaveCode_: undefined
              });
              break;
            case 'graphical':
              saveFileResponse = await axios.post('/save-file-content', { filePath: `/home/kipr/Documents/KISS/${this.state.userName}/${this.state.projectName}/src/${this.state.fileName}`, fileContents: this.toSaveCodeRef.current.graphical });
              this.setState({
                code: {
                  ...this.state.code,
                  [this.state.activeLanguage]: this.toSaveCodeRef.current[this.state.activeLanguage]
                },
                saveCodePromptFlag: false,
                fileName: this.state.tempNewFile,
                activeLanguage: 'graphical',
                toSaveCode_: undefined
              });
              break;
            case 'txt':
              saveFileResponse = await axios.post('/save-file-content', { filePath: `/home/kipr/Documents/KISS/${this.state.userName}/${this.state.projectName}/data/${this.state.fileName}`, fileContents: this.toSaveCodeRef.current.plaintext });
              this.setState({
                code: {
                  ...this.state.code,
                  [this.state.activeLanguage]: this.toSaveCodeRef.current[this.state.activeLanguage]
                },
                saveCodePromptFlag: false,
                fileName: this.state.tempNewFile,
                activeLanguage: 'plaintext',
                toSaveCode_: undefined
              });
              break;
            case 'h':
              saveFileResponse = await axios.post('/save-file-content', { filePath: `/home/kipr/Documents/KISS/${this.state.userName}/${this.state.projectName}/include/${this.state.fileName}`, fileContents: this.toSaveCodeRef.current[this.state.activeLanguage] });
              this.setState({
                code: {
                  ...this.state.code,
                  [this.state.activeLanguage]: this.toSaveCodeRef.current[this.state.activeLanguage]
                },
                saveCodePromptFlag: false,
                fileName: this.state.tempNewFile,
                toSaveCode_: undefined
              });
          }
          break;
      }
    }
    catch (error) {
      console.error("onConfirm_ caught error: ", error);
    }
  }

  private clearTempName_ = () => {
    this.setState({
      tempNewFile: ''
    })
  }

  private onDenySave_ = (denyType: string) => {
    if (denyType == 'continue') {
      this.setState({
        saveCodePromptFlag: false
      }, async () => {
        this.onModalClose_('deny,continue');
      });
    }
    else if (denyType == 'cancel') {
      this.onModalClose_('cancel');
    }
  }

  private onModalClose_ = async (action?: string) => {

    this.setState({ modal: Modal.NONE, deleteUserFlag_: false });

    if (this.props.addNewProject) {
      this.props.setAddNewProject(false);

      this.setState({
        projectName: this.props.propProject.projectName,
        fileName: this.props.propFileName,
        activeLanguage: this.props.propActiveLanguage
      });
    }

    if (this.props.addNewFile) {
      this.props.setAddNewFile(false);

      this.setState({
        projectName: this.props.propProject.projectName,
        fileName: this.state.fileName,
        activeLanguage: this.props.propActiveLanguage
      });
    }

    if (this.props.deleteUserFlag) {
      this.props.resetDeleteUserFlag(false);
    }
    if (this.props.deleteProjectFlag) {
      this.props.resetDeleteProjectFlag(false);
    }
    if (this.props.deleteFileFlag) {
      this.props.resetDeleteFileFlag(false);
    }
    if (this.props.downloadUserFlag) {
      this.props.resetDownloadUserFlag(false);
    }
    if (this.props.downloadProjectFlag) {
      this.props.resetDownloadProjectFlag(false);
    }
    if (this.props.downloadFileFlag) {
      this.props.resetDownloadFileFlag(false);
    }
    if (this.state.isSaveCodePromptVisible) {
      this.setState({
        isSaveCodePromptVisible: false
      });
    }
    if (this.props.clickFile) {
      this.props.setClickFile(false);
    }
    if (this.state.fileName || this.state.tempNewFile) {

      if (action == 'save') {
        this.props.resetFileExplorerFileSelection(this.state.tempNewFile);
      }
      else if (action == 'deny,continue') {

        this.props.resetFileExplorerFileSelection(this.state.tempNewFile);
      }
      else if (action == 'cancel') {
        this.props.resetFileExplorerProjectSelection(this.state.rootProject, this.state.fileName);
        if (this.state.tempNewFile) {
          this.setState({
            tempNewFile: ''
          })
        }
      }
    }
    if (this.props.renameClassroomFlag) {
      this.props.resetRenameFlag(false, "Classroom");
    }
    if (this.props.renameUserFlag) {
      this.props.resetRenameFlag(false, "User");
    }
    if (this.props.renameProjectFlag) {
      this.props.resetRenameFlag(false, "Project");
    }
    if (this.props.renameFileFlag) {
      this.props.resetRenameFlag(false, "File");
    }
    if (this.props.moveProjectFlag) {
      this.props.resetMoveProjectFlag(false);
    }
    if (this.props.addNewClassroomFlag) {
      this.props.resetAddNewClassroomFlag(false);
    }
    if (this.props.moveUserFlag) {
      this.props.resetMoveUserFlag(false);
    }
    if (this.props.removeUserFlag) {
      this.props.resetRemoveUserFlag(false);
    }
  }

  private onCloseRemoveUserFromClassroomDialog_ = () => {
    this.setState({
      modal: Modal.NONE,

    }, async () => {

      const removeUserResponse = await axios.post('/remove-user-from-classroom', {
        user: this.state.toRemoveUser_,
        classroom: this.state.toRemoveClassroom_
      });

      console.log("Remove user response: ", removeUserResponse.data);
      if (removeUserResponse.status === 200) {
        this.loadUsers();
        this.props.onClassroomUpdate(await this.loadClassrooms());
        this.props.resetRemoveUserFlag(false);
      }

      this.setState({
        toRemoveUser_: undefined,
        toRemoveClassroom_: undefined
      })
    });
  };

  private onCloseMoveUserToClassroomDialog_ = (user: User, newClassroom: Classroom) => {
    console.log("Closing move user dialog for:", user, "to classroom:", newClassroom);

    const { rootUser, users } = this.state;
    this.setState({
      modal: Modal.NONE,
    }, async () => {
      this.props.resetMoveUserFlag(false);
      const moveUserResponse = await axios.post('/move-user-to-classroom', {
        user: user,
        newClassroom: newClassroom
      });
      console.log("Move user response: ", moveUserResponse);

      if (moveUserResponse.status === 200) {
        if (rootUser.userName === user.userName) {
          this.setState({
            rootUser: {
              ...this.state.rootUser,
              classroomName: newClassroom.name
            }
          }, async () => {
            await this.loadUsers();
            console.log("Updated rootUser after moving user to classroom: ", this.state.rootUser);
            this.props.onLoadUserData(await this.loadUserProjects(), this.state.rootUser?.userName !== '' ? this.state.rootUser : undefined);
            this.props.onClassroomUpdate(await this.loadClassrooms());
          });
        }
        else {
          const foundUser = users.find(u => u.userName === user.userName);
          console.log("move User - foundUser in state.users:", foundUser);
          this.setState(
            {
              users: users.map(u => u.userName === user.userName ? { ...u, classroomName: newClassroom.name } : u)
            }
            , async () => {
              await this.loadUsers();
              console.log("Updated state.users after moving user to classroom: ", this.state.users);
              //this.props.onLoadUserData(await this.loadUserProjects(), foundUser?.userName !== '' ? foundUser : undefined);
              this.props.onClassroomUpdate(await this.loadClassrooms());
            })
        }



      }
    });
  };
  private onClearConsole_ = () => {

    this.setState({
      compileStatus: 'idle',
      editorConsole: StyledText.text({ text: LocalizedString.lookup(tr(''), this.props.locale), style: STDOUT_STYLE(DARK) }),
    });
  };

  private onIndentCode_ = () => {
    if (this.editorRef.current) this.editorRef.current.ivygate.formatCode();

  };

  private onLanguageChange_ = (language: ProgrammingLanguage) => {
    this.setState({
      activeLanguage: language
    });

  };

  onDashboardClick = () => {
    window.location.href = '/';
  };

  private onCloseClassroomDialog_ = (classroomName: string) => {
    console.log("Closing classroom dialog for:", classroomName);
    this.setState({
      modal: Modal.NONE,
    }, async () => {
      this.props.onClassroomUpdate(await this.loadClassrooms());
      this.props.resetAddNewClassroomFlag(false);
    })
  };

  render() {
    const { props, state } = this;

    const {
      otherFileType,
      isLeftBarOpen,
      locale,
      propContextMenuUser,
      propContextMenuProject,
      propContextMenuFile,
      propContextMenuClassroom,
      propSettings,
      propClassroom,
    } = props;

    const {
      activeLanguage,
      modal,
      editorConsole,
      windowInnerHeight,
      isHomeStartOptionsVisible,
      isMoveProjectDialogVisible,
      isRemoveUserFromClassroomDialogVisible,
      projectName,
      fileName,
      userName,
      rootUser,
      rootProject,
      rootInterfaceMode,
      isEditorPageVisible,
      toDeleteName_,
      toDeleteType_,
      toDownloadName_,
      toDownloadType_,
      toSaveName_,
      toSaveType_,
      toRenameName_,
      toRenameType_,
      toMoveProject_,
      toMoveUser_,
      theme,
      messages,
      users,
      classrooms
    } = state;

    console.log("Rendering RootContainer with state: ", this.state);
    console.log("Rendering rootContainer with toSaveCodeRef: ", this.toSaveCodeRef.current);
    return (
      <RootContainer $windowInnerHeight={windowInnerHeight} rootwidth={this.state.rootwidth}>

        {modal.type === Modal.Type.About && (
          <AboutDialog
            theme={theme}
            onClose={this.onModalClose_}
          />
        )}
        {isHomeStartOptionsVisible && (
          <HomeStartOptions
            classrooms={classrooms}
            theme={theme}
            locale={locale}
            onClearConsole={this.onClearConsole_}
            activeLanguage={activeLanguage}
            onEditorPageOpen={this.onEditorPageOpen_}
            onChangeProjectName={this.onChangeProjectName}
            onCreateProjectDialog={this.onCreateProjectDialogOpen_}
            onCloseClassroomDialog={this.onCloseClassroomDialog_}
            onOpenUserProject={this.onOpenUserProject_}
            onLoadUsers={this.loadUsers}
            onLoadUserData={this.loadUserProjects}
            onOpenFile={this.onOpenUserProject_}
            settings={this.props.propSettings}
          />
        )
        }
        {modal.type === Modal.Type.CreateFile && (
          <NewFileDialog
            onClose={this.onModalClose_}
            showRepeatUserDialog={false}
            projectName={projectName}
            userName={userName}
            language={activeLanguage}
            theme={theme}
            onEditorPageOpen={this.onEditorPageOpen_}
            otherFileType={otherFileType}
            onCloseNewFileDialog={this.onCloseNewFileDialog_}
          />
        )
        }
        {isEditorPageVisible && (
          <EditorPage
            isleftbaropen={isLeftBarOpen}
            isRunning={this.state.isRunning}
            compileStatus={this.state.compileStatus}
            editorTarget={undefined}
            editorConsole={editorConsole}
            messages={messages}
            code={this.state.code}
            language={activeLanguage}
            settings={propSettings}
            onClearConsole={this.onClearConsole_}
            onCodeChange={this.onCodeChange_}
            onSaveCode={this.onSaveClick_}
            onRunClick={this.onRunClick_}
            onStopClick={this.onStopClick_}
            onCompileClick={this.onCompileClick_}
            onIndentCode={this.onIndentCode_}
            onDownloadCode={() => { }}
            editorRef={this.editorRef}
            theme={theme}
            onDocumentationSetLanguage={() => { }}
            projectName={rootProject.projectName}
            fileName={fileName}
            userName={rootUser.userName}
            onFileNameChange={this.handleFileNameChange} locale={locale}
          />

        )}



        {modal.type === Modal.Type.CreateProject && (
          <CreateProjectDialog
            propedClassroom={propClassroom}
            settings={propSettings}
            onClose={this.onModalClose_}
            showRepeatUserDialog={false}
            projectName={projectName}
            theme={theme}
            closeProjectDialog={this.onCloseProjectDialog_}
            onDocumentationSetLanguage={this.onActiveLanguageChange_}
            onChangeProjectName={this.onChangeProjectName}
            userName={rootUser.userName}
            language={activeLanguage}
            onLanguageChange={this.onLanguageChange_}
            locale={locale}
            interfaceMode={rootInterfaceMode}
          />
        )}
        {modal.type === Modal.Type.CreateUser && (

          <CreateUserDialog
            classrooms={this.state.classrooms}
            propClassroom={propClassroom}
            settings={propSettings}
            showRepeatUserDialog={false}
            onClose={this.onModalClose_}
            onCreateProjectDialog={this.onCreateProjectDialogOpen_}
            theme={theme}
          />
        )}

        {(this.state.deleteClassroomFlag_ || this.state.deleteUserFlag_ || this.state.deleteProjectFlag_ || this.state.deleteFileFlag_) && modal.type === Modal.Type.DeleteUserProjectFile && (
          <DeleteUserProjectFileDialog
            onClose={this.onModalClose_}
            theme={theme}
            toDeleteObject={toDeleteType_ == 'classroom' ? propContextMenuClassroom : toDeleteType_ === 'user' ? propContextMenuUser : toDeleteType_ === 'project' ? propContextMenuProject : toDeleteType_ === 'file' ? propContextMenuFile : undefined}
            toDeleteName={toDeleteName_}
            toDeleteType={toDeleteType_}
            onConfirm={this.onConfirm_}
            onDeny={this.onModalClose_}
            locale={locale}
          />
        )}

        {(this.state.downloadUserFlag_ || this.state.downloadProjectFlag_ || this.state.downloadFileFlag_) && modal.type === Modal.Type.DownloadUserProjectFile && (
          <DownloadUserProjectFileDialog
            onClose={this.onModalClose_}
            theme={theme}
            toDownloadName={toDownloadName_}
            toDownloadType={toDownloadType_}
            onConfirm={this.onConfirm_}
            onDeny={this.onModalClose_}
          />
        )}

        {this.state.isSaveCodePromptVisible && modal.type === Modal.Type.SaveFile && (
          <SaveFileDialog
            onClose={this.onModalClose_}
            onConfirm={this.onConfirm_}
            onDenySave={this.onDenySave_}
            toSaveName={toSaveName_}
            toSaveType={toSaveType_}
            theme={theme}
          />
        )}

        {this.state.isRenameUserProjectFileDialogVisible && modal.type === Modal.Type.RenameUserProjectFile && (
          <RenameUserProjectFileDialog
            onClose={this.onModalClose_}
            onCloseRenameUserProjectFileDialog={this.onCloseRenameUserProjectFileDialog_}
            theme={theme}
            locale={locale}
            user={propContextMenuUser}
            project={propContextMenuProject}
            toRenameObject={toRenameType_ === 'classroom' ? propContextMenuClassroom : toRenameType_ === 'user' ? propContextMenuUser : toRenameType_ === 'project' ? propContextMenuProject : undefined}
            toRenameName={toRenameName_}
            toRenameType={toRenameType_}
          />

        )}

        {this.state.isMoveProjectDialogVisible && modal.type === Modal.Type.MoveProject && (
          <MoveProjectDialog
            onClose={this.onModalClose_}
            onCloseMoveProjectDialog={this.onCloseMoveProjectDialog_}
            theme={theme}
            locale={locale}
            user={propContextMenuUser}
            users={users}
            project={toMoveProject_}
            toRenameName={toRenameName_}
            toRenameType={toRenameType_}
          />
        )}

        {this.state.isRemoveUserFromClassroomDialogVisible && modal.type === Modal.Type.RemoveUserFromClassroom && (
          <RemoveUserFromClassroomDialog
            onClose={this.onModalClose_}
            onCloseRemoveUserFromClassroomDialog={this.onCloseRemoveUserFromClassroomDialog_}
            theme={theme}
            toRemoveUser={this.state.toRemoveUser_}
            classroom={this.state.toRemoveClassroom_}
            locale={locale}
          />
        )}
        {this.state.isMoveUserToClassroomDialogVisible && modal.type === Modal.Type.MoveUserToClassroom && (
          <MoveUserToClassroomDialog
            onClose={this.onModalClose_}
            onCloseMoveUserToClassroomDialog={this.onCloseMoveUserToClassroomDialog_}
            theme={theme}
            toMoveUser={this.state.toMoveUser_}
            locale={locale}
            classrooms={classrooms}
          />
        )}
        {modal.type === Modal.Type.CreateClassroom && (
          <CreateClassroomDialog
            theme={theme}
            onClose={this.onModalClose_}
            userName={''}
            showRepeatUserDialog={false}
            onCloseClassroomDialog={this.onCloseClassroomDialog_}
          />
        )}
      </RootContainer>
    );

  }
}

export default connect((state: ReduxState) => {


  return {
    locale: state.i18n.locale,
  };
}, dispatch => ({

}))(Root) as React.ComponentType<RootPublicProps>;

export { RootState };