import * as React from 'react';


import { State as ReduxState } from '../state';
import parseMessages, { hasErrors, hasWarnings, sort, toStyledText } from '../util/parse-messages';
import { styled } from 'styletron-react';
import { DARK, Theme } from './theme';
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

import { DatabaseService } from './DatabaseService';
import compile from '../compile';
import { Modal } from '../pages/Modal';


interface RootParams {
  sceneId?: string;
  challengeId?: string;
}

export interface RootPublicProps extends RouteComponentProps<RootParams> {
  propFileName: string;
  propProjectName: string;
  propActiveLanguage: ProgrammingLanguage;
  propUserName: string;
  addNewProject: boolean;
  addNewFile: boolean;
  clickFile: boolean;
  otherFileType?: string;
  isLeftBarOpen: boolean;
  changeProjectName: (projectName: string) => void;
  setAddNewProject: (addNewProject: boolean) => void;
  setAddNewFile: (addNewFile: boolean) => void;
  setClickFile: (clickFile: boolean) => void;

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
  projectName: string;
  fileName: string;
  addNewProject: boolean;
  addNewFile: boolean;
  clickFileState: boolean;

  otherFileType?: string;

  userName: string;

}

type Props = RootPublicProps & RootPrivateProps;
type State = RootState;

// We can't set innerheight statically, becasue the window can change
// but we also must use innerheight to fix mobile issues
interface ContainerProps {
  $windowInnerHeight: number
}


interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
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

class Root extends React.Component<Props, State> {
  private editorRef: React.MutableRefObject<Editor>;


  constructor(props: Props) {
    super(props);

    this.state = {
      layout: Layout.Side,
      activeLanguage: 'c',
      code: {
        'c': window.localStorage.getItem('code-c') || ProgrammingLanguage.DEFAULT_CODE['c'],
        'cpp': window.localStorage.getItem('code-cpp') || ProgrammingLanguage.DEFAULT_CODE['cpp'],
        'python': window.localStorage.getItem('code-python') || ProgrammingLanguage.DEFAULT_CODE['python'],
      },
      modal: Modal.NONE,
      simulatorState: SimulatorState.STOPPED,
      editorConsole: StyledText.text({ text: LocalizedString.lookup(tr('Welcome to the KIPR IDE!\n'), props.locale), style: STDOUT_STYLE(DARK) }),
      theme: DARK,
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
      projectName: '',
      fileName: '',
      userName: '',
      addNewProject: this.props.addNewProject,
      addNewFile: this.props.addNewFile,
      clickFileState: this.props.clickFile,


    };

    this.editorRef = React.createRef();


  }

  componentDidMount() {
   

   
    window.addEventListener('resize', this.onWindowResize_);
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


  componentDidUpdate = async (prevProps: Props, prevState: State) => {


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
    else if (prevProps.addNewFile !== this.props.addNewFile) {

      if (this.props.addNewFile) {
        console.log("addNewFile in update Root.tsx is true");
        console.log("Root update with propProjectName:", this.props.propProjectName);
        console.log("Root update with otherFileType:", this.props.otherFileType);
        switch (this.props.otherFileType) {
          case 'h':
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
              activeLanguage: 'plaintext' // Change to 'plaintext'
            });
            break;
          // default:
          //   this.setState({
          //     activeLanguage: 'plaintext' // Fallback to 'plaintext' for unknown file types
          //   });
          //   break;
        }

        this.setState({
          isNewFileDialogVisible: true,
          modal: Modal.CREATEFILE,
        })




      }
    }
    else if (prevProps.clickFile !== this.props.clickFile) {
      if (this.props.clickFile) {
        console.log("clickFile in update Root.tsx is true");
        console.log("Proped props from HomeNavigation:", this.props.propUserName, this.props.propProjectName, this.props.propActiveLanguage, this.props.propFileName, this.props.otherFileType);
        await this.loadCodeBasedOnExtension();
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
          code: {
            ...this.state.code,
            [this.props.propActiveLanguage]: this.state.code[this.props.propActiveLanguage]
          }
        }, () => {
          console.log("new state code in clickFile:", this.state.code);
        });

