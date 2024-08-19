import * as React from 'react';
import { signOutOfApp } from '../firebase/modules/auth';
import WorkerInstance from '../WorkerInstance';

import { State as ReduxState } from '../state';


import SimMenu from './SimMenu';

import { styled } from 'styletron-react';
import { DARK, Theme, ThemeProps } from './theme';
import { Layout, LayoutProps, OverlayLayout, OverlayLayoutRedux, SideLayoutRedux } from './Layout';

import SettingsDialog from './SettingsDialog';
import AboutDialog from './AboutDialog';

import FeedbackDialog from './Feedback';
import { sendFeedback, FeedbackResponse } from './Feedback/SendFeedback';
import FeedbackSuccessDialog from './Feedback/SuccessModal';

import compile from '../compile';
import { SimulatorState } from './SimulatorState';
import { Angle, Distance, StyledText } from '../util';
import { Message } from 'ivygate';
import parseMessages, { hasErrors, hasWarnings, sort, toStyledText } from '../util/parse-messages';

import { Space } from '../Sim';

import { DEFAULT_SETTINGS, Settings } from '../Settings';
import { DEFAULT_FEEDBACK, Feedback } from '../Feedback';
import ExceptionDialog from './ExceptionDialog';
import OpenSceneDialog from './OpenSceneDialog';

import { ChallengesAction, DocumentationAction, ScenesAction, ChallengeCompletionsAction } from '../state/reducer';
import { createEditorBarComponents, Editor, EditorBarTarget } from './Editor';
import Dict from '../Dict';
import ProgrammingLanguage from '../ProgrammingLanguage';


import Scene, { AsyncScene } from '../state/State/Scene';
import { RouteComponentProps } from 'react-router';

import { connect } from 'react-redux';
import Async from '../state/State/Async';
import construct from '../util/construct';

import DeleteDialog from './DeleteDialog';
import Record from '../db/Record';
import Selector from '../db/Selector';


import LocalizedString from '../util/LocalizedString';


import { Vector3 } from '../unit-math';
import { LayoutEditorTarget } from './Layout/Layout';
import { AsyncChallenge } from '../state/State/Challenge';
import Builder from '../db/Builder';
import ChallengeCompletion, { AsyncChallengeCompletion } from '../state/State/ChallengeCompletion';

import DocumentationLocation from '../state/State/Documentation/DocumentationLocation';

import tr from '@i18n';
import Geometry from 'state/State/Scene/Geometry';
import Node from 'state/State/Scene/Node';
import Script from 'state/State/Scene/Script';
import Widget, { Mode } from './Widget';
import { Console, createConsoleBarComponents } from './Console';
import { FileExplorerSideLayoutRedux } from './FileExplorer';
import User from './User';
import fs from 'fs';
import { HomeStartOptions } from './HomeStartOptions';
import NewFileDialog from './NewFileDialog';
import EditorPage from './EditorPage';
import CreateProjectDialog from './CreateProjectDialog';
import CreateUserDialog from './CreateUserDialog';


namespace Modal {
  export enum Type {
    Settings,
    About,
    Exception,
    OpenScene,
    Feedback,
    FeedbackSuccess,
    None,
    NewScene,
    CopyScene,
    SettingsScene,
    DeleteRecord,
    ResetCode
  }

  export interface Settings {
    type: Type.Settings;
  }

  export const SETTINGS: Settings = { type: Type.Settings };

  export interface About {
    type: Type.About;
  }

  export const ABOUT: About = { type: Type.About };

  export interface Feedback {
    type: Type.Feedback;
  }

  export const FEEDBACK: Feedback = { type: Type.Feedback };

  export interface FeedbackSuccess {
    type: Type.FeedbackSuccess;
  }

  export const FEEDBACKSUCCESS: FeedbackSuccess = { type: Type.FeedbackSuccess };

  export interface Exception {
    type: Type.Exception;
    error: Error;
    info?: React.ErrorInfo;
  }

  export const exception = (error: Error, info?: React.ErrorInfo): Exception => ({ type: Type.Exception, error, info });

