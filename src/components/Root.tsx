import * as React from 'react';
import axios from 'axios';
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
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { HomeStartOptions } from './HomeStartOptions';
import { Modal } from '../pages/Modal';
import { BLANK_PROJECT, Project } from '../types/projectTypes';
import { InterfaceMode } from '../types/interfaceModes';
import { User } from '../types/userTypes';

interface RootParams {
  sceneId?: string;
  challengeId?: string;
}

export interface RootPublicProps extends RouteComponentProps<RootParams> {
  propFileName: string;
  propProject: Project;
  otherFileType?: string;
  propUser: User;
  propContextMenuUser?: User;
  propContextMenuFile?: string;
  loadUserDataFlag: boolean;
  addNewProject: boolean;
  addNewFile: boolean;
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
  resetFileExplorerFileSelection: (resetSelectionToFile: string) => void;
  resetFileExplorerProjectSelection: (resetSelectionToProject: Project, resetSelectionToFile: string) => void;
  resetRenameUserFlag: (renameUserFlag: boolean, renamedUser?: User) => void;
  resetRenameProjectFlag: (renameProjectFlag: boolean, renamedProject?: Project) => void;
  resetRenameFileFlag: (renameFileFlag: boolean, renamedFile?: string) => void;
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
}

type Props = RootPublicProps & RootPrivateProps;
type State = RootState;

// We can't set innerheight statically, becasue the window can change
// but we also must use innerheight to fix mobile issues
interface ContainerProps {
  $windowInnerHeight: number
}

const RootContainer = styled('div', (props: ContainerProps) => ({
  width: '100vw',
  height: `${props.$windowInnerHeight}px`, // fix for mobile, see https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'fixed',
}));

const STDOUT_STYLE = (theme: Theme) => ({
  color: theme.color
});

const STDERR_STYLE = (theme: Theme) => ({
  color: 'red'
});