        this.props.setClickFile(false);

      }
    }

  }

  private async loadCodeBasedOnExtension() {
    const { propFileName, propUserName, propProjectName, propActiveLanguage } = this.props;
    const [name, extension] = propFileName.split('.');
    console.log("loadCodeBasedOnExtension propActiveLanguage:", propActiveLanguage);

    let newCode = '';
    console.log("extension is:", extension);
    try {
      switch (extension) {
        case 'c':
        case 'cpp':
        case 'py':
          newCode = await DatabaseService.getContentFromSrcFile(this.props.propUserName, this.props.propProjectName, this.props.propFileName);
          break;
        case 'h':
          newCode = await DatabaseService.getContentfromIncludeFile(this.props.propUserName, this.props.propProjectName, this.props.propFileName);
          break;
        case 'txt':
          newCode = await DatabaseService.getContentFromUserDataFile(this.props.propUserName, this.props.propProjectName, this.props.propFileName);
          break;
        default:
          newCode = await DatabaseService.getContentFromUserDataFile(this.props.propUserName, this.props.propProjectName, this.props.propFileName);
          break;
      }
      console.log("loadCodeBasedOnExtension newCode:", newCode);
    }
    catch (error) {
      console.error('Error fetching code:', error);
    }

    if (propActiveLanguage === 'python' && extension === 'h') {
      this.setState({
        code: {
          ...this.state.code,
          ["c"]: newCode
        }
      }, () => {
        console.log("loadCodeBasedOnExtension with new state code:", this.state.code);
      });
    }
    else {
      this.setState({
        code: {
          ...this.state.code,
          [propActiveLanguage]: newCode
        }
      }, () => {
        console.log("loadCodeBasedOnExtension with new state code:", this.state.code);
      });
    }
  }


  componentWillUnmount() {
  
  }

  private onWindowResize_ = () => {
    this.setState({ windowInnerHeight: window.innerHeight });
  };

  private onStopped_ = () => {
    this.setState({
      simulatorState: SimulatorState.STOPPED
    });
  };

  private onActiveLanguageChange_ = (language: ProgrammingLanguage) => {
    this.setState({
      activeLanguage: language
    }, () => {
      this.props.onDocumentationSetLanguage(language === 'python' ? 'python' : 'c');
    });
  };

  private onCloseProjectDialog_ = (newProjName: string, newProjLanguage: ProgrammingLanguage) => {
    console.log("onCloseProjectDialog_ newProject and newLanguage:", newProjName, newProjLanguage);
    console.log("inside onCloseProjectDialog_ in Root.tsx with before state:", this.state);
    this.setState({

      modal: Modal.NONE,
      userName: this.props.propUserName,
      projectName: newProjName,
      activeLanguage: newProjLanguage,
      fileName: `main.${ProgrammingLanguage.FILE_EXTENSION[newProjLanguage]}`,
      // code: {
      //   ...this.state.code,
      //   [newProjLanguage]: ProgrammingLanguage.DEFAULT_CODE[newProjLanguage]
      // }
    }, () => {
      console.log("inside onCloseProjectDialog_ in Root.tsx with after state:", this.state);
      if (this.props.addNewProject) {
        this.setState({
          addNewProject: false
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
      }

      this.props.setAddNewProject(false);
      console.log("onCloseProjectDialog_ with new state fileName:", this.state.fileName);
    });


    //this.onEditorPageOpen_();
  }

  private onCloseNewFileDialog_ = async (newFileName: string, fileType: string) => {
    switch (fileType) {
      case 'h':
        this.setState({

          code: {
            ...this.state.code,
            [this.state.activeLanguage]: ProgrammingLanguage.DEFAULT_HEADER_CODE
          }
        }, () => {
          console.log("onCloseNewFileDialog_ with new state code:", this.state.code);
        });
        await DatabaseService.addIncludeContent(this.state.userName, this.state.projectName, `${newFileName}.${fileType}`, ProgrammingLanguage.DEFAULT_HEADER_CODE);
        break;
      case 'c':
      case 'cpp':
      case 'py':
        this.setState({
          code: {
            ...this.state.code,
            [this.state.activeLanguage]: ProgrammingLanguage.DEFAULT_CODE[this.state.activeLanguage]
          }
        });
        await DatabaseService.addSrcContent(this.state.userName, this.state.projectName, `${newFileName}.${fileType}`, ProgrammingLanguage.DEFAULT_CODE[this.state.activeLanguage]);
        break;
      case 'txt':
        this.setState({
          code: {
            ...this.state.code,
            [this.state.activeLanguage]: ProgrammingLanguage.DEFAULT_USER_DATA_CODE
          }
        });
        await DatabaseService.addUserDataContent(this.state.userName, this.state.projectName, `${newFileName}.txt`, ProgrammingLanguage.DEFAULT_USER_DATA_CODE);
        break;
    }

    this.setState({
      isCreateProjectDialogVisible: false,
      modal: Modal.NONE,
      fileName: `${newFileName}.${fileType}`,
      projectName: this.props.propProjectName,


    }, async () => {
      console.log("onCloseNewFileDialog_ with new state:", this.state);

      if (this.props.addNewFile) {
        this.setState({
          addNewFile: false
        });
      }

      this.props.setAddNewFile(false);
      console.log("onCloseNewFileDialog_ with new state code:", this.state.code);

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

  private onOpenUserProject_ = (name: string, projectName: string, fileName: string, projectLanguage: ProgrammingLanguage) => {
    console.log("onOpenUserProject_ name:", name);
    console.log("onOpenUserProject_ projectName:", projectName);
    console.log("onOpenUserProject_ fileName:", fileName);
    console.log("onOpenUserProject_ projectLanguage:", projectLanguage);


    this.setState({
      userName: name,
      projectName: projectName,
      activeLanguage: projectLanguage,
      fileName: fileName,
      isEditorPageVisible: true,
    });

    if (this.state.isHomeStartOptionsVisible == true) {
      this.setState({
        isHomeStartOptionsVisible: false
      });
    }
    // if (this.state.isNewFileDialogVisible == true) {
    //   this.setState({
    //     isNewFileDialogVisible: false,
    //     modal: Modal.NONE
    //   });
    // }

  }

  private onChangeProjectName = (name: string) => {

    this.setState({
      projectName: name
    });
  }
  private onCodeChange_ = (code: string) => {
    const { activeLanguage } = this.state;
    this.setState({
      code: {
        ...this.state.code,
        [activeLanguage]: code,
      }
    }, () => {
      //DatabaseService.updateSrcContent(this.state.userName, this.state.projectName, this.state.fileName, code);
      window.localStorage.setItem(`code-${activeLanguage}`, code);
    });
  };
  private onErrorMessageClick_ = (line: number) => () => {
    if (this.editorRef.current) this.editorRef.current.ivygate.revealLineInCenter(line);
  };

  private onRunClick_ = async () => {
    console.log("onRunClick_ in Root");
    const { props, state } = this;
    const { locale } = props;
    const { activeLanguage, code, editorConsole, theme, userName, projectName, fileName } = state;

    this.onSaveCode_();
    const activeCode = code[activeLanguage];
    console.log("onRunClick_ activeCode:", activeCode);
    const response = await axios.post('/run-code', { userName, projectName, fileName, activeLanguage }); // This calls the backend route

    const stringInput: string = response.data.output;
    console.log("stringInput:", stringInput);
    let parsedOutput: string = '';
    if (stringInput.includes("[core/wombat]")) {
      parsedOutput = stringInput.split('\n') // Split input into lines
        .filter(line => !line.startsWith('[core/wombat]')) // Filter out lines starting with "[core/wombat]"
        .join('\n'); // Join the lines back into a string
      console.log("parsedOutput:", parsedOutput);
    }
    else {
      parsedOutput = stringInput;
    }
    let nextConsole: StyledText = StyledText.extend(editorConsole, StyledText.text({
      text: LocalizedString.lookup(tr(parsedOutput), locale),
      style: STDOUT_STYLE(this.state.theme)
    }));

    this.setState({
      simulatorState: SimulatorState.COMPILING,
      editorConsole: nextConsole
    });
  };


  private onCompileClick_ = async () => {
    console.log("onCompileClick_ in Root");
    const { locale } = this.props;
    const { userName, projectName, fileName, activeLanguage, editorConsole, code } = this.state;
    try {
      await this.onSaveCode_();

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


  private onSaveCode_ = async () => {
    const [name, extension] = this.props.propFileName.split('.');


    console.log("extension is:", extension);

    const { userName, activeLanguage, projectName, fileName, otherFileType } = this.state;
    const newContent = this.state.code[activeLanguage];
    console.log("OnSaveCode clicked in Root with newContent:", newContent);
    console.log("onSaveCode otherFileType:", otherFileType);
    console.log("onSaveCode fileName:", this.state.fileName);

    switch (extension) {
      case 'h':
        DatabaseService.updateIncludeContent(userName, projectName, fileName, newContent);
        break;
      case 'c':
      case 'cpp':
      case 'py':
        await DatabaseService.updateSrcContent(userName, projectName, fileName, newContent);
        break;
      case 'txt':
        DatabaseService.updateUserDataContent(userName, projectName, fileName, newContent);
        break;
      default:
        DatabaseService.updateUserDataContent(userName, projectName, fileName, newContent);
        break;


    }


    this.setState({

      code: {
        ...this.state.code,
        [this.state.activeLanguage]: newContent
      }
    }, () => {
      console.log("onSaveCode_ with new state code:", this.state.code);
    });
  };


  private onModalClick_ = (modal: Modal) => () => this.setState({ modal });

  private onModalClose_ = () => {
    this.setState({ modal: Modal.NONE });

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
      this.setState({
        projectName: this.props.propProjectName,
        fileName: this.props.propFileName,
        activeLanguage: this.props.propActiveLanguage
      });
    }

  }



  private onClearConsole_ = () => {

    console.log("onClearConsole_ clicked in Root");
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
    } = state;

    const theme = DARK;

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

          <EditorPage
            isleftbaropen={isLeftBarOpen}
            editorTarget={undefined}
            editorConsole={editorConsole}
            messages={[]}
            code={code}
            language={activeLanguage}
            settings={DEFAULT_SETTINGS}
            onClearConsole={this.onClearConsole_}
            onCodeChange={this.onCodeChange_}
            onSaveCode={this.onSaveCode_}
            onRunClick={this.onRunClick_}
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