  export interface SelectScene {
    type: Type.OpenScene;
  }

  export const SELECT_SCENE: SelectScene = { type: Type.OpenScene };

  export interface None {
    type: Type.None;
  }

  export const NONE: None = { type: Type.None };

  export interface NewScene {
    type: Type.NewScene;
  }

  export const NEW_SCENE: NewScene = { type: Type.NewScene };

  export interface CopyScene {
    type: Type.CopyScene;
    scene: Scene;
  }

  export const copyScene = construct<CopyScene>(Type.CopyScene);
  export interface DeleteRecord {
    type: Type.DeleteRecord;
    record: Record;
  }

  export const deleteRecord = construct<DeleteRecord>(Type.DeleteRecord);

  export interface SettingsScene {
    type: Type.SettingsScene;
  }

  export const SETTINGS_SCENE: SettingsScene = { type: Type.SettingsScene };

  export interface ResetCode {
    type: Type.ResetCode;
  }

  export const RESET_CODE: ResetCode = { type: Type.ResetCode };
}

export type Modal = (
  Modal.Settings |
  Modal.About |
  Modal.Exception |
  Modal.SelectScene |
  Modal.Feedback |
  Modal.FeedbackSuccess |
  Modal.None |
  Modal.NewScene |

  Modal.DeleteRecord |
  Modal.SettingsScene |
  Modal.ResetCode
);

interface RootParams {
  sceneId?: string;
  challengeId?: string;
}

export interface RootPublicProps extends RouteComponentProps<RootParams> {

}



interface RootPrivateProps {
  scene: AsyncScene;
  challenge?: AsyncChallenge;
  challengeCompletion?: AsyncChallengeCompletion;
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
  projectName: string;
  fileName: string;

  userName: string;

}

type Props = RootPublicProps & RootPrivateProps;
type State = RootState;

// We can't set innerheight statically, becasue the window can change
// but we also must use innerheight to fix mobile issues
interface ContainerProps {
  $windowInnerHeight: number
}
const FlexConsole = styled(Console, {
  flex: 'auto',
});

const Container = styled('div', (props: ContainerProps) => ({
  width: '100vw',
  height: `${props.$windowInnerHeight}px`, // fix for mobile, see https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html
  display: 'flex',
  flexDirection: 'row',
  overflow: 'hidden',
  position: 'fixed',
  marginTop: '45px',
  flex: 'auto',
  justifyContent: 'flex-end',


}));
interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const TestBoxContainer = styled('div', (props: ContainerProps) => ({
  width: '800px',
  height: `100px`, // fix for mobile, see https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html
  display: 'flex',
  flexDirection: 'row',
  marginTop: '45px',
  justifyContent: 'flex-start',
  backgroundColor: 'green'

}));

const TestBoxContainerItem = styled('div', (props: ThemeProps & ClickProps) => ({
  width: '150px',
  height: `20px`, // fix for mobile, see https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html
  display: 'flex',
  flexDirection: 'row',
  poisition: 'relative',
  overflow: 'hidden',
  marginTop: '45px',
  flex: 'auto',
  backgroundColor: 'blue',
  color: 'white',
  borderColor: 'black',
  borderStyle: 'solid',
  borderWidth: '4px',
  alignItems: 'start',

}));

const EditorConsoleContainer = styled('div', (props: ContainerProps) => ({

  height: `${props.$windowInnerHeight}px`, // fix for mobile, see https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'fixed',
  flex: 'auto'

}));

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
const SidePanelContainer = styled('div', {
  display: 'flex',
  flex: 'auto',
  position: 'relative',
  width: '100vw'

});

