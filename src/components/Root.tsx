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
import { Project, UploadedProject } from '../types/projectTypes';
import { InterfaceMode } from '../types/interfaceModes';
import { User } from '../types/userTypes';
import { SensorSelectionKey, ServoType } from 'types/motorServoSensorTypes';
import { programRunContextHelper } from '../ProgramRunContext';
import parseMessages, { sort, toStyledText } from '../util/parse-messages';
import { FileInfo } from 'types/fileInfo';

interface RootParams {
  sceneId?: string;
  challengeId?: string;
}

export interface RootPublicProps {
  propFileName: string;
  propProject: Project;
  otherFileType?: string;
  propUser: User;
  propContextMenuUser?: User;
  propContextMenuFile?: string;
  loadUserDataFlag: boolean;
  addNewProject: boolean;
  addNewFile: boolean;
  simpleProjectLoadFlag?: boolean;
  clickFile: boolean;
  deleteUserFlag?: boolean;
  downloadUserFlag?: boolean;
  renameUserFlag?: boolean;
  renameProjectFlag?: boolean;
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

  propedUploadUser: User;
  propedUploadProject: Project | UploadedProject;
  propedUploadFiles: FileInfo[];
  propedUploadFilesFlag: boolean;
  propedUploadedProjectFlag: boolean;

  changeProjectName: (projectName: string) => void;
  setAddNewProject: (addNewProject: boolean, newProj?: Project) => void;
  setAddNewFile: (addNewFile: boolean) => void;
  setClickFile: (clickFile: boolean) => void;
  setRootInfo: (user: User, project: Project, fileName: string, activeLanguage: ProgrammingLanguage) => void;
  setFileName_: (fileName: string) => void;
  onUserUpdate: (users: User[]) => void;
  onLoadUserData: (userData: Project[], loadedUser?: User, renamedUser?: boolean, oldUserName?: string) => void;
  resetDeleteUserFlag: (deleteUserFlag: boolean) => void;
  resetDeleteProjectFlag: (deleteProjectFlag: boolean) => void;
  resetDeleteFileFlag: (deleteFileFlag: boolean) => void;
  resetDownloadUserFlag: (downloadUserFlag: boolean) => void;
  resetDownloadProjectFlag: (downloadProjectFlag: boolean) => void;
  resetDownloadFileFlag: (downloadFileFlag: boolean) => void;
  resetUploadFilesFlag: (uploadFilesFlag: boolean) => void;
  resetUploadProjectFlag: (uploadProjectFlag: boolean) => void;
  resetFileExplorerFileSelection: (resetSelectionToFile: string) => void;
  resetFileExplorerProjectSelection: (resetSelectionToProject: Project, resetSelectionToFile: string) => void;
  resetRenameUserFlag: (renameUserFlag: boolean, renamedUser?: User) => void;
  resetRenameProjectFlag: (renameProjectFlag: boolean, renamedProject?: Project) => void;
  resetRenameFileFlag: (renameFileFlag: boolean, renamedFile?: string) => void;
  resetStoppedMotorFlag: (stoppedMotorFlag: boolean) => void;
  resetStoppedAllMotorsFlag: (stoppedAllMotorsFlag: boolean) => void;
  resetEnabledServoFlag: (enabledServoFlag: boolean) => void;
  resetDisabledServoFlag: (disabledServoFlag: boolean) => void;
  setAnalogValues: (analogValue: number) => void;
  setDigitalValues: (digitalValue: number) => void;
  setAccelValues: (accelValue: number) => void;
  setGyroValues: (gyroValue: number) => void;
  setMagnetoValues: (magnetoValue: number) => void;
  setButtonValues: (buttonValue: number) => void;
  //setPanelSelection(panelSelection: string): void;
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
  isSaveCodePromptVisible: boolean;
  isRenameUserProjectFileDialogVisible: boolean;
  addNewProject: boolean;
  addNewFile: boolean;
  isRunning: boolean;
  clickFileState: boolean;
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
  private prevStateRef: React.MutableRefObject<State>;
  private toSaveCodeRef: React.MutableRefObject<Dict<string>>;

  constructor(props: Props) {
    super(props);

    this.state = {
      rootUser: {
        userName: '',
        interfaceMode: InterfaceMode.SIMPLE,
        projects: []
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
        'c': window.localStorage.getItem('code-c') || ProgrammingLanguage.DEFAULT_CODE['c'],
        'cpp': window.localStorage.getItem('code-cpp') || ProgrammingLanguage.DEFAULT_CODE['cpp'],
        'python': window.localStorage.getItem('code-python') || ProgrammingLanguage.DEFAULT_CODE['python'],
        'plaintext': window.localStorage.getItem('code-plaintext') || ProgrammingLanguage.DEFAULT_USER_DATA_CODE,
        'graphical': window.localStorage.getItem('code-graphical') || ProgrammingLanguage.DEFAULT_CODE['graphical']
      },
      modal: Modal.NONE,
      editorConsole: StyledText.text({ text: LocalizedString.lookup(tr('Welcome to the KIPR IDE!\n'), props.locale), style: STDOUT_STYLE(this.props.propedTheme) }),
      messages: [],
      settings: DEFAULT_SETTINGS,
      feedback: DEFAULT_FEEDBACK,
      windowInnerHeight: window.innerHeight,
      isHomeStartOptionsVisible: true,
      isNewFileDialogVisible: false,
      isEditorPageVisible: false,
      isCreateProjectDialogVisible: false,
      isCreateNewUserDialogVisible: false,
      isOpenUserProject: false,
      isSaveCodePromptVisible: false,
      isRenameUserProjectFileDialogVisible: false,
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
      theme: this.props.propedTheme,
      rootMotorPositions: {},
      //stoppedMotorFlag: false,
      //stoppedAllMotorsFlag: false,
      rootwidth: 100
    };

    this.editorRef = React.createRef();
    this.prevPropsRef = React.createRef();
    this.prevStateRef = React.createRef();
    this.toSaveCodeRef = { current: { 'c': '', 'cpp': '', 'python': '', 'plaintext': '', 'graphical': '' } };
  }

