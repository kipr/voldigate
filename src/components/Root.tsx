import * as React from 'react';

import JSZip from 'jszip';
import { State as ReduxState } from '../state';
import parseMessages, { hasErrors, hasWarnings, sort, toStyledText } from '../util/parse-messages';
import { styled } from 'styletron-react';
import { DARK, Theme, LIGHT } from './theme';
import { Layout } from './Layout';

import SettingsDialog from './SettingsDialog';
import AboutDialog from './AboutDialog';

import { SimulatorState } from './SimulatorState';
import { StyledText } from '../util';
import { Message } from 'ivygate';

import axios from 'axios';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import { DEFAULT_FEEDBACK, Feedback } from '../Feedback';


import { Editor } from './Editor';
import Dict from '../Dict';
import ProgrammingLanguage from '../ProgrammingLanguage';



import { RouteComponentProps } from 'react-router';

import { connect } from 'react-redux';

import LocalizedString from '../util/LocalizedString';

import DocumentationLocation from '../state/State/Documentation/DocumentationLocation';

import tr from '@i18n';

import { HomeStartOptions } from './HomeStartOptions';
import NewFileDialog from './NewFileDialog';
import EditorPage from './EditorPage';
import CreateProjectDialog from './CreateProjectDialog';


import compile from '../compile';
import { Modal } from '../pages/Modal';
import { setupLocalRepo } from '../Git';
import DeleteUserDialog from './DeleteUserProjectFileDialog';
import DeleteUserProjectFileDialog from './DeleteUserProjectFileDialog';
import DownloadUserProjectFileDialog from './DownloadUserProjectFileDialog';
import { match } from 'node:assert';
import SaveFileDialog from './SaveFileDialog';

type Project = {
  projectName: string;
  binFolderFiles: string[];
  includeFolderFiles: string[];
  srcFolderFiles: string[];
  dataFolderFiles: string[];
  projectLanguage: ProgrammingLanguage;
}

interface User {
  [userName: string]: Project[];
}

interface RootParams {
  sceneId?: string;
  challengeId?: string;
}

export interface RootPublicProps extends RouteComponentProps<RootParams> {
  propFileName: string;
  propProjectName: string;
  propActiveLanguage: ProgrammingLanguage;
  propUserName: string;
  loadUserDataFlag: boolean;
  addNewProject: boolean;
  addNewFile: boolean;
  clickFile: boolean;
  otherFileType?: string;
  isLeftBarOpen: boolean;


  propContextMenuUser?: string;
  deleteUserFlag?: boolean;
  downloadUserFlag?: boolean;

  propContextMenuProject?: Project;
  deleteProjectFlag?: boolean;
  downloadProjectFlag?: boolean;

  propContextMenuFile?: string;
  deleteFileFlag?: boolean;
  downloadFileFlag?: boolean;



  changeProjectName: (projectName: string) => void;
  setAddNewProject: (addNewProject: boolean) => void;
  setAddNewFile: (addNewFile: boolean) => void;
  setClickFile: (clickFile: boolean) => void;
  setFileName_: (fileName: string) => void;
  onUserUpdate: (users: {}) => void;
  onLoadUserData: (userData: Project[]) => void;

  resetDeleteUserFlag: (deleteUserFlag: boolean) => void;
  resetDeleteProjectFlag: (deleteProjectFlag: boolean) => void;
  resetDeleteFileFlag: (deleteFileFlag: boolean) => void;

  resetDownloadUserFlag: (downloadUserFlag: boolean) => void;
  resetDownloadProjectFlag: (downloadProjectFlag: boolean) => void;
  resetDownloadFileFlag: (downloadFileFlag: boolean) => void;

}



interface RootPrivateProps {

  locale: LocalizedString.Language;
  onClearConsole: () => void;
  onIndentCode: () => void;
  onDownloadCode: () => void;
  onResetCode: () => void;
  editorRef: React.MutableRefObject<Editor>;


  onDocumentationClick: () => void;
  onDocumentationPush: (location: DocumentationLocation) => void;
  onDocumentationSetLanguage: (language: 'c' | 'python') => void;
  onDocumentationGoToFuzzy: (query: string, language: 'c' | 'python') => void;



}

interface RootState {
  layout: Layout;

  activeLanguage: ProgrammingLanguage;

  // A map of language to code.
  code: Dict<string>;

  simulatorState: SimulatorState;

  isRunning: boolean;

  modal: Modal;

  editorConsole: StyledText;
  messages: Message[];

  theme: Theme;

  settings: Settings;

  feedback: Feedback;

  windowInnerHeight: number;
  isHomeStartOptionsVisible: boolean;
  isNewFileDialogVisible: boolean;
  isEditorPageVisible: boolean;
  isCreateProjectDialogVisible: boolean;
  isCreateNewUserDialogVisible: boolean;
  isOpenUserProject: boolean;
  isSaveCodePromptVisible: boolean;
  projectName: string;
  fileName: string;
  addNewProject: boolean;
  addNewFile: boolean;

  deleteUserFlag_?: boolean;
  deleteProjectFlag_?: boolean;
  deleteFileFlag_?: boolean;

  downloadUserFlag_?: boolean;
  downloadProjectFlag_?: boolean;
  downloadFileFlag_?: boolean;

  toDeleteName_?: string;
  toDeleteType_?: string;
  toDownloadName_?: string;
  toDownloadType_?: string;

  toSaveName_?: string;
  toSaveType_?: string;
  toSaveCode_?: string;

  clickFileState: boolean;
  otherFileType?: string;

  userName: string;

  includeFiles: [];
  srcFiles: [];
  userDataFiles: [];

  users: string[];
  projects: [] | null;


  saveCodePromptFlag?: boolean;
  tempNewFile?: string;

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