const SimulatorWidget = styled(Widget, {
  display: 'flex',
  flex: 'auto',
  height: '100%',
  width: '100%',
});
const SimultorWidgetContainer = styled('div', {
  display: 'flex',
  flex: 'auto',
  height: '100%',

  overflow: 'hidden',


});
const StartOptionContainer = styled('div', (props: ThemeProps) => ({
  position: 'absolute',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'start',
  top: '36%',
  marginLeft: '20%',
  backgroundColor: 'green',
  width: '50%',
  height: '40%',
}));
class Root extends React.Component<Props, State> {
  private editorRef: React.MutableRefObject<Editor>;
  private overlayLayoutRef: React.MutableRefObject<OverlayLayout>;


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
      editorConsole: StyledText.text({ text: LocalizedString.lookup(tr('Welcome to the KIPR Simulator!\n'), props.locale), style: STDOUT_STYLE(DARK) }),
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
      projectName: '',
      fileName: 'main.cpp',
      userName: ''

    };

    this.editorRef = React.createRef();
    this.overlayLayoutRef = React.createRef();

  }

  componentDidMount() {
    WorkerInstance.onStopped = this.onStopped_;



    this.scheduleUpdateConsole_();
    window.addEventListener('resize', this.onWindowResize_);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize_);
    cancelAnimationFrame(this.updateConsoleHandle_);

    Space.getInstance().onSelectNodeId = undefined;
    Space.getInstance().onSetNodeBatch = undefined;
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

  private onCloseProjectDialog_ = () => {
    this.setState({
      isCreateProjectDialogVisible: false

    });
    this.onEditorPageOpen_();
  }
  private onCreateProjectDialogOpen_ = (name: string) => {

    this.setState({
      userName: name,
      isCreateNewUserDialogVisible: false,
      isCreateProjectDialogVisible: true,
    });

    console.log("userName: ", this.state.userName);
  }
  private onEditorPageOpen_ = () => {
    this.setState({
      isHomeStartOptionsVisible: false,
      isNewFileDialogVisible: false,
      isEditorPageVisible: true
    });
  };

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
      window.localStorage.setItem(`code-${activeLanguage}`, code);
    });
  };

  private onShowAll_ = () => {
    if (this.overlayLayoutRef.current) this.overlayLayoutRef.current.showAll();
  };

  private onHideAll_ = () => {
    if (this.overlayLayoutRef.current) this.overlayLayoutRef.current.hideAll();
  };

  private onLayoutChange_ = (layout: Layout) => {
    this.setState({
      layout
    });
  };

  private onModalClick_ = (modal: Modal) => () => this.setState({ modal });

  private onModalClose_ = () => this.setState({ modal: Modal.NONE });

  private updateConsole_ = () => {
    const text = WorkerInstance.sharedConsole.popString();
    if (text.length > 0) {
      this.setState({
        editorConsole: StyledText.extend(this.state.editorConsole, StyledText.text({
          text,
          style: STDOUT_STYLE(this.state.theme)
        }), 300)
      });
    }


    this.scheduleUpdateConsole_();
  };

  private updateConsoleHandle_: number | undefined = undefined;
  private scheduleUpdateConsole_ = () => this.updateConsoleHandle_ = requestAnimationFrame(this.updateConsole_);

  private onErrorMessageClick_ = (line: number) => () => {
    if (this.editorRef.current) this.editorRef.current.ivygate.revealLineInCenter(line);
  };

  private onRunClick_ = () => {
    const { props, state } = this;
    const { locale } = props;
    const { activeLanguage, code, editorConsole, theme } = state;

    const activeCode = code[activeLanguage];

    switch (activeLanguage) {
      case 'c':
      case 'cpp': {
        let nextConsole: StyledText = StyledText.extend(editorConsole, StyledText.text({
          text: LocalizedString.lookup(tr('Compiling...\n'), locale),
          style: STDOUT_STYLE(this.state.theme)
        }));

        this.setState({
          simulatorState: SimulatorState.COMPILING,
          editorConsole: nextConsole
        }, () => {
          compile(activeCode, activeLanguage)
            .then(compileResult => {
              nextConsole = this.state.editorConsole;
              const messages = sort(parseMessages(compileResult.stderr));
              const compileSucceeded = compileResult.result && compileResult.result.length > 0;

              // Show all errors/warnings in console
              for (const message of messages) {
                nextConsole = StyledText.extend(nextConsole, toStyledText(message, {
                  onClick: message.ranges.length > 0
                    ? this.onErrorMessageClick_(message.ranges[0].start.line)
                    : undefined
                }));
              }

              if (compileSucceeded) {
                // Show success in console and start running the program
                const haveWarnings = hasWarnings(messages);
                nextConsole = StyledText.extend(nextConsole, StyledText.text({
                  text: haveWarnings
                    ? LocalizedString.lookup(tr('Compilation succeeded with warnings.\n'), locale)
                    : LocalizedString.lookup(tr('Compilation succeeded.\n'), locale),
                  style: STDOUT_STYLE(this.state.theme)
                }));

                WorkerInstance.start({
                  language: activeLanguage,
                  code: compileResult.result
                });
              } else {
                if (!hasErrors(messages)) {
                  // Compile failed and there are no error messages; some weird underlying error occurred
                  // We print the entire stderr to the console
                  nextConsole = StyledText.extend(nextConsole, StyledText.text({
                    text: `${compileResult.stderr}\n`,
                    style: STDERR_STYLE(this.state.theme)
                  }));
                }

                nextConsole = StyledText.extend(nextConsole, StyledText.text({
                  text: LocalizedString.lookup(tr('Compilation failed.\n'), locale),
                  style: STDERR_STYLE(this.state.theme)
                }));
              }

              this.setState({
                simulatorState: compileSucceeded ? SimulatorState.RUNNING : SimulatorState.STOPPED,
                messages,
                editorConsole: nextConsole
              });
            })
            .catch((e: unknown) => {
              window.console.error(e);
              nextConsole = StyledText.extend(nextConsole, StyledText.text({
                text: LocalizedString.lookup(tr('Something went wrong during compilation.\n'), locale),
                style: STDERR_STYLE(this.state.theme)
              }));

              this.setState({
                simulatorState: SimulatorState.STOPPED,
                messages: [],
                editorConsole: nextConsole
              });
            });
        });
        break;
      }
      case 'python': {
        this.setState({
          simulatorState: SimulatorState.RUNNING,
        }, () => {
          WorkerInstance.start({
            language: 'python',
            code: activeCode
          });
        });
        break;
      }
    }


  };

  private onStopClick_ = () => {
    WorkerInstance.stop();
  };

  // private onDownloadClick_ = () => {
  //   const { activeLanguage } = this.state;

  //   const element = document.createElement('a');
  //   element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(this.state.code[activeLanguage])}`);
  //   element.setAttribute('download', `program.${ProgrammingLanguage.FILE_EXTENSION[activeLanguage]}`);
  //   element.style.display = 'none';
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // };


  private onClearConsole_ = () => {
    this.setState({
      editorConsole: StyledText.compose({ items: [] })
    });
  };


  // private onIndentCode_ = () => {
  //   if (this.editorRef.current) this.editorRef.current.ivygate.formatCode();
  // };

  private onResetCode_ = () => {
    this.setState({
      modal: Modal.RESET_CODE
    });
  };

  private onResetCodeAccept_ = () => {
    const { activeLanguage } = this.state;
    this.setState({
      code: {
        ...this.state.code,
        [activeLanguage]: ProgrammingLanguage.DEFAULT_CODE[activeLanguage]
      },
      modal: Modal.NONE,
    });
  };

  onDocumentationClick = () => {
    window.open("https://www.kipr.org/doc/index.html");
  };


  onDashboardClick = () => {
    window.location.href = '/';
  };



  private onSettingsChange_ = (changedSettings: Partial<Settings>) => {
    const nextSettings: Settings = {
      ...this.state.settings,
      ...changedSettings
    };

    if ('simulationRealisticSensors' in changedSettings) {
      Space.getInstance().realisticSensors = changedSettings.simulationRealisticSensors;
    }

    if ('simulationSensorNoise' in changedSettings) {
      Space.getInstance().noisySensors = changedSettings.simulationSensorNoise;
    }

    this.setState({ settings: nextSettings });
  };

  private onFeedbackChange_ = (changedFeedback: Partial<Feedback>) => {
    this.setState({ feedback: { ...this.state.feedback, ...changedFeedback } });
  };

  private onFeedbackSubmit_ = () => {
    sendFeedback(this.state)
      .then((resp: FeedbackResponse) => {
        this.onFeedbackChange_(({ message: resp.message }));
        this.onFeedbackChange_(({ error: resp.networkError }));

        this.onFeedbackChange_(DEFAULT_FEEDBACK);

        this.onModalClick_(Modal.FEEDBACKSUCCESS)();
      })
      .catch((resp: FeedbackResponse) => {
        this.onFeedbackChange_(({ message: resp.message }));
        this.onFeedbackChange_(({ error: resp.networkError }));
      });
  };



  private onSettingsSceneClick_ = () => {
    this.setState({
      modal: Modal.SETTINGS_SCENE
    });
  };

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({
      modal: Modal.exception(error, info)
    });
  }



  private onErrorClick_ = (event: React.MouseEvent<HTMLDivElement>) => {
    // not implemented
  };




  render() {
    const { props, state } = this;

    const {

      scene,
      onClearConsole,
      onIndentCode,
      onDownloadCode,
      onResetCode,
      onDocumentationClick,
      onDocumentationGoToFuzzy,
      editorRef,
      locale
    } = props;


    const {
      layout,
      activeLanguage,
      code,
      modal,
      simulatorState,
      editorConsole,
      messages,
      settings,
      feedback,
      windowInnerHeight,
      isHomeStartOptionsVisible,
      isNewFileDialogVisible,
      projectName,
      fileName,
      isEditorPageVisible,
      isCreateNewUserDialogVisible,
      isCreateProjectDialogVisible

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
        {modal.type === Modal.Type.Feedback && (
          <FeedbackDialog
            theme={theme}
            feedback={feedback}
            onFeedbackChange={this.onFeedbackChange_}
            onClose={this.onModalClose_}
            onSubmit={this.onFeedbackSubmit_}
          />
        )}
        {modal.type === Modal.Type.FeedbackSuccess && (
          <FeedbackSuccessDialog
            theme={theme}
            onClose={this.onModalClose_}
          />
        )}
        {modal.type === Modal.Type.Exception && (
          <ExceptionDialog
            error={modal.error}
            theme={theme}
            onClose={this.onModalClose_}
          />
        )}

        {
          modal.type === Modal.Type.ResetCode && (
            <DeleteDialog
              name={tr('your current work')}
              theme={theme}
              onAccept={this.onResetCodeAccept_}
              onClose={this.onModalClose_}
            />

          )
        }
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
            />
          )
        }
        {isNewFileDialogVisible && (
          <NewFileDialog
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }} showRepeatUserDialog={false} fileName={this.state.projectName} editorTarget={undefined} messages={[]} onIndentCode={function (): void {
              throw new Error('Function not implemented.');
            }} onDownloadCode={function (): void {
              throw new Error('Function not implemented.');
            }} onResetCode={function (): void {
              throw new Error('Function not implemented.');
            }} onClearConsole={function (): void {
              throw new Error('Function not implemented.');
            }} language={'c'} editorConsole={undefined}
            theme={undefined} onEditorPageOpen={this.onEditorPageOpen_}
            onChangeProjectName={this.onChangeProjectName}
          >


          </NewFileDialog>
        )
        }
        {isEditorPageVisible && (

          <EditorPage
            editorTarget={undefined}
            editorConsole={undefined}
            messages={[]}
            language={activeLanguage}
            settings={DEFAULT_SETTINGS}
            onClearConsole={props.onClearConsole}
            onIndentCode={() => { }}
            onDownloadCode={() => { }}
            onResetCode={() => { }}
            editorRef={undefined}
            theme={theme}
            onDocumentationSetLanguage={() => { }}
            projectName={this.state.projectName}
            fileName={this.state.fileName}
            userName={this.state.userName}


          />

        )}
        {isCreateProjectDialogVisible && (

          <CreateProjectDialog onClose={this.onModalClose_}
            showRepeatUserDialog={false} projectName={this.state.projectName} theme={theme}
            closeProjectDialog={this.onCloseProjectDialog_}
            onChangeProjectName={this.onChangeProjectName}
            userName={this.state.userName}>
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