const STDWAR_STYLE = (theme: Theme) => ({
  color: 'yellow'
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
        'plaintext': window.localStorage.getItem('code-plaintext') || ProgrammingLanguage.DEFAULT_USER_DATA_CODE
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
    };

    this.editorRef = React.createRef();
    this.prevPropsRef = React.createRef();
    this.prevStateRef = React.createRef();
    this.toSaveCodeRef = { current: { 'c': '', 'cpp': '', 'python': '', 'plaintext': '' } };
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

      if (nextProps.propFileName === "") {
        return true;
      }
      else if ((nextProps.propFileName !== this.props.propFileName) || (nextProps.propProject !== this.props.propProject)) {
        this.saveFile_(nextProps.propFileName);
        return false;
      }

      if (this.state.editorConsole !== nextState.editorConsole) {
        return false;
      }

    }
    return true;
  }

  componentWillUnmount(): void {
    console.log("ROOT UNMOUNTED");
  }

  componentDidUpdate = async (prevProps: Props, prevState: State) => {

    console.log("Root compDidUpdate prevProps: ", prevProps);
    console.log("Root compDidUpdate prevState: ", prevState);
    console.log("Root compDidUpdate this.props: ", this.props);
    console.log("Root compDidUpdate this.state: ", this.state);

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
    if (prevProps.propedMotorPositions !== this.props.propedMotorPositions) {
      console.log("Root compDidUpdate propedMotorPositions: ", this.props.propedMotorPositions);
      this.setState({
        rootMotorPositions: this.props.propedMotorPositions
      })
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
      const rawText = StyledText.toString(this.state.editorConsole);

      this.setState({
        theme: this.props.propedTheme,
        editorConsole: StyledText.text({ text: LocalizedString.lookup(tr(rawText), this.props.locale), style: STDOUT_STYLE(this.props.propedTheme) })
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
      this.props.onLoadUserData(await this.loadUserProjects(false, false, this.props.propUser));
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
    if ((this.props.clickFile && this.state.saveCodePromptFlag == false)) {

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
          const rootUpdateCode = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUser.userName}/${propProject.projectName}/src/${propFileName}` } });
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
        this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [activeLanguage]: ProgrammingLanguage.DEFAULT_CODE[activeLanguage] };
        this.setState({
          code: {
            ...this.state.code,
            [this.state.activeLanguage]: ProgrammingLanguage.DEFAULT_CODE[this.state.activeLanguage]
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

    let filePath = '';

    switch (extension) {
      case 'c':
      case 'cpp':
      case 'py':
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
    console.log("ROOT ONOPENUSERPROJECT");
    let toOpenProjectMainCode = await axios.get('/get-file-contents', { params: { filePath: `${filePath}` } });
    this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [projectLanguage]: toOpenProjectMainCode.data };
    this.setState({
      rootUser: passedUser,
      userName: passedUser.userName,
      projectName: toOpenProject.projectName,
      rootProject: toOpenProject,
      activeLanguage: toOpenProject.projectLanguage,
      code: {
        ...this.state.code,
        [toOpenProject.projectLanguage]: toOpenProjectMainCode.data
      },
      fileName: fileName,
      isEditorPageVisible: true,
    }, async () => {
      this.props.setRootInfo(passedUser, toOpenProject, fileName, projectLanguage);
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
    this.toSaveCodeRef.current = { ...this.toSaveCodeRef.current, [this.state.activeLanguage]: code };

    const { activeLanguage } = this.state;

    if (this.toSaveCodeRef.current[activeLanguage] !== ProgrammingLanguage.DEFAULT_CODE[activeLanguage]) {
      if (this.state.code[activeLanguage] !== code && this.state.saveCodePromptFlag == false) {
        this.setState({
          saveCodePromptFlag: true,
        });
      }
    }
  };

  private eventSource: EventSource | null = null;

  private onRunClick_ = async () => {
    const { props, state } = this;
    const { locale } = props;
    const { activeLanguage, code, editorConsole, theme, userName, projectName, fileName } = state;

    this.onSaveCode_();
    this.setState({ isRunning: true });

    this.eventSource = new EventSource(`/run-code?userName=${userName}&projectName=${projectName}&fileName=${fileName}&activeLanguage=${activeLanguage}`);

    let nextConsole = StyledText.extend(editorConsole, StyledText.text({
      text: "Running...\n",
      style: STDOUT_STYLE(this.state.theme)
    }));

    this.setState({ editorConsole: nextConsole });

    // Listen for streamed output
    this.eventSource.onmessage = (event) => {
      let output = event.data;

      // Filter out "[core/wombat]" lines if needed
      if (output.includes("[core/wombat]")) {
        output = output.split("\n")
          .filter(line => !line.startsWith("[core/wombat]"))
          .join("\n");
      }

      // Append new output lines to console
      nextConsole = StyledText.extend(nextConsole, StyledText.text({
        text: LocalizedString.lookup(tr(output + '\n'), locale),
        style: STDOUT_STYLE(this.state.theme)
      }));

      this.setState({ editorConsole: nextConsole });
    };

    this.eventSource.onerror = (error) => {
      this.eventSource.close();
      this.setState({ isRunning: false });
    };

    // Close connection when the process ends
    this.eventSource.addEventListener("end", () => {
      this.eventSource.close();
      this.setState({ isRunning: false });
    });
  };

  private onStopClick_ = async () => {
    if (this.eventSource) {
      this.eventSource.close();
      this.setState({ isRunning: false });
    }
  };

  private onCompileClick_ = async () => {
    const { locale } = this.props;
    const { userName, projectName, fileName, activeLanguage, editorConsole, code } = this.state;


    try {
      if (this.toSaveCodeRef !== undefined) {
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

     
        const response = await axios.post('/compile-code', { userName, projectName, fileName, activeLanguage }); // This calls the backend route

        let nextConsole: StyledText;

        switch (activeLanguage) {
          case 'c':
          case 'cpp': {
            if (response.data.message === 'successful') {
              nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                text: LocalizedString.lookup(tr('Compilation Succeded!\n'), locale),
                style: STDOUT_STYLE(this.state.theme)
              }));
            }
            else if (response.data.message === 'failed') {

              let errorRegex = /\/home\/kipr\/Documents\/KISS\/([^:\n]+:\d+:\d+: error: .*?)\n/g;
              let errorMatches = [...response.data.output.matchAll(errorRegex)];
              let filteredError = errorMatches.map(match => match[1]).join('\n');

              const warningRegex = /\/home\/kipr\/Documents\/KISS\/([^:\n]+:\d+:\d+: warning: .*?)\n/g;
              const warningMatches = [...response.data.output.matchAll(warningRegex)];

              if (filteredError.length == 0) {
                errorRegex = /-lkipr\s*([\s\S]*)/g;
                errorMatches = [...response.data.output.matchAll(errorRegex)];
                filteredError = errorMatches.map(match => match[1]).join('\n');
              }

              nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                text: LocalizedString.lookup(tr(`${filteredError}\n`), locale),
                style: STDERR_STYLE(this.state.theme)
              }));

              if (warningMatches.length > 0) {
                const filteredWarning = "Compilation Succeeded with Warnings\n" + warningMatches.map(match => match[1]).join('\n');
                nextConsole = StyledText.extend(nextConsole, StyledText.text({
                  text: LocalizedString.lookup(tr(`${filteredWarning}\n`), locale),
                  style: STDWAR_STYLE(this.state.theme)
                }));
              }
            }
            this.setState({
              editorConsole: nextConsole
            });
            break;
          }
          case 'python': {
            if (response.data.message === 'successful') {
              nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                text: LocalizedString.lookup(tr('Compilation Succeded!\n'), locale),
                style: STDOUT_STYLE(this.state.theme)
              }));
            }
            else {
              nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                text: LocalizedString.lookup(tr('Compilation Failed!\n'), locale),
                style: STDERR_STYLE(this.state.theme)
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

    let savingConsole: StyledText = StyledText.extend(editorConsole, StyledText.text({
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

    this.setState({
      editorConsole: StyledText.text({ text: LocalizedString.lookup(tr(''), this.props.locale), style: STDOUT_STYLE(DARK) }),
    });
  };

  // private onIndentCode_ = () => {
  //   if (this.editorRef.current) this.editorRef.current.ivygate.formatCode();
  // };

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

    } = state;

    console.log("Root render state: ", this.state);
    console.log("Root render props: ", this.props);
    return (
      <RootContainer $windowInnerHeight={windowInnerHeight}>

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
            messages={[]}
            code={this.toSaveCodeRef.current}
            language={activeLanguage}
            settings={DEFAULT_SETTINGS}
            onClearConsole={this.onClearConsole_}
            onCodeChange={this.onCodeChange_}
            onSaveCode={this.onSaveClick_}
            onRunClick={this.onRunClick_}
            onStopClick={this.onStopClick_}
            onCompileClick={this.onCompileClick_}
            onIndentCode={() => { }}
            onDownloadCode={() => { }}
            editorRef={undefined}
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