  async componentDidMount() {
    console.log("ROOT MOUNTED");
    window.addEventListener('resize', this.onWindowResize_);
    await this.loadUsers();

    if (this.props.propUser.userName !== '' && this.props.propProject.projectName !== '' && this.props.propFileName !== '') {
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

    if (this.state.saveCodePromptFlag == true) {
      console.log("Root saveCodePromptFlag: ", this.state.saveCodePromptFlag);
      console.log("Root saveCodePromptFlag this.props: ", this.props);
      console.log("Root saveCodePromptFlag nextProps: ", nextProps);

      console.log("Root saveCodePromptFlag this.state: ", this.state);
      console.log("Root saveCodePromptFlag nextState: ", nextState);

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
    console.log("ROOT UNMOUNTED");
    this.stopSensorWebSocket();
  }

  componentDidUpdate = async (prevProps: Props, prevState: State) => {

    console.log("Root compDidUpdate prevProps: ", prevProps);
    console.log("Root compDidUpdate prevState: ", prevState);
    console.log("Root compDidUpdate this.props: ", this.props);
    console.log("Root compDidUpdate this.state: ", this.state);

    const displayNowVisible = this.props.propedSensorDisplayFlag && !prevProps.propedSensorDisplayFlag;
    const displayNowHidden = !this.props.propedSensorDisplayFlag && prevProps.propedSensorDisplayFlag;


    if (prevProps.propedUploadedProjectFlag !== this.props.propedUploadedProjectFlag && this.props.propedUploadedProjectFlag) {
      console.log("Root compDidUpdate propedUploadProject: ", this.props.propedUploadProject);
      console.log("Root compDidUpdate propedUploadUser: ", this.props.propedUploadUser);
      const uploadProjectResponse = await axios.post('/upload-project', {
        user: this.props.propedUploadUser,
        project: this.props.propedUploadProject,
        srcFiles: this.props.propedUploadProject.srcFolderFiles,
        includeFiles: this.props.propedUploadProject.includeFolderFiles,
        dataFiles: this.props.propedUploadProject.dataFolderFiles
      });

      if (uploadProjectResponse.status === 200) {
        console.log("Root compDidUpdate uploadProjectResponse: ", uploadProjectResponse.data);
        this.props.onLoadUserData(await this.loadUserProjects(false, false, this.props.propedUploadUser), this.props.propedUploadUser, false);
        this.props.resetUploadProjectFlag(false); // Reset the flag and indicate success
        const files = this.props.propedUploadProject.srcFolderFiles as FileInfo[];
        const mainFile = files.find(file => file.name.includes('main'));

        if (mainFile) {
          console.log("Root compDidUpdate mainFile: ", mainFile);
          this.toSaveCodeRef.current = {
            ...this.toSaveCodeRef.current,
            [this.props.propedUploadProject.projectLanguage]: mainFile.content
          };
        }
        this.props.setRootInfo(this.props.propedUploadUser, uploadProjectResponse.data.createdProject, mainFile.name, this.props.propedUploadProject.projectLanguage);

        this.setState({
          rootUser: this.props.propedUploadUser,
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
      console.log("Root compDidUpdate propedUploadFile: ", this.props.propedUploadFiles);
      console.log("Root compDidUpdate propedUploadUser: ", this.props.propedUploadUser);
      console.log("Root compDidUpdate propedUploadProject: ", this.props.propedUploadProject);

      const uploadFileResponse = await axios.post('/upload-file', {
        user: this.props.propedUploadUser,
        project: this.props.propedUploadProject,
        files: this.props.propedUploadFiles
      });
      console.log("Root compDidUpdate uploadFileResponse: ", uploadFileResponse.data);
      this.props.onLoadUserData(await this.loadUserProjects(false, false, this.props.propedUploadUser), this.props.propedUploadUser, false);

    }
    if (prevProps.simpleProjectLoadFlag !== this.props.simpleProjectLoadFlag && this.props.simpleProjectLoadFlag) {
      console.log("Root compDidUpdate simpleProjectLoadFlag: ", this.props.simpleProjectLoadFlag);
    }
    if (prevProps.propedSensorSelection !== this.props.propedSensorSelection) {
      console.log("Root compDidUpdate propedSensorSelection: ", this.props.propedSensorSelection);
      this.sendSensorMessage(this.props.propedSensorSelection);
    }

    if (displayNowVisible) {
      console.log("Root Sensor display became visible — starting WebSocket connection");
      this.startSensorWebSocket(); // Create the connection
    }

    if (displayNowHidden) {
      console.log("Root Sensor display hidden — closing WebSocket connection");
      this.stopSensorWebSocket(); // Clean up connection
    }

    if (prevProps.propedSensorSelection === this.props.propedSensorSelection && this.props.propedSensorSelection !== undefined && displayNowVisible) {
      console.log("Root compDidUpdate propedSensorSelection: ", this.props.propedSensorSelection, " with displayNowVisible: ", displayNowVisible);
      if (this.props.propedSensorSelection !== null) {
        const trySend = () => {
          if (this.socket?.readyState === WebSocket.OPEN) {
            //this.socket.send(JSON.stringify({ type: "start-analog" }));
            this.sendSensorMessage(this.props.propedSensorSelection);
          } else {
            setTimeout(trySend, 50); // Retry shortly if WebSocket is not yet open
          }
        };

        trySend();
      }

    }

    if (prevProps.renameUserFlag !== this.props.renameUserFlag && this.props.renameUserFlag) {
      console.log("Root compDidUpdate renameUserFlag: ", this.props.renameUserFlag);
      this.renameUser_();

    }
    if (prevProps.renameProjectFlag !== this.props.renameProjectFlag && this.props.renameProjectFlag) {
      console.log("Root compDidUpdate renameProjectFlag: ", this.props.renameProjectFlag);
      this.renameProject_();
    }
    if (prevProps.renameFileFlag !== this.props.renameFileFlag && this.props.renameFileFlag) {
      console.log("Root compDidUpdate renameFileFlag: ", this.props.renameFileFlag);
      this.renameFile_();
    }
    if (prevProps.propedMotorView !== this.props.propedMotorView) {
      console.log("Root compDidUpdate propedMotorView: ", this.props.propedMotorView, "from: ", prevProps.propedMotorView);

    }
    if (prevProps.propedServoPositions !== this.props.propedServoPositions) {
      console.log("Root compDidUpdate propedServoPositions: ", this.props.propedServoPositions);


      this.props.propedServoPositions.forEach((servo, index) => {
        const prev = prevProps.propedServoPositions[index];
        const next = this.props.propedServoPositions[index];

        const valueChanged = prev.value !== next.value;
        const enableChanged = prev.enable !== next.enable;

        console.log("Root compDidUpdate propedServoPositions: ", prev, next);
        if ((valueChanged || enableChanged)) {
          console.log(`1st: Root ${index} changed: value ${prev.value} → ${next.value}, enable ${prev.enable} → ${next.enable}`);
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
      console.log("Root compDidUpdate propedMotorPositions: ", this.props.propedMotorPositions);

      if (this.props.propedStoppedMotorFlag && this.props.stoppedMotor !== undefined) {
        console.log("Root compDidUpdate propedStoppedMotorFlag: ", this.props.propedStoppedMotorFlag);

        this.stopMotor(this.props.stoppedMotor);
        this.props.resetStoppedMotorFlag(false);
        this.setState({
          //stoppedMotorFlag: false,
          rootMotorPositions: this.props.propedMotorPositions
        });
      }
      else if (this.props.propedStoppedAllMotorsFlag) {
        console.log("Root compDidUpdate propedStoppedAllMotorsFlag: ", this.props.propedStoppedAllMotorsFlag);
        this.stopAllMotors();
        this.props.resetStoppedAllMotorsFlag(false)
        this.setState({
          //stoppedAllMotorsFlag: false,
          rootMotorPositions: this.props.propedMotorPositions
        })
      }
      else {
        Object.keys(this.props.propedMotorPositions).forEach(motor => {
          if (prevProps.propedMotorPositions[motor] !== this.props.propedMotorPositions[motor]) {
            console.log(`${motor} value changed from ${prevProps.propedMotorPositions[motor]} to ${this.props.propedMotorPositions[motor]}`);
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
      this.props.onLoadUserData(await this.loadUserProjects(false, false, this.state.rootUser));
    }
    if (prevProps.reloadUserFlag !== this.props.reloadUserFlag && this.props.reloadUserFlag) {
      console.log("Root compDidUpdate reloadUserFlag: ", this.props.reloadUserFlag);
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
        //editorConsole: StyledText.text({ text: LocalizedString.lookup(tr(rawText), this.props.locale), style: STDOUT_STYLE(this.props.propedTheme) })
        editorConsole: updatedConsole,
      });
    }


    if (prevProps.addNewProject !== this.props.addNewProject) {
      console.log("Root compDidUpdate addNewProject props.propUser: ", this.props.propUser);
      if (this.props.addNewProject) {
        this.setState({
          rootUser: this.props.propUser,
          userName: this.props.propUser.userName,
          modal: Modal.CREATEPROJECT,
        });
      }
    }

    if (prevProps.loadUserDataFlag !== this.props.loadUserDataFlag && this.props.loadUserDataFlag) {
      console.log("Root compdidUpdate loadUserDataFlag: ", this.props.loadUserDataFlag);
      console.log("Root compDidUpdate loadUserDataFlag props.propUser: ", this.props.propUser);
      const userProj = await this.loadUserProjects(false, false, this.props.propUser);
      console.log("Root compDidUpdate loadUserDataFlag userProj: ", userProj);
      this.props.onLoadUserData(userProj, this.props.propUser, false, this.props.propUser.userName);
      //this.props.onLoadUserData(await this.loadUserProjects(false, false, this.props.propUser));
    }

    if (prevProps.deleteUserFlag !== this.props.deleteUserFlag && this.props.deleteUserFlag) {
      console.log("Root compDidUpdate deleteUser state: ", this.state);
      console.log("Root compDidUpdate deleteUser props.propContextMenuUser: ", this.props.propContextMenuUser);
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
      console.log("Root tempNewFile: ", this.state.tempNewFile, "with saveCodePromptFlag: ", this.state.saveCodePromptFlag);
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

      this.updateCode(this.state.tempNewFile);
      this.props.setClickFile(false);
      this.clearTempName_();
    }
    //console.log("Root clickFile: ", this.props.clickFile);
    else if ((this.props.clickFile && this.state.saveCodePromptFlag == false)) {

      const { propUser, propProject, propActiveLanguage, propFileName, otherFileType } = this.props;
      console.log("Root clickFile passed in: ", propUser, propProject, "propActiveLanguage: ", propActiveLanguage, "propFileName: ", propFileName, "otherFileType: ", otherFileType);
      this.props.resetFileExplorerFileSelection(this.props.propFileName);
      switch (otherFileType) {
        case 'h':
          const rootUpdateHeader = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/include/${propFileName}` } });
          this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [propActiveLanguage]: rootUpdateHeader.data };
          this.setState({
            code: {
              ...this.state.code,
              [propActiveLanguage]: rootUpdateHeader.data
            }
          });

          break;
        case 'c':
        case 'cpp':
        case 'py':
        case 'graphical':
          console.log("Root clickFile state: ", this.state);
          console.log("Root clickFile props: ", this.props);
          let rootUpdateCode: AxiosResponse<string>;
          rootUpdateCode = this.state.tempNewFile ?
            await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/src/${this.state.tempNewFile}` } }) :
            await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/src/${propFileName}` } });
          console.log("Root clickFile rootUpdateCode: ", rootUpdateCode.data);
          this.setState({
            code: {
              ...this.state.code,
              [propActiveLanguage]: rootUpdateCode.data
            }
          });
          this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [propActiveLanguage]: rootUpdateCode.data };
          console.log("Root clickFile toSaveCodeRef: ", this.toSaveCodeRef.current);
          break;
        case 'txt':
          const rootUpdateUserFiles = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/data/${propFileName}` } });
          this.setState({
            code: {
              ...this.state.code,
              [propActiveLanguage]: rootUpdateUserFiles.data
            }
          });
          this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [propActiveLanguage]: rootUpdateUserFiles.data };
          break;
      }

      this.setState({
        rootUser: this.props.propUser,
        rootProject: this.props.propProject,
        userName: this.props.propUser.userName,
        projectName: this.props.propProject.projectName,
        fileName: this.props.propFileName,
        otherFileType: this.props.otherFileType,
        clickFileState: false,
        activeLanguage: this.props.propActiveLanguage,

      });

      if (this.state.isHomeStartOptionsVisible == true) {
        this.setState({
          isHomeStartOptionsVisible: false
        });
      }

      console.log("this.state.isEditorPageVisible: ", this.state.isEditorPageVisible);
      if (this.state.isEditorPageVisible == false) {
        this.setState({
          isEditorPageVisible: true
        });
      }
      console.log("Right before setClickFile false");
      this.updateCode(this.props.propFileName);
      this.props.setClickFile(false);
    }

    this.prevPropsRef.current = this.props;
  }

  private socket?: WebSocket;


  private sendSensorMessage = (sensorSelections: SensorSelectionKey[]) => {
    console.log("Root sendSensorMessage sensorSelections: ", sensorSelections);
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
            console.log("Root Sensor data.analog: ", data.value);
            this.props.setAnalogValues(data.value);
            //this.setState({ analog: data.value });
          }
          if (data.type === "digital") {
            console.log("Root Sensor data.digital: ", data.value);
            this.props.setDigitalValues(data.value);
          }
          if (data.type === "accel") {
            console.log("Root Sensor data.accel: ", data.value);
            this.props.setAccelValues(data.value);
          }
          if (data.type === "gyro") {
            console.log("Root Sensor data.gyro: ", data.value);
            this.props.setGyroValues(data.value);
          }
          if (data.type === "magneto") {
            console.log("Root Sensor data.magneto: ", data.value);
            this.props.setMagnetoValues(data.value);
          }
          if (data.type === "button") {
            console.log("Root Sensor data.button: ", data.value);
            this.props.setButtonValues(data.value);
          }
        } catch (error) {
          console.error("Invalid WebSocket message:", error);
        }
      };
    }
  };
  private startSensorWebSocket = async () => {
    console.log("Before websocket create");
    //this.socket = new WebSocket('ws://localhost:8888'); // DEVELOPMENT ONLY
    //this.socket = new WebSocket('ws://192.168.86.30:8888'); // WOMBAT
    this.socket = new WebSocket('ws://192.168.125.1:8888/ws/sensors');
    //USE THIS FOR PRODUCTION
    console.log("After websocket create");
    this.socket.onopen = () => {
      console.log('WebSocket connection opened');

    };
    ///////

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
    console.log("Root enableServo servo: ", servo);
    let servoNumber: number = parseInt(servo.name.split(' ')[1]);
    let servoValue: number = servo.value;
    console.log("Root enableServo servoNumber: ", servoNumber);

    try {

      const servoResponse = await axios.post('/enable-servo', { servo: servoNumber, value: servoValue });
      console.log("Root enableServo servoResponse: ", servoResponse);
    }
    catch (error) {
      console.error("Root enableServo caught error: ", error);
    }
  }

  private disableServos = async (servos: ServoType[]) => {
    console.log("Root disableServo servo: ", servos);

    if (servos.length > 1) {
      console.log("Root disable all servos!");
      try {
        const disableAllServosResponse = await axios.post('/disable-all-servos');
        console.log("Root disableAllServosResponse: ", disableAllServosResponse);
      }
      catch (error) {
        console.error("Root disableAllServos caught error: ", error);
      }
    }
    else {
      let servoNumber: number = parseInt(servos[0].name.split(' ')[1]);
      let servoValue: number = servos[0].value;
      console.log("Root disableServo servoNumber: ", servoNumber);

      try {

        const servoResponse = await axios.post('/disable-servo', { servo: servoNumber, value: servoValue });
        console.log("Root disableServo servoResponse: ", servoResponse);
      }
      catch (error) {
        console.error("Root disableServo caught error: ", error);
      }
    }


  }

  private moveServo = async (servo: ServoType) => {
    console.log("Root moveServo servo: ", servo);
    let servoNumber: number = parseInt(servo.name.split(' ')[1]);
    let servoValue: number = servo.value;
    console.log("Root moveServo servoNumber: ", servoNumber);
    try {
      const servoResponse = await axios.post('/move-servo', { servo: servoNumber, value: servoValue });
      console.log("Root moveServo servoResponse: ", servoResponse);
    }
    catch (error) {
      console.error("Root moveServo caught error: ", error);
    }
  }

  private moveMotor = async (view: 'Power' | 'Velocity', motor: number, value: number) => {
    console.log("Root moveMotor view: ", view, ", motor: ", motor, ", value: ", value);
    try {
      const motorResponse = await axios.post('/move-motor', { view: view, motor: motor, value: value });
      console.log("Root moveMotor motorResponse: ", motorResponse);
    }
    catch (error) {
      console.error("Root moveMotor caught error: ", error);
    }
  }

  private stopMotor = async (motor: number) => {
    console.log("Root stopMotor motor: ", motor);
    try {
      const motorResponse = await axios.post('/stop-motor', { motor: motor });
      console.log("Root stopMotor motorResponse: ", motorResponse);
    }
    catch (error) {
      console.error("Root stopMotor caught error: ", error);
    }
  }

  private stopAllMotors = async () => {
    console.log("Root stopAllMotors");
    try {
      const allOffMotorResponse = await axios.post('/stop-all-motors');
      console.log("Root stopAllMotors allOffMotorResponse: ", allOffMotorResponse);
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

    console.log("Root updateCode props: ", this.props);
    console.log("Root updateCode tempNewFile: ", tempNewFile);
    const { propUser, propProject, propActiveLanguage, otherFileType } = this.props;
    switch (otherFileType) {
      case 'h':
        const rootUpdateHeader = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/include/${tempNewFile}` } });
        this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [propActiveLanguage]: rootUpdateHeader.data };
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
        console.log("ROOT UPDATECODE");
        console.log(`Root Update Code: /home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/src/${tempNewFile}`);
        const rootUpdateCode = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/src/${tempNewFile}` } });
        console.log("Root updateCode rootUpdateCode: ", rootUpdateCode);
        this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [propActiveLanguage]: rootUpdateCode.data };
        console.log("Root updateCode toSaveCodeRef: ", this.toSaveCodeRef.current);
        this.setState({
          code: {
            ...this.state.code,
            [propActiveLanguage]: rootUpdateCode.data
          }
        });
        break;
      case 'txt':
        const rootUpdateUserFiles = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/data/${tempNewFile}` } });
        this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [propActiveLanguage]: rootUpdateUserFiles.data };
        this.setState({
          code: {
            ...this.state.code,
            [propActiveLanguage]: rootUpdateUserFiles.data
          }
        });
        break;
    }
  }

  private loadUsers = async (): Promise<User[]> => {
    console.log("Root loadUsers state: ", this.state);
    console.log("Root loadUsers props: ", this.props);
    console.log("Root prev props: ", this.prevPropsRef.current);
    try {
      const getUserResponse = await axios.get('/load-user-data', { params: { filePath: "/home/kipr/Documents/KISS" } });
      console.log("Root loadUsers getUserResponse: ", getUserResponse);
      if (getUserResponse.data.users.length == 0) {
        this.props.onUserUpdate([]);
        return [];
      }
      else {
        const userDirectories: User[] = getUserResponse.data.users.map((userData: any) => ({
          userName: userData.userName,
          interfaceMode: userData.interfaceMode,
          projects: userData.projects

        }));
        console.log("Root loadUsers userDirectories: ", userDirectories);

        this.setState({
          users: userDirectories,
        }, () => {
          this.props.onUserUpdate(this.state.users);
        });

        return userDirectories;

      }

    }
    catch (error) {
      console.error("Root loadUsers caught error: ", error);
      return [];
    }
  }


  private loadUserProjects = async (openedUserDialog?: boolean, createdUserDialog?: boolean, desiredUser?: User): Promise<Project[]> => {

    console.log("Root loadUserProjects passed in: ", openedUserDialog, createdUserDialog, desiredUser);
    console.log("Root loadUserProjects props.propUser: ", this.props.propUser);
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
      const response = await axios.get('/get-projects', { params: { filePath: `/home/kipr/Documents/KISS/${chosenUser.userName}` } });

      const userDirectories = response.data.directories;
      console.log("loadUserProjects chosenUser: ", chosenUser);

      console.log("loadUserProjects userDirectories: ", userDirectories);

      //each project into a Project object
      const projects: Project[] = await Promise.all(
        userDirectories.map(async (projectName) => {

          const projectDataResponse = await axios.get('/get-project-data', {
            params: { filePath: `/home/kipr/Documents/KISS/${chosenUser.userName}/${projectName}` }
          });

          const projectData = projectDataResponse.data;

          console.log("loadUserProjects projectData: ", projectData);

          // Construct the Project object
          return {
            projectName,
            includeFolderFiles: projectData.includeData || [],
            srcFolderFiles: projectData.srcData || [],
            dataFolderFiles: projectData.userFileData || [],
            projectLanguage: projectData.projectLanguage || '' as ProgrammingLanguage
          } as Project;
        })
      );

      return projects;
    }
    catch (error) {
      console.error("Root loadUserProjects error: ", error);
      return [];
    }
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

  private saveFile_(tempNewFile_: string): void {
    console.log("Root saveFile_ state: ", this.state);
    console.log("Root saveFile_ toSaveCodeRef: ", this.toSaveCodeRef.current);
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
    console.log("Root onCloseRenameUserProjectFileDialog_ passed in: ", renamedType, user, renamedData);
    console.log("Root onCloseRenameUserProjectFileDialog_ BEFORE state: ", this.state);


    if (renamedType === 'User') {

      user = {
        ...user,
        userName: renamedData['newUserName'],
      }
      console.log("onCloseRenameUserProjectFileDialog_ edited user: ", user);
      let loadUserProject = await this.loadUserProjects(false, false, user);
      console.log("Root onCloseRenameUserProjectFileDialog_ loadUserProject: ", loadUserProject);
      this.props.onLoadUserData(loadUserProject, user, true, renamedData['oldUserName']);
      console.log("Root onCloseRenameUserProjectFileDialog_ AFTER state: ", this.state);

      this.props.resetRenameUserFlag(false, user);

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
      //console.log("Root onCloseRenameUserProjectFileDialog_ newRenamedProject: ", newRenamedProject);

      let loadUserProject = await this.loadUserProjects(false, false, user);
      console.log("Root onCloseRenameUserProjectFileDialog_ loadUserProject: ", loadUserProject);
      this.props.onLoadUserData(loadUserProject, user);
      console.log("Root onCloseRenameUserProjectFileDialog_ AFTER state: ", this.state);
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
      this.props.resetRenameProjectFlag(false, newRenamedProject);
    }
    else if (renamedType === 'File') {

      let loadUserProject = await this.loadUserProjects(false, false, user);
      console.log("Root onCloseRenameUserProjectFileDialog_ loadUserProject: ", loadUserProject);
      this.props.onLoadUserData(loadUserProject, user);
      console.log("Root onCloseRenameUserProjectFileDialog_ AFTER state: ", this.state);
      if (this.state.isEditorPageVisible) { // User Project file already open
        const [file, extension] = renamedData['oldFileName'].split(".");

        switch (extension) {
          case 'h':
            this.setState(prevState => ({
              rootUser: {
                ...prevState.rootUser,
                projects: prevState.rootUser.projects.map(project =>
                  project.projectName === this.state.rootProject.projectName
                    ? {
                      ...project, includeFolderFiles: project.includeFolderFiles.map(file =>
                        file === renamedData['oldFileName']
                          ? renamedData['newFileName']
                          : file
                      )
                    }
                    : project
                )
              },
              rootProject: {
                ...prevState.rootProject,
                includeFolderFiles: prevState.rootProject.includeFolderFiles.map(file =>
                  file === renamedData['oldFileName']
                    ? renamedData['newFileName']
                    : file
                )
              },
              fileName: renamedData['newFileName']
            }));
            break;
          case 'c':
          case 'cpp':
          case 'py':
            this.setState(prevState => ({
              rootUser: {
                ...prevState.rootUser,
                projects: prevState.rootUser.projects.map(project =>
                  project.projectName === this.state.rootProject.projectName
                    ? {
                      ...project, srcFolderFiles: project.srcFolderFiles.map(file =>
                        file === renamedData['oldFileName']
                          ? renamedData['newFileName']
                          : file
                      )
                    }
                    : project
                )
              },
              rootProject: {
                ...prevState.rootProject,
                srcFolderFiles: prevState.rootProject.srcFolderFiles.map(file =>
                  file === renamedData['oldFileName']
                    ? renamedData['newFileName']
                    : file
                )
              },
              fileName: renamedData['newFileName']
            }));
            break;
          case 'txt':
            this.setState(prevState => ({
              rootUser: {
                ...prevState.rootUser,
                projects: prevState.rootUser.projects.map(project =>
                  project.projectName === this.state.rootProject.projectName
                    ? {
                      ...project, dataFolderFiles: project.dataFolderFiles.map(file =>
                        file === renamedData['oldFileName']
                          ? renamedData['newFileName']
                          : file
                      )
                    }
                    : project
                )
              },
              rootProject: {
                ...prevState.rootProject,
                dataFolderFiles: prevState.rootProject.dataFolderFiles.map(file =>
                  file === renamedData['oldFileName']
                    ? renamedData['newFileName']
                    : file
                )
              },
              fileName: renamedData['newFileName']
            }));
        }

      }
      this.setState({
        modal: Modal.NONE,
        isRenameUserProjectFileDialogVisible: false,
      });
      this.props.resetRenameFileFlag(false, renamedData['newFileName']);
    }
  }

  private onCloseProjectDialog_ = async (newProjName: string, newProjLanguage: ProgrammingLanguage, newInterfaceMode: InterfaceMode) => {
    console.log("Root onCloseProjectDialog_ passed in: ", newProjName, newProjLanguage, newInterfaceMode);
    console.log("Root oncloseProjectDialog props.propUser: ", this.props.propUser);
    const { userName, rootUser } = this.state;
    console.log("Root onCloseProjectDialog_ state: ", this.state);

    try {

      this.setState((prevState) => {
        const prevStateUsers = [...prevState.users];
        const userNames = prevStateUsers.map(user => user.userName);
        console.log("Root onCloseProjectDialog_ ...prevState.users: ", ...prevState.users);
        console.log("Root onCloseProjectDialog_ this.state.users: ", this.state.users);


        if (!userNames.includes(rootUser.userName)) {
          prevStateUsers.push(rootUser);
          console.log("Root onCloseProjectDialog_ prevStateUsers.push(rootUser): ", prevStateUsers);
        }

        return { users: prevStateUsers };
      }, () => {
        console.log("Root onCloseProjectDialog_ state.users: ", this.state.users);
        this.props.onUserUpdate(this.state.users);
      });
    }
    catch (error) {
      console.error("Root onCloseProjectDialog_ error: ", error);
    }

    console.log("Root onCloseProjectDialog_ state.rootUser: ", this.state.rootUser);
    console.log("Root onCloseProjectDialog_ newInterfaceMode: ", newInterfaceMode);

    this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [newProjLanguage]: ProgrammingLanguage.DEFAULT_CODE[newProjLanguage] };
    this.setState({
      modal: Modal.NONE,
      rootUser: {
        ...this.state.rootUser,
        interfaceMode: newInterfaceMode,
        projects: [
          ...this.state.rootUser.projects,
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
      userName: this.state.userName,
      projectName: newProjName,
      activeLanguage: newProjLanguage,
      fileName: `main.${ProgrammingLanguage.FILE_EXTENSION[newProjLanguage]}`,
    }, async () => {
      console.log("Root onCloseProjectDialog_ AFTER state.rootUser: ", this.state.rootUser);
      this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [newProjLanguage]: ProgrammingLanguage.DEFAULT_CODE[newProjLanguage] };
      console.log("Root onCloseProjectDialog_ toSaveCodeRef: ", this.toSaveCodeRef.current);
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

      this.props.onLoadUserData(await this.loadUserProjects(false, true, this.state.rootUser), this.state.rootUser);
      if (this.props.addNewProject) {

        this.setState({
          addNewProject: false
        });
      }

      this.props.setAddNewProject(false, this.state.rootProject);

    });
  }

  private onCloseNewFileDialog_ = async (newFileName: string, fileType: string) => {
    const prePath = `/home/kipr/Documents/KISS`;
    let filePath = '';
    const { userName, activeLanguage, projectName } = this.state;
    switch (fileType) {
      case 'h':
        this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [activeLanguage]: ProgrammingLanguage.DEFAULT_HEADER_CODE };
        this.setState({
          code: {
            ...this.state.code,
            [this.state.activeLanguage]: ProgrammingLanguage.DEFAULT_HEADER_CODE
          }
        }, async () => {
          filePath = `${prePath}/${userName}/${projectName}/include/${newFileName}.h`;
          const fileContents = this.state.code[activeLanguage];
          const addNewFileContentResponse = await axios.post('/save-file-content', { filePath, fileContents });
        });
        break;
      case 'c':
      case 'cpp':
      case 'py':
        this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [activeLanguage]: ProgrammingLanguage.BLANK_CODE[activeLanguage] };
        this.setState({
          code: {
            ...this.state.code,
            [this.state.activeLanguage]: ProgrammingLanguage.BLANK_CODE[this.state.activeLanguage]
          }
        }, async () => {
          filePath = `${prePath}/${userName}/${projectName}/src/${newFileName}.${fileType}`;
          const fileContents = this.toSaveCodeRef.current[activeLanguage];
          const addNewFileContentResponse = await axios.post('/save-file-content', { filePath, fileContents });
        });

        break;
      case 'txt':
        this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [activeLanguage]: ProgrammingLanguage.DEFAULT_USER_DATA_CODE };
        this.setState({
          code: {
            ...this.state.code,
            [this.state.activeLanguage]: ProgrammingLanguage.DEFAULT_USER_DATA_CODE
          }
        }, async () => {
          filePath = `${prePath}/${userName}/${projectName}/data/${newFileName}.txt`;
          const fileContents = this.state.code[activeLanguage];
          const addNewFileContentResponse = await axios.post('/save-file-content', { filePath, fileContents });
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
      this.props.onLoadUserData(await this.loadUserProjects())

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
      console.log("right before setAddNewFile false");
      this.props.setAddNewFile(false);

    });
  }

  private onCreateProjectDialogOpen_ = (name: string, interfaceMode: InterfaceMode) => {

    console.log("Root onCreateProjectDialogOpen_ name: ", name);
    console.log("Root onCreateProjectDialogOpen_ interfaceMode: ", interfaceMode);
    console.log("Root onCreateProjectDialogOpen_ state.rootUser: ", this.state.rootUser);
    this.setState({
      rootUser: {
        ...this.state.rootUser,
        userName: name,
        interfaceMode: interfaceMode,
      },
      rootInterfaceMode: interfaceMode,
      userName: name,
      isCreateNewUserDialogVisible: false,
      isCreateProjectDialogVisible: true,
      modal: Modal.CREATEPROJECT
    }, () => {
      console.log("Root onCreateProjectDialogOpen_ AFTER state.rootUser: ", this.state.rootUser);
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
    console.log("Root onOpenUserProject passed in: ", passedUser, project, fileName, projectLanguage);
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
    console.log("Root onOpenUserProject filePath: ", filePath);
    console.log("Root onOpenUserProject toOpenProject: ", toOpenProject);
    console.log("ROOT ONOPENUSERPROJECT");
    let toOpenProjectMainCode = await axios.get('/get-file-contents', { params: { filePath: `${filePath}` } });
    this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [projectLanguage]: toOpenProjectMainCode.data };
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
    console.log("Root onCodeChange_ code: ", code);

    const { activeLanguage } = this.state;

    const prevCode = this.toSaveCodeRef.current?.[activeLanguage] ?? "";
    const defaultCode = ProgrammingLanguage.DEFAULT_CODE[activeLanguage];

    console.log("Root onCodeChange_ prevCode: ", prevCode);
    console.log("Root onCodeChange_ newCode: ", code);
    console.log("Root onCodeChange_ saveFlag: ", this.state.saveCodePromptFlag);

    // Compare before updating
    if (prevCode !== defaultCode && prevCode !== '') {
      if (prevCode !== code && this.state.saveCodePromptFlag === false) {
        console.log("SAVEEEEEEE");
        this.setState(
          {
            saveCodePromptFlag: true,
          },
          () => {
            console.log("Root onCodeChange_ AFTER state: ", this.state);
          }
        );
      }
    }

    // Update ref after checking
    this.toSaveCodeRef.current = {
      ...this.toSaveCodeRef.current,
      [activeLanguage]: code,
    };
  };


  private eventSource: EventSource | null = null;
  private onErrorMessageClick_ = (line: number) => () => {
    if (this.editorRef.current) this.editorRef.current.ivygate.revealLineInCenter(line);
  };

  private onRunClick_ = async () => {
    const { props, state } = this;
    const { locale } = props;
    const { activeLanguage, code, editorConsole, theme, userName, projectName, fileName } = state;

    this.onSaveCode_();
    this.setState({ isRunning: true });
    programRunContextHelper.setIsRunning(true);

    this.eventSource = new EventSource(`/run-code?userName=${userName}&projectName=${projectName}&fileName=${fileName}&activeLanguage=${activeLanguage}`);

    let nextConsole = StyledText.extend(editorConsole, StyledText.text({
      text: "Running...\n",
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
      console.log("Root onRunClick_ cleanOutput: ", cleanOutput);


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
    const { userName, projectName, fileName, activeLanguage, editorConsole, code } = this.state;

    console.log("onCompileClick toSaveCodeRef: ", this.toSaveCodeRef.current);
    try {
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
        editorConsole: compilingConsole
      }, async () => {

        let response: AxiosResponse<any>;
        let messages: Message[];

        if (activeLanguage === 'graphical') {

          if (this.toSaveCodeRef.current[activeLanguage] === undefined || this.toSaveCodeRef.current[activeLanguage] === '') {
            console.log("nothing to compile!");
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
            console.log("Root onCompileClick graphical: /convert-xml-to-c");
            response = await axios.post('/convert-xml-to-c', { filePath: `/home/kipr/Documents/KISS/${userName}/${projectName}/src/xmlToC.c`, xml: this.toSaveCodeRef.current[activeLanguage] });
            console.log("Root onCompileClick response: ", response);

            if (response.data.error === 'No blocks found!') {
              console.log("NO BLOCKS");

            }
            else {
              response = await axios.post('/compile-code', { userName, projectName, fileName: 'xmlToC.c', activeLanguage });
              console.log("Root onCompileClick response after compile-code: ", response);
            }
          }

          console.log("Response.data.message: ", response.data.message);

        }
        else {
          console.log("Root onCompileClick else: /compile-code");
          response = await axios.post('/compile-code', { userName, projectName, fileName, activeLanguage }); // This calls the backend route
          console.log("Root onCompileClick response: ", response);
        }
        let nextConsole: StyledText;

        switch (activeLanguage) {
          case 'c':
          case 'cpp': {

            if (response.data.message === 'successful') {
              if (response.data.warnings && response.data.warnings.length > 0) {
                messages = sort(parseMessages(response.data.warnings));
                console.log("Root onCompileClick warning messages: ", messages);
                for (const message of messages) {
                  if (nextConsole === undefined) {

                    nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                      text: LocalizedString.lookup(tr(`${message.file}\n`), locale),
                      style: STDWAR_STYLE(this.state.theme)
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
                nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                  text: LocalizedString.lookup(tr('Compilation Succeeded!\n'), locale),
                  style: STDOUT_STYLE(this.state.theme)
                }));
              }

            }

            else if (response.data.message === 'failed') {

              messages = sort(parseMessages(response.data.error));

              for (const message of messages) {
                if (nextConsole === undefined) {

                  nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                    text: LocalizedString.lookup(tr(`${message.file}\n`), locale),
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
              console.log("Root onCompileClick nextConsole: ", nextConsole);
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
            }
            else {

              let wombatDirectory = '/home/kipr/Documents/KISS/';
              let filteredError = response.data.error.replaceAll(wombatDirectory, '');
              console.log("Root onCompileClick filteredError: ", filteredError);

              nextConsole = StyledText.extend(
                compilingConsole,
                StyledText.text({
                  text: LocalizedString.lookup(tr('Compilation Failed!\n'), locale) + filteredError,
                  style: STDERR_STYLE(this.state.theme),
                })
              );
            }
            this.setState({
              editorConsole: nextConsole
            });
            break;
          }
          case 'graphical': {
            console.error("Root onCompileClick graphical: ", response.data);
            console.log("Root onCompileClick graphical state: ", this.state);
            if (response.data.error === 'No blocks found!') {
              console.log("Root onCompileClick graphical: No blocks found!");
              nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                text: LocalizedString.lookup(tr('No blocks found! Please add blocks to your graphical project.\n'), locale),
                style: STDERR_STYLE(this.state.theme)
              }));
            } else if (response.data.message === 'Nothing to compile!') {
              console.log("Root onCompileClick graphical: Nothing to compile!");
              nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                text: LocalizedString.lookup(tr('Nothing to compile! Please add blocks to your graphical project.\n'), locale),
                style: STDERR_STYLE(this.state.theme)
              }));

            }
            else if (response.data.message === 'successful') {
              console.log("Root onCompileClick graphical: Compilation Succeeded!");
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
    const { editorConsole } = this.state;


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
    console.log("onSaveCode_ state: ", this.state);
    const [name, extension] = this.state.fileName.split('.');
    this.setState({
      saveCodePromptFlag: false
    }, async () => {
      console.log("saveCodePromptFlag: ", this.state.saveCodePromptFlag);
      const { userName, activeLanguage, projectName, fileName, otherFileType } = this.state;
      const fileContents = this.toSaveCodeRef.current[activeLanguage];
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
      const updateFileContent = await axios.post('/save-file-content', { filePath, fileContents });
      console.log("onSaveCode_ updateFileContent: ", updateFileContent);
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
  private onConfirm_ = async (confirmedName: string, confirmedType: string, action: string) => {
    try {
      switch (action) {
        case 'delete':
          this.onModalClose_();
          switch (confirmedType) {
            case 'user':
              const deleteUserResponse = await axios.post('/delete-user', { userName: confirmedName });
              this.loadUsers();
              break;
            case 'project':
              const deleteProjectResponse = await axios.post('/delete-project', { userName: this.state.userName, projectName: confirmedName });
              this.props.onLoadUserData(await this.loadUserProjects());
              break;
            case 'file':
              const [name, extension] = confirmedName.split('.');
              const deleteFileResponse = await axios.post('/delete-file', { userName: this.state.userName, projectName: this.state.projectName, fileName: confirmedName, fileType: extension });
              this.props.onLoadUserData(await this.loadUserProjects());
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
    console.log("Root onDenySave_ denyType: ", denyType);

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
        console.log("Root onModalClose_ cancel action");
        this.props.resetFileExplorerProjectSelection(this.state.rootProject, this.state.fileName);
        if (this.state.tempNewFile) {
          this.setState({
            tempNewFile: ''
          })
        }
      }
    }
    if (this.props.renameUserFlag) {
      this.props.resetRenameUserFlag(false);
    }
    if (this.props.renameProjectFlag) {
      this.props.resetRenameProjectFlag(false);
    }
    if (this.props.renameFileFlag) {
      this.props.resetRenameFileFlag(false);
    }
  }

  private onClearConsole_ = () => {
    console.log("ROOT CLEAR CONSOLE");
    this.setState({
      editorConsole: StyledText.text({ text: LocalizedString.lookup(tr(''), this.props.locale), style: STDOUT_STYLE(DARK) }),
    });
  };

  private onIndentCode_ = () => {
    console.log("Root onIndentCode_ state: ", this.state);
    console.log("Root onIndentCode_ props: ", this.props);
    console.log("Root onIndentCode_ editorRef: ", this.editorRef.current);
    if (this.editorRef.current) this.editorRef.current.ivygate.formatCode();
    console.log("Root onIndentCode_ after editorRef: ", this.editorRef.current);
  };

  private onLanguageChange_ = (language: ProgrammingLanguage) => {
    this.setState({
      activeLanguage: language
    });

  };

  onDashboardClick = () => {
    window.location.href = '/';
  };

  render() {
    const { props, state } = this;

    const {
      otherFileType,
      isLeftBarOpen,
      locale,
      propUser,
      propContextMenuUser,
      propContextMenuProject,
      propContextMenuFile
    } = props;

    const {
      activeLanguage,
      code,
      modal,
      editorConsole,
      windowInnerHeight,
      isHomeStartOptionsVisible,
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
      theme,
      rootwidth,
      messages

    } = state;

    console.log("Root render state: ", this.state);
    console.log("Root render props: ", this.props);
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
            theme={theme}
            locale={locale}
            onClearConsole={this.onClearConsole_}
            activeLanguage={activeLanguage}
            onEditorPageOpen={this.onEditorPageOpen_}
            onChangeProjectName={this.onChangeProjectName}
            onCreateProjectDialog={this.onCreateProjectDialogOpen_}
            onOpenUserProject={this.onOpenUserProject_}
            onLoadUsers={this.loadUsers}
            onLoadUserData={this.loadUserProjects}
            onOpenFile={this.onOpenUserProject_}
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
          console.log("Root isEditorPageVisible state: ", this.state),
          console.log("Root isEditorPageVisible props: ", this.props),
          console.log("Root isEditorPageVisible toSaveCodeRef: ", this.toSaveCodeRef.current),
          <EditorPage
            isleftbaropen={isLeftBarOpen}
            isRunning={this.state.isRunning}
            editorTarget={undefined}
            editorConsole={editorConsole}
            messages={messages}
            code={this.toSaveCodeRef.current}
            language={activeLanguage}
            settings={DEFAULT_SETTINGS}
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
            onFileNameChange={this.handleFileNameChange} locale={'en-US'}
          />

        )}



        {modal.type === Modal.Type.CreateProject && (
          <CreateProjectDialog
            onClose={this.onModalClose_}
            showRepeatUserDialog={false} projectName={projectName} theme={theme}
            closeProjectDialog={this.onCloseProjectDialog_}
            onDocumentationSetLanguage={this.onActiveLanguageChange_}
            onChangeProjectName={this.onChangeProjectName}
            userName={rootUser.userName}
            language={activeLanguage}
            onLanguageChange={this.onLanguageChange_}
            locale={'en-US'}
            interfaceMode={rootInterfaceMode}
          />
        )}

        {(this.state.deleteUserFlag_ || this.state.deleteProjectFlag_ || this.state.deleteFileFlag_) && modal.type === Modal.Type.DeleteUserProjectFile && (
          <DeleteUserProjectFileDialog
            onClose={this.onModalClose_}
            theme={theme}
            toDeleteName={toDeleteName_}
            toDeleteType={toDeleteType_}
            onConfirm={this.onConfirm_}
            onDeny={this.onModalClose_}
            locale={'en-US'}
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
            locale={'en-US'}
            user={propContextMenuUser}
            project={propContextMenuProject}
            toRenameName={toRenameName_}
            toRenameType={toRenameType_}
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