  constructor(props: Props) {
    super(props);

    this.state = {
      layout: Layout.Side,
      activeLanguage: 'c',
      code: {
        'c': window.localStorage.getItem('code-c') || ProgrammingLanguage.DEFAULT_CODE['c'],
        'cpp': window.localStorage.getItem('code-cpp') || ProgrammingLanguage.DEFAULT_CODE['cpp'],
        'python': window.localStorage.getItem('code-python') || ProgrammingLanguage.DEFAULT_CODE['python'],
        'plaintext': window.localStorage.getItem('code-plaintext') || ProgrammingLanguage.DEFAULT_USER_DATA_CODE
      },
      modal: Modal.NONE,
      simulatorState: SimulatorState.STOPPED,
      editorConsole: StyledText.text({ text: LocalizedString.lookup(tr('Welcome to the KIPR IDE!\n'), props.locale), style: STDOUT_STYLE(LIGHT) }),
      theme: LIGHT,
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
      projectName: '',
      fileName: '',
      userName: '',
      addNewProject: this.props.addNewProject,
      addNewFile: this.props.addNewFile,
      clickFileState: this.props.clickFile,
      includeFiles: [],
      srcFiles: [],
      userDataFiles: [],
      users: [],
      projects: [],
      saveCodePromptFlag: false,
      isRunning: false,


    };

    this.editorRef = React.createRef();
    this.prevPropsRef = React.createRef();
    this.prevStateRef = React.createRef();


  }

  async componentDidMount() {



    window.addEventListener('resize', this.onWindowResize_);
    await this.loadUsers();
    //await this.loadProjects();
    console.log("isAddNewProject in mount Root.tsx:", this.props.addNewProject);
    console.log("Root.tsx: this.props:", this.props);
    console.log("addNewProject in state:", this.state.addNewProject);

    if (this.props.propUserName !== '' && this.props.propProjectName !== '' && this.props.propFileName !== '') {
      this.setState({
        userName: this.props.propUserName,
        projectName: this.props.propProjectName,
        fileName: this.props.propFileName,
        activeLanguage: this.props.propActiveLanguage,
        isOpenUserProject: true,
        isHomeStartOptionsVisible: false,
        isNewFileDialogVisible: false,
        isEditorPageVisible: true
      });
    }
  }




  shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<RootState>, nextContext: any): boolean {

    if (this.state.saveCodePromptFlag == true) {

      console.log("shouldCompUpdate saveCodePromptFlag true with state:", this.state);
      console.log("shouldCompUpdate savecodePromptFlag true with nextState:", nextState);
      if (nextProps.propFileName === "") {
        return true;
      }
      else if ((nextProps.propFileName !== this.props.propFileName)) {
        console.log("Root.tsx: propFileName changed from ", this.props.propFileName, " to ", nextProps.propFileName, "before saving -> GET BLOCKED");
        console.log("shouldComponentUpdate Root.tsx with state:", this.state);
        this.saveFile_(nextProps.propFileName);
        return false;
      }
      else if (this.state.editorConsole !== nextState.editorConsole) {
        console.log("shouldCompUpdate this.state.editorConsole:", this.state.editorConsole);
        console.log("shouldCompUpdate nextState.editorConsole:", nextState.editorConsole);
        return false;
      }

      if (nextState.toSaveCode_ !== nextState.code[nextState.activeLanguage]) {
        console.log("shouldCompUpdate nextState.toSaveCode_:", nextState.toSaveCode_);
        console.log("shouldCompUpdate nextState.code[nextState.activeLanguage]:", nextState.code[nextState.activeLanguage]);
        return false;
      }
    }


    return true;
  }

  componentDidUpdate = async (prevProps: Props, prevState: State) => {

    const previousProps = this.prevPropsRef.current;
    const previousState = this.prevStateRef.current;

    if (previousProps) {
      console.log("Previous props in Root.tsx:", previousProps);
      console.log("Current props in Root.tsx:", this.props);
      console.log("Current state in Root.tsx:", this.state);
    }

    if (previousState) {
      console.log("Previous state in Root.tsx:", previousState);
      console.log("Current state in Root.tsx:", this.state);
    }

    if (prevProps.addNewProject !== this.props.addNewProject) {


      if (this.props.addNewProject) {
        console.log("addNewProject in update Root.tsx is true");
        console.log("isAddNewProject in update Root.tsx with userName:", this.props.propUserName);
        console.log("isAddNewProject in update Root.tsx with projectName:", this.state.projectName);
        this.setState({
          userName: this.props.propUserName,
          modal: Modal.CREATEPROJECT,

        });


      }
    }
    if (prevProps.loadUserDataFlag !== this.props.loadUserDataFlag) {
      console.log("LOAD USER DATA");
      this.props.onLoadUserData(await this.loadUserData())

    }
    if (prevProps.deleteUserFlag !== this.props.deleteUserFlag && this.props.deleteUserFlag) {
      console.log("propContextMenuUser in update Root.tsx is true");
      console.log("propContextMenuUser in update Root.tsx with userName:", this.props.propContextMenuUser);
      console.log("this.props.deleteUserFlag: ", this.props.deleteUserFlag);

      this.deleteUser_();
    }

    if (prevProps.deleteProjectFlag !== this.props.deleteProjectFlag && this.props.deleteProjectFlag) {

      console.log("propContextMenuProject in update Root.tsx with projectName:", this.props.propContextMenuProject.projectName);
      console.log("propContextMenuProject in update Root.tsx with userName:", this.props.propUserName);
      console.log("this.props.deleteProjectFlag: ", this.props.deleteProjectFlag);

      this.deleteProject_();
    }


    if (prevProps.deleteFileFlag !== this.props.deleteFileFlag && this.props.deleteFileFlag) {
      console.log("propContextMenuFile in update Root.tsx is true");
      console.log("propContextMenuFile in update Root.tsx with userName:", this.props.propUserName);
      console.log("propContextMenuFile in update Root.tsx with projectName:", this.props.propProjectName);
      console.log("propContextMenuFile in update Root.tsx with fileName:", this.props.propContextMenuFile);
      console.log("this.props.deleteFileFlag: ", this.props.deleteFileFlag);

      this.deleteFile_();
    }

    if (prevProps.downloadUserFlag !== this.props.downloadUserFlag && this.props.downloadUserFlag) {
      console.log("downloadUserFlag in update Root.tsx is true");
      console.log("downloadUserFlag in update Root.tsx with userName:", this.props.propContextMenuUser);
      console.log("this.props.downloadUserFlag: ", this.props.downloadUserFlag);
      this.downloadUser_();
    }


    if (prevProps.downloadProjectFlag !== this.props.downloadProjectFlag && this.props.downloadProjectFlag) {
      console.log("downloadProjectFlag in update Root.tsx is true");
      console.log("downloadProjectFlag in update Root.tsx with userName:", this.props.propContextMenuProject);
      console.log("this.props.downloadProjectFlag: ", this.props.downloadProjectFlag);
      this.downloadProject_();
    }

    if (prevProps.downloadFileFlag !== this.props.downloadFileFlag && this.props.downloadFileFlag) {
      console.log("downloadFileFlag in update Root.tsx is true");
      console.log("downloadFileFlag in update Root.tsx with userName:", this.props.propUserName);
      console.log("downloadFileFlag in update Root.tsx with projectName:", this.props.propProjectName);
      console.log("downloadFileFlag in update Root.tsx with fileName:", this.props.propContextMenuFile);
      console.log("this.props.downloadFileFlag: ", this.props.downloadFileFlag);
      this.downloadFile_();
    }

    if (prevProps.addNewFile !== this.props.addNewFile) {

      if (this.props.addNewFile) {
        console.log("addNewFile in update Root.tsx is true");
        // console.log("Root update with propProjectName:", this.props.propProjectName);
        // console.log("Root update with otherFileType:", this.props.otherFileType);
        console.log("Root update addNewFile props:", this.props);
        console.log("Root update project language:", this.props.propActiveLanguage);
        const { propUserName, propProjectName, propFileName } = this.props;
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
          userName: propUserName,
          projectName: propProjectName,
        })

      }
    }
    if (((this.state.tempNewFile) && this.state.saveCodePromptFlag == false)) {
      console.log("Root.tsx: tempNewFile in update Root.tsx is true with tempNewFile:", this.state.tempNewFile);


      console.log("Root.tsx: this.props.propActiveLanguage:", this.props.propActiveLanguage);

      //if proped active language is python and otherFileType is h, change activeLanguage to c 
      //because of how h files are in c instead of python
      if (this.props.propActiveLanguage === 'python' && this.props.otherFileType === 'h') {
        console.log("Root.tsx: Changing activeLanguage to c because language is python and filetype is h");
        this.setState({
          activeLanguage: 'c'
        }, () => {
          console.log("New active language:", this.state.activeLanguage);
        });
      } else {
        console.log("Root.tsx: Setting activeLanguage to propActiveLanguage");
        this.setState({

          activeLanguage: this.props.propActiveLanguage,

        }, () => {
          console.log("New active language:", this.state.activeLanguage);
        });

      }

      this.setState({
        userName: this.props.propUserName,
        projectName: this.props.propProjectName,
        otherFileType: this.props.otherFileType,
        clickFileState: false,

      }, () => {
        console.log("new state in tempNewFile:", this.state);
        console.log("new state code in tempNewFile:", this.state.code);
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
    if ((prevProps.clickFile !== this.props.clickFile)) {
      console.log("clickFile in update Root.tsx is: ", this.props.clickFile);
      if ((this.props.clickFile)) {


        const { propUserName, propProjectName, propActiveLanguage, propFileName, otherFileType } = this.props;

        console.log("Proped props from HomeNavigation:", propUserName, propProjectName, propActiveLanguage, propFileName, otherFileType);
        // await this.loadCodeBasedOnExtension();



        switch (otherFileType) {
          case 'h':
            const rootUpdateHeader = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUserName}/${propProjectName}/include/${propFileName}` } });
            console.log("rootUpdateHeader response:", rootUpdateHeader);
            this.setState({
              code: {
                ...this.state.code,
                [propActiveLanguage]: rootUpdateHeader.data
              }
            }, () => {
              console.log("new state code in clickFile:", this.state.code);
            });
            break;
          case 'c':
          case 'cpp':
          case 'py':
            const rootUpdateCode = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUserName}/${propProjectName}/src/${propFileName}` } });
            console.log("rootUpdateCode response:", rootUpdateCode);
            this.setState({
              code: {
                ...this.state.code,
                [propActiveLanguage]: rootUpdateCode.data
              }
            }, () => {
              console.log("new state code in clickFile:", this.state.code);
            });
            break;
          case 'txt':
            const rootUpdateUserFiles = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUserName}/${propProjectName}/data/${propFileName}` } });
            console.log("rootUpdateUserFiles response:", rootUpdateUserFiles);
            this.setState({
              code: {
                ...this.state.code,
                [propActiveLanguage]: rootUpdateUserFiles.data
              }
            }, () => {
              console.log("new state code in clickFile:", this.state.code);
            });
            break;
        }


        //if proped active language is python and otherFileType is h, change activeLanguage to c 
        //because of how h files are in c instead of python
        if (this.props.propActiveLanguage === 'python' && this.props.otherFileType === 'h') {
          console.log("Root.tsx: Changing activeLanguage to c because language is python and filetype is h");
          this.setState({
            activeLanguage: 'c'
          }, () => {
            console.log("New active language:", this.state.activeLanguage);
          });
        } else {
          console.log("Root.tsx: Setting activeLanguage to propActiveLanguage");
          this.setState({

            activeLanguage: this.props.propActiveLanguage,

          }, () => {
            console.log("New active language:", this.state.activeLanguage);
          });

        }

        this.setState({
          userName: this.props.propUserName,
          projectName: this.props.propProjectName,
          fileName: this.props.propFileName,
          otherFileType: this.props.otherFileType,
          clickFileState: false,

        }, () => {
          console.log("new state code in clickFile:", this.state.code);
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
        this.props.setClickFile(false);


      }
    }

    this.prevPropsRef.current = this.props;
  }


  componentWillUnmount() {
    console.log("Root unmount");

  }

  private updateCode = async (tempNewFile: string) => {
    console.log("updateCode in Root.tsx with state:", this.state);
    console.log("updateCode in Root.tsx with props:", this.props);
    const { propUserName, propProjectName, propActiveLanguage, propFileName, otherFileType } = this.props;
    switch (otherFileType) {
      case 'h':
        const rootUpdateHeader = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUserName}/${propProjectName}/include/${tempNewFile}` } });
        console.log("rootUpdateHeader response:", rootUpdateHeader);
        this.setState({
          code: {
            ...this.state.code,
            [propActiveLanguage]: rootUpdateHeader.data
          }
        }, () => {
          console.log("new state code in updateCode:", this.state.code);
          console.log("new state in updateCode:", this.state);
        });
        break;
      case 'c':
      case 'cpp':
      case 'py':
        const rootUpdateCode = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUserName}/${propProjectName}/src/${tempNewFile}` } });
        console.log("rootUpdateCode response:", rootUpdateCode);
        this.setState({
          code: {
            ...this.state.code,
            [propActiveLanguage]: rootUpdateCode.data
          }
        }, () => {
          console.log("new state code in updateCode:", this.state.code);
          console.log("new state in updateCode:", this.state);
        });
        break;
      case 'txt':
        const rootUpdateUserFiles = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${propUserName}/${propProjectName}/data/${tempNewFile}` } });
        console.log("rootUpdateUserFiles response:", rootUpdateUserFiles);
        this.setState({
          code: {
            ...this.state.code,
            [propActiveLanguage]: rootUpdateUserFiles.data
          }
        }, () => {
          console.log("new state code in updateCode:", this.state.code);
          console.log("new state in updateCode:", this.state);
        });
        break;
    }

  }

  private loadUsers = async (): Promise<string[]> => {

    console.log("Root loadUsers");
    try {
      const getUserResponse = await axios.get('/get-users', { params: { filePath: "/home/kipr/Documents/KISS" } });
      console.log("loadUsers Response: ", getUserResponse);

      const userDirectories: string[] = getUserResponse.data.directories;

      this.setState({
        users: userDirectories,
      }, () => {
        console.log("loadUsers state.users", this.state.users);
        this.props.onUserUpdate(this.state.users);
      });


      return userDirectories;
    }
    catch (error) {
      console.error("Root loadUsers caught error: ", error);
      return [];
    }

  }

  private loadUserData = async (openedUserDialog?: boolean, desiredUser?: string): Promise<Project[]> => {
    console.log("Root loadUserData");
    console.log("loadUserData openedUserDialog:", openedUserDialog);
    console.log("loadUserData desiredUser:", desiredUser);
    console.log("propUserName:", this.props.propUserName);

    let chosenUser: string;
    if (openedUserDialog && desiredUser) {
      chosenUser = desiredUser;
    }
    else {
      chosenUser = this.props.propUserName;
    }
    try {
      const response = await axios.get('/get-projects', { params: { filePath: `/home/kipr/Documents/KISS/${chosenUser}` } });
      console.log("loadProjects Response: ", response)

      const projectDirectories = response.data.directories;
      console.log("projectDirectories:", projectDirectories);

      //each project into a Project object
      const projects: Project[] = await Promise.all(
        projectDirectories.map(async (projectName) => {
          // Simulating file retrieval for each project (you may need to adjust this based on backend data)
          const projectDataResponse = await axios.get('/get-project-folders', {
            params: { filePath: `/home/kipr/Documents/KISS/${chosenUser}/${projectName}` }
          });

          const projectData = projectDataResponse.data.directories;


          const dataFilesDataResponse = await axios.get('/get-folder-contents', { params: { filePath: `/home/kipr/Documents/KISS/${chosenUser}/${projectName}/${projectData[2]}` } });

          const includeDataResponse = await axios.get('/get-folder-contents', { params: { filePath: `/home/kipr/Documents/KISS/${chosenUser}/${projectName}/${projectData[3]}` } });

          const srcDataResponse = await axios.get('/get-folder-contents', { params: { filePath: `/home/kipr/Documents/KISS/${chosenUser}/${projectName}/${projectData[4]}` } });

          const projectLanguageResponse = await axios.get('/get-project-language', { params: { filePath: `/home/kipr/Documents/KISS/${chosenUser}/${projectName}` } });
          console.log("projectLanguageResponse.data:", projectLanguageResponse.data);
          const filteredDataFiles = dataFilesDataResponse.data.files.filter(file => !file.startsWith('.'));
          const filteredSrcFiles = srcDataResponse.data.files.filter(file => !file.startsWith('.'));
          const filteredIncludeFiles = includeDataResponse.data.files.filter(file => !file.startsWith('.'));

          // Construct the Project object
          return {
            projectName,
            binFolderFiles: [],
            includeFolderFiles: filteredIncludeFiles || [],
            srcFolderFiles: filteredSrcFiles || [],
            dataFolderFiles: filteredDataFiles || [],
            projectLanguage: projectLanguageResponse.data.language || '' as ProgrammingLanguage
          } as Project;
        })
      );
      console.log("Transformed Projects: ", projects);
      return projects;
    }


    catch (error) {

    }


  }

  private deleteUser_ = () => {
    console.log("deleteUser_ in Root.tsx with propContextMenuUser:", this.props.propContextMenuUser);
    this.setState({
      modal: Modal.DELETEUSERPROJECTFILE,
      deleteUserFlag_: true,
      toDeleteName_: this.props.propContextMenuUser,
      toDeleteType_: 'user'

    });
  }

  private deleteProject_ = () => {
    console.log("deleteProject_ in Root.tsx with propContextMenuProject:", this.props.propContextMenuProject);
    this.setState({
      modal: Modal.DELETEUSERPROJECTFILE,
      deleteProjectFlag_: true,
      userName: this.props.propUserName,
      toDeleteName_: this.props.propContextMenuProject.projectName,
      toDeleteType_: 'project'

    });
  }

  private deleteFile_ = () => {
    console.log("deleteFile_ in Root.tsx with propContextMenuFile:", this.props.propContextMenuFile);
    this.setState({
      modal: Modal.DELETEUSERPROJECTFILE,
      deleteFileFlag_: true,
      userName: this.props.propUserName,
      projectName: this.props.propProjectName,
      toDeleteName_: this.props.propContextMenuFile,
      toDeleteType_: 'file'

    });
  }

  private downloadUser_ = () => {
    console.log("downloadUser_ in Root.tsx with propContextMenuUser:", this.props.propContextMenuUser);
    this.setState({
      modal: Modal.DOWNLOADUSERPROJECTFILE,
      downloadUserFlag_: true,
      toDownloadName_: this.props.propContextMenuUser,
      toDownloadType_: 'user'

    });

  }

  private downloadProject_ = () => {
    console.log("downloadProject_ in Root.tsx with propContextMenuProject:", this.props.propContextMenuProject);
    this.setState({
      modal: Modal.DOWNLOADUSERPROJECTFILE,
      downloadProjectFlag_: true,
      userName: this.props.propUserName,
      toDownloadName_: this.props.propContextMenuProject.projectName,
      toDownloadType_: 'project'

    });

  }

  private downloadFile_ = () => {
    console.log("downloadFile_ in Root.tsx with propContextMenuFile:", this.props.propContextMenuFile);
    this.setState({
      modal: Modal.DOWNLOADUSERPROJECTFILE,
      downloadFileFlag_: true,
      userName: this.props.propUserName,
      projectName: this.props.propProjectName,
      toDownloadName_: this.props.propContextMenuFile,
      toDownloadType_: 'file'

    });

  }
  private saveFile_(tempNewFile_: string): void {
    console.log("saveFile_ in Root.tsx with name:", this.state.fileName, "with toSaveCode_: ", this.state.toSaveCode_);
    console.log("saveFile_ in Root with current state code:", this.state.code);
    this.setState({
      modal: Modal.SAVEFILE,
      isSaveCodePromptVisible: true,
      toSaveName_: this.state.fileName,
      clickFileState: false,
      tempNewFile: tempNewFile_,
      toSaveType_: 'file',
      code: {
        ...this.state.code,
        [this.state.activeLanguage]: this.state.toSaveCode_
      }
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

  private onCloseProjectDialog_ = async (newProjName: string, newProjLanguage: ProgrammingLanguage) => {
    console.log("onCloseProjectDialog_ newProject and newLanguage:", newProjName, newProjLanguage);
    console.log("inside onCloseProjectDialog_ in Root.tsx with before state:", this.state);
    const { userName } = this.state;
    try {

      this.setState((prevState) => {
        const updatedUsers = [...prevState.users]; // Clone the current users state
        console.log("prevState.users: ", prevState.users);
        console.log("updatedUsers: ", updatedUsers);
        // Add the current userName if it's not already in the list
        if (!updatedUsers.includes(userName)) {
          updatedUsers.push(userName); // Add the userName to the array if not already present
        }


        return { users: updatedUsers }; // Update the users state
      }, () => {
        console.log("onCloseProj users after update:", this.state.users);
        this.props.onUserUpdate(this.state.users);
      });

    }
    catch (error) {

    }

    this.setState({

      modal: Modal.NONE,
      userName: this.state.userName,
      projectName: newProjName,
      activeLanguage: newProjLanguage,
      fileName: `main.${ProgrammingLanguage.FILE_EXTENSION[newProjLanguage]}`,

    }, async () => {
      console.log("inside onCloseProjectDialog_ in Root.tsx with after state:", this.state);
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
      this.props.onLoadUserData(await this.loadUserData())


      if (this.props.addNewProject) {
        this.setState({
          addNewProject: false
        });
      }



      this.props.setAddNewProject(false);

    });

  }

  private onCloseNewFileDialog_ = async (newFileName: string, fileType: string) => {
    const prePath = `/home/kipr/Documents/KISS`;
    let filePath = '';
    const { userName, activeLanguage, projectName, otherFileType, code } = this.state;
    console.log("onCloseNewfileDialog_ state:", this.state);
    console.log("onCloseNewFileDialog_ newFileName:", newFileName);
    console.log("onCloseNewFileDialog_ fileType: ", fileType);
    switch (fileType) {
      case 'h':
        this.setState({

          code: {
            ...this.state.code,
            [this.state.activeLanguage]: ProgrammingLanguage.DEFAULT_HEADER_CODE
          }
        }, async () => {
          console.log("onCloseNewFileDialog_ with new state code:", this.state.code);
          const fileContents = this.state.code[activeLanguage];
          console.log("fileContents: ", fileContents);
          const addNewFileContentResponse = await axios.post('/save-file-content', { filePath, fileContents });
          console.log("addNewFileContentResponse:", addNewFileContentResponse);
        });
        filePath = `${prePath}/${userName}/${projectName}/include/${newFileName}.h`;
        //file
        break;
      case 'c':
      case 'cpp':
      case 'py':
        this.setState({
          code: {
            ...this.state.code,
            [this.state.activeLanguage]: ProgrammingLanguage.DEFAULT_CODE[this.state.activeLanguage]
          }
        }, async () => {
          console.log("onCloseNewFileDialog_ (.c/.cpp/.py) with new state code:", this.state.code);
          const fileContents = this.state.code[activeLanguage];
          console.log("fileContents: ", fileContents);
          const addNewFileContentResponse = await axios.post('/save-file-content', { filePath, fileContents });
          console.log("addNewFileContentResponse:", addNewFileContentResponse);

        });
        filePath = `${prePath}/${userName}/${projectName}/src/${newFileName}.${fileType}`;
        break;
      case 'txt':
        this.setState({
          code: {
            ...this.state.code,
            [this.state.activeLanguage]: ProgrammingLanguage.DEFAULT_USER_DATA_CODE
          }
        }, async () => {
          console.log("onCloseNewFileDialog_ (.txt) with new state code:", this.state.code);
          const fileContents = this.state.code[activeLanguage];
          console.log("fileContents: ", fileContents);
          const addNewFileContentResponse = await axios.post('/save-file-content', { filePath, fileContents });
          console.log("addNewFileContentResponse:", addNewFileContentResponse);
        });
        filePath = `${prePath}/${userName}/${projectName}/data/${newFileName}.txt`;
        //file
        break;

    }



    this.setState({
      isCreateProjectDialogVisible: false,
      modal: Modal.NONE,
      fileName: `${newFileName}.${fileType}`,
      projectName: this.props.propProjectName,


    }, async () => {
      console.log("onCloseNewFileDialog_ with new state:", this.state);


      this.props.onLoadUserData(await this.loadUserData())
      if (this.state.isHomeStartOptionsVisible == true) {
        this.setState({
          isHomeStartOptionsVisible: false
        });
      }
      if (this.state.isEditorPageVisible == false) {
        this.setState({
          isEditorPageVisible: true
        }, () => {
          console.log("onCloseNewFileDialog_ after isEditorPageVisible set to true, code:", this.state.code);
        });
      }
      this.props.setAddNewFile(false);
    });


  }
  private onCreateProjectDialogOpen_ = (name: string) => {

    this.setState({
      userName: name,
      isCreateNewUserDialogVisible: false,
      isCreateProjectDialogVisible: true,
      modal: Modal.CREATEPROJECT
    });

    console.log("userName: ", this.state.userName);
  }
  private onEditorPageOpen_ = () => {
    console.log("onEditorPageOpen_ clicked in Root with state fileName:", this.state.fileName);
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

    console.log("handleFileNameChange with new state fileName:", this.state.fileName);
  }

  private onOpenUserProject_ = async (name: string, projectName: string, fileName: string, projectLanguage: ProgrammingLanguage) => {

    const getProjects = await this.loadUserData(true, name);
    let toOpenProject = getProjects.find(project => project.projectName === projectName);
    let toOpenProjectMainCode = await axios.get('/get-file-contents', { params: { filePath: `/home/kipr/Documents/KISS/${name}/${projectName}/src/${fileName}` } });

    this.setState({
      userName: name,
      projectName: toOpenProject.projectName,
      activeLanguage: toOpenProject.projectLanguage,
      code: {
        ...this.state.code,
        [toOpenProject.projectLanguage]: toOpenProjectMainCode.data
      },
      fileName: fileName,
      isEditorPageVisible: true,
    }, async () => {

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
    console.log("onCodeChange_ in Root with current state code:", this.state.code);
    console.log("onCodeChange_ in Root with code:", code);
    console.log("onCodeChange_ in Root with saveCodePromptFlag:", this.state.saveCodePromptFlag);
    const { activeLanguage } = this.state;

    if (this.state.code[activeLanguage] !== code && this.state.saveCodePromptFlag == false) {
      this.setState({
        saveCodePromptFlag: true,
        toSaveCode_: code

      }, () => { console.log("onCodeChange_ code changed, saveCodePromptFlag is true, NEED TO SAVE"); });
      //this.props.setFileName_(this.state.fileName);
    }
    else if (this.state.saveCodePromptFlag == true) {
      console.log("onCodeChange_ code changed, NEED TO SAVE");
      this.setState({
        toSaveCode_: code
      });
    }


  };

  private eventSource: EventSource | null = null;

  private onRunClick_ = async () => {
    console.log("onRunClick_ in Root");
    const { props, state } = this;
    const { locale } = props;
    const { activeLanguage, code, editorConsole, theme, userName, projectName, fileName } = state;

    this.onSaveCode_();
    this.setState({ isRunning: true });
    const activeCode = code[activeLanguage];
    console.log("onRunClick_ activeCode:", activeCode);


    this.eventSource = new EventSource(`/run-code?userName=${userName}&projectName=${projectName}&fileName=${fileName}&activeLanguage=${activeLanguage}`);

    let nextConsole = StyledText.extend(editorConsole, StyledText.text({
      text: "Running...\n",
      style: STDOUT_STYLE(this.state.theme)
    }));

    this.setState({ editorConsole: nextConsole });

    // Listen for streamed output
    this.eventSource.onmessage = (event) => {
      console.log("Received output:", event.data);
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
      console.error("EventSource error:", error);
      this.eventSource.close();
      this.setState({ isRunning: false });
    };

    // Close connection when the process ends
    this.eventSource.addEventListener("end", () => {
      console.log("Execution finished.");
      this.eventSource.close();
      this.setState({ isRunning: false });
    });
  };

  private onStopClick_ = async () => {
    console.log("onStopClick_ in Root");
    if (this.eventSource) {
      this.eventSource.close();
      this.setState({ isRunning: false });
      console.log("EventSource connection closed.");
    }

  };

  private onCompileClick_ = async () => {
    console.log("onCompileClick_ in Root");
    const { locale } = this.props;
    const { userName, projectName, fileName, activeLanguage, editorConsole, code } = this.state;
    console.log("onCompileClick before try state: ", this.state);
    try {
      if (this.state.toSaveCode_ !== undefined) {
        await this.onSaveCode_();
      }

      const activeCode = code[activeLanguage];
      let compilingConsole: StyledText = StyledText.extend(editorConsole, StyledText.text({
        text: LocalizedString.lookup(tr('Compiling...\n'), locale),
        style: STDOUT_STYLE(this.state.theme)
      }));

      this.setState({
        simulatorState: SimulatorState.COMPILING,
        editorConsole: compilingConsole
      }, async () => {

        const response = await axios.post('/compile-code', { userName, projectName, fileName, activeLanguage }); // This calls the backend route
        console.log("onCompileClick response.data: ", response.data);  // Display the response from the backend

        let nextConsole: StyledText;
        console.log("nextConsole in onCompileClick_:", nextConsole);
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

              console.log("Compilation Failed with errors:", response.data.output);
              const errorRegex = /\/home\/kipr\/Documents\/KISS\/([^:\n]+:\d+:\d+: error: .*?)\n/g;
              const errorMatches = [...response.data.output.matchAll(errorRegex)];
              const filteredError = errorMatches.map(match => match[1]).join('\n');

              const warningRegex = /\/home\/kipr\/Documents\/KISS\/([^:\n]+:\d+:\d+: warning: .*?)\n/g;
              const warningMatches = [...response.data.output.matchAll(warningRegex)];

              console.log("errorMatches:", errorMatches);
              console.log("filteredError:", filteredError);

              nextConsole = StyledText.extend(compilingConsole, StyledText.text({
                text: LocalizedString.lookup(tr(`${filteredError}\n`), locale),
                style: STDERR_STYLE(this.state.theme)
              }));

              if (warningMatches.length > 0) {
                const filteredWarning = "Compilation Succeeded with Warnings\n" + warningMatches.map(match => match[1]).join('\n');
                console.log("filteredWarning:", filteredWarning);
                nextConsole = StyledText.extend(nextConsole, StyledText.text({
                  text: LocalizedString.lookup(tr(`${filteredWarning}\n`), locale),
                  style: STDWAR_STYLE(this.state.theme)
                }));
              }

            }
            this.setState({
              simulatorState: SimulatorState.COMPILING,
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
              simulatorState: SimulatorState.COMPILING,
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
    const [name, extension] = this.state.fileName.split('.');
    this.setState({
      saveCodePromptFlag: false
    }, async () => {
      const { userName, activeLanguage, projectName, fileName, otherFileType } = this.state;
      // const fileContents = this.state.code[activeLanguage];
      console.log("onSavecode with state code before saving over:", this.state.code);
      const fileContents = this.state.toSaveCode_;
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
      console.log("onSavecode toSaveCode_:", this.state.toSaveCode_);
      console.log("onSaveCode filepath: ", filePath);
      const updateFileContent = await axios.post('/save-file-content', { filePath, fileContents });
      console.log("updateFileContent:", updateFileContent);
      this.setState({

        code: {
          ...this.state.code,
          [this.state.activeLanguage]: fileContents
        },
        toSaveCode_: undefined
      }, () => {
        console.log("onSaveCode_ with new state code:", this.state.code);
      });
    });
  };


  private onConfirm_ = async (confirmedName: string, confirmedType: string, action: string) => {

    console.log("onConfirm clicked in Root with confirmedName:", confirmedName, " and confirmedType:", confirmedType, " and action:", action);
    this.onModalClose_();
    console.log("onConfirm this.state.userName:", this.state.userName, " this.state.projectName:", this.state.projectName, " this.state.fileName:", this.state.fileName);

    try {



      switch (action) {
        case 'delete':
          console.log("onConfirm_ delete action")
          switch (confirmedType) {
            case 'user':
              const deleteUserResponse = await axios.post('/delete-user', { userName: confirmedName });
              console.log("deleteUserResponse:", deleteUserResponse);
              this.loadUsers();
              break;
            case 'project':
              const deleteProjectResponse = await axios.post('/delete-project', { userName: this.state.userName, projectName: confirmedName });
              console.log("deleteProjectResponse:", deleteProjectResponse);
              this.props.onLoadUserData(await this.loadUserData());
              break;
            case 'file':
              const [name, extension] = confirmedName.split('.');
              console.log("File extension is: ", extension);
              const deleteFileResponse = await axios.post('/delete-file', { userName: this.state.userName, projectName: this.state.projectName, fileName: confirmedName, fileType: extension });
              console.log("deleteFileResponse:", deleteFileResponse);
              this.props.onLoadUserData(await this.loadUserData());
              break;
          }
          break;

        case 'download':
          console.log("onConfirm_ download action")
          switch (confirmedType) {
            case 'user':
              try {
                const downloadUserResponse = await fetch('/download-zip', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userName: confirmedName }),
                });
                console.log("downloadUserResponse:", downloadUserResponse);

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
                console.log("downloadUserResponse:", downloadUserResponse);

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
                console.log("downloadUserResponse:", downloadUserResponse);

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
          console.log("onConfirm_ save action")
          console.log("onConfirm tempNewFile:", this.state.tempNewFile);
          console.log("onConfirm before save state:", this.state);
          const [name, extension] = confirmedName.split('.');
          console.log("File extension is: ", extension);
          let saveFileResponse = '';
          switch (extension) {
            case 'c':
              saveFileResponse = await axios.post('/save-file-content', { filePath: `/home/kipr/Documents/KISS/${this.state.userName}/${this.state.projectName}/src/${this.state.fileName}`, fileContents: this.state.toSaveCode_ });
              console.log("saveFileResponse (src):", saveFileResponse);
              this.setState({
                saveCodePromptFlag: false,
                fileName: this.state.tempNewFile,
                activeLanguage: 'c',
                toSaveCode_: undefined
              });
              break;
            case 'cpp':
              saveFileResponse = await axios.post('/save-file-content', { filePath: `/home/kipr/Documents/KISS/${this.state.userName}/${this.state.projectName}/src/${this.state.fileName}`, fileContents: this.state.toSaveCode_ });
              console.log("saveFileResponse (src):", saveFileResponse);
              this.setState({
                saveCodePromptFlag: false,
                fileName: this.state.tempNewFile,
                activeLanguage: 'cpp',
                toSaveCode_: undefined
              });
              break;
            case 'py':
              saveFileResponse = await axios.post('/save-file-content', { filePath: `/home/kipr/Documents/KISS/${this.state.userName}/${this.state.projectName}/src/${this.state.fileName}`, fileContents: this.state.toSaveCode_ });
              console.log("saveFileResponse (src):", saveFileResponse);
              this.setState({
                saveCodePromptFlag: false,
                fileName: this.state.tempNewFile,
                activeLanguage: 'python',
                toSaveCode_: undefined
              });
              break;
            case 'txt':
              saveFileResponse = await axios.post('/save-file-content', { filePath: `/home/kipr/Documents/KISS/${this.state.userName}/${this.state.projectName}/data/${this.state.fileName}`, fileContents: this.state.toSaveCode_ });
              console.log("saveFileResponse (data):", saveFileResponse);
              this.setState({
                saveCodePromptFlag: false,
                fileName: this.state.tempNewFile,
                activeLanguage: 'plaintext',
                toSaveCode_: undefined
              });
              break;
            case 'h':
              saveFileResponse = await axios.post('/save-file-content', { filePath: `/home/kipr/Documents/KISS/${this.state.userName}/${this.state.projectName}/include/${this.state.fileName}`, fileContents: this.state.toSaveCode_ });
              console.log("saveFileResponse (include):", saveFileResponse);
              this.setState({
                saveCodePromptFlag: false,
                fileName: this.state.tempNewFile,
                activeLanguage: 'c',
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
    console.log("onDenySave_ clicked in Root with denyType:", denyType);

    if (denyType == 'continue') {
      console.log("onDenySave_ with denyType continue");
      this.setState({
        saveCodePromptFlag: false
      }, async () => {
        this.onModalClose_();
      });
    }
    else if (denyType == 'cancel') {
      console.log("onDenySave_ with denyType cancel");
      this.onModalClose_();
    }



  }
  private onModalClose_ = async () => {
    this.setState({ modal: Modal.NONE, deleteUserFlag_: false });

    if (this.props.addNewProject) {
      this.props.setAddNewProject(false);
      console.log("onModalClose_ with proped: ", this.props.propFileName);
      console.log("onModalClose_ with state project: ", this.state.projectName);
      this.setState({
        projectName: this.props.propProjectName,
        fileName: this.props.propFileName,
        activeLanguage: this.props.propActiveLanguage
      });
    }

    if (this.props.addNewFile) {
      this.props.setAddNewFile(false);
      const previousProps = this.prevPropsRef.current;
      const previousState = this.prevStateRef.current;
      console.log("onModalClose_ addNewFile with previousProps: ", previousProps);
      console.log("onModalClose_ addNewFile with previousState: ", previousState);
      console.log("onModalClose_ addNewFile with props: ", this.props);
      console.log("onModalClose_ addNewFile with state: ", this.state);
      this.setState({
        projectName: this.props.propProjectName,
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
  }



  private onClearConsole_ = () => {

    console.log("onClearConsole_ clicked in Root");
    // this.setState({
    //   editorConsole: StyledText.text({ text: LocalizedString.lookup(tr(''), this.props.locale), style: STDOUT_STYLE(DARK) }),
    // });
    console.log("Current editorConsole: ", this.state.editorConsole);
    const newConsole = StyledText.text({ text: LocalizedString.lookup(tr(''), this.props.locale), style: STDOUT_STYLE(DARK) });

    if (this.state.editorConsole === newConsole) {
      console.log("onClearConsole_ with same console, no need to update");
    }
    else {
      this.setState((prevState) => ({
        ...prevState,
        editorConsole: StyledText.text({ text: LocalizedString.lookup(tr(''), this.props.locale), style: STDOUT_STYLE(DARK) }),
      }), () => {
        console.log("after onClearConsole_ with new state:", this.state.editorConsole);
      });
    }


  };


  // private onIndentCode_ = () => {
  //   if (this.editorRef.current) this.editorRef.current.ivygate.formatCode();
  // };

  private onLanguageChange_ = (language: ProgrammingLanguage) => {
    this.setState({
      activeLanguage: language
    }, () => {

      console.log("In Root: Updated language to: ", this.state.activeLanguage);
      //this.props.onDocumentationSetLanguage(language === 'python' ? 'python' : 'c');
    });

  };

  onDocumentationClick = () => {
    //window.open("https://www.kipr.org/doc/index.html");
  };


  onDashboardClick = () => {
    window.location.href = '/';
  };



  private onSettingsChange_ = (changedSettings: Partial<Settings>) => {
    const nextSettings: Settings = {
      ...this.state.settings,
      ...changedSettings
    };



    this.setState({ settings: nextSettings });
  };




  render() {
    const { props, state } = this;

    const {
      otherFileType,
      isLeftBarOpen,
      locale
    } = props;


    const {
      activeLanguage,
      code,
      modal,
      editorConsole,
      settings,
      windowInnerHeight,
      isHomeStartOptionsVisible,
      projectName,
      fileName,
      userName,
      isEditorPageVisible,
      toDeleteName_,
      toDeleteType_,
      toDownloadName_,
      toDownloadType_,
      toSaveName_,
      toSaveType_
    } = state;

    console.log("Root render with state:", state);


    const theme = LIGHT;

    return (
      <RootContainer $windowInnerHeight={windowInnerHeight}>



        {modal.type === Modal.Type.Settings && (
          <SettingsDialog
            theme={theme}
            settings={settings}
            onSettingsChange={this.onSettingsChange_}
            onClose={this.onModalClose_}
          />
        )}
        {modal.type === Modal.Type.About && (
          <AboutDialog
            theme={theme}
            onClose={this.onModalClose_}
          />
        )}


        {
          isHomeStartOptionsVisible && (
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
              onLoadUserData={this.loadUserData}
            />
          )
        }
        {modal.type === Modal.Type.CreateFile && (
          <NewFileDialog
            onClose={this.onModalClose_}
            showRepeatUserDialog={false}
            fileName={projectName}
            language={activeLanguage}
            theme={theme}
            onEditorPageOpen={this.onEditorPageOpen_}
            otherFileType={otherFileType}

            onCloseNewFileDialog={this.onCloseNewFileDialog_}
          >


          </NewFileDialog>
        )
        }
        {isEditorPageVisible && (
          console.log("EditorPage is visible in Root with state:", this.state),
          <EditorPage
            isleftbaropen={isLeftBarOpen}
            isRunning={this.state.isRunning}
            editorTarget={undefined}
            editorConsole={editorConsole}
            messages={[]}
            code={code}
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
            projectName={projectName}
            fileName={fileName}
            userName={userName}
            onFileNameChange={this.handleFileNameChange}

          />

        )}

        {modal.type === Modal.Type.CreateProject && (

          <CreateProjectDialog
            onClose={this.onModalClose_}
            showRepeatUserDialog={false} projectName={projectName} theme={theme}
            closeProjectDialog={this.onCloseProjectDialog_}
            onDocumentationSetLanguage={this.onActiveLanguageChange_}
            onChangeProjectName={this.onChangeProjectName}
            userName={userName}
            language={activeLanguage}
            onLanguageChange={this.onLanguageChange_}>
          </CreateProjectDialog>

        )}

        {(this.state.deleteUserFlag_ || this.state.deleteProjectFlag_ || this.state.deleteFileFlag_) && modal.type === Modal.Type.DeleteUserProjectFile && (
          <DeleteUserProjectFileDialog
            onClose={this.onModalClose_}
            theme={theme}
            toDeleteName={toDeleteName_}
            toDeleteType={toDeleteType_}
            onConfirm={this.onConfirm_}
            onDeny={this.onModalClose_}

          >
          </DeleteUserProjectFileDialog>

        )}

        {(this.state.downloadUserFlag_ || this.state.downloadProjectFlag_ || this.state.downloadFileFlag_) && modal.type === Modal.Type.DownloadUserProjectFile && (
          <DownloadUserProjectFileDialog
            onClose={this.onModalClose_}
            theme={theme}
            toDownloadName={toDownloadName_}
            toDownloadType={toDownloadType_}
            onConfirm={this.onConfirm_}
            onDeny={this.onModalClose_}
          ></DownloadUserProjectFileDialog>
        )}

        {this.state.isSaveCodePromptVisible && modal.type === Modal.Type.SaveFile && (
          <SaveFileDialog
            onClose={this.onModalClose_}
            onConfirm={this.onConfirm_}
            onDenySave={this.onDenySave_}
            toSaveName={toSaveName_}
            toSaveType={toSaveType_}
            theme={theme}>


          </SaveFileDialog>
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