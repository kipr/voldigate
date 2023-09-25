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
  onNodeAdd: (id: string, node: Node) => void;
  onNodeRemove: (id: string) => void;
  onNodeChange: (id: string, node: Node) => void;

  onNodesChange: (nodes: Dict<Node>) => void;

  onGeometryRemove: (id: string) => void;

  onGravityChange: (gravity: Vector3) => void;
  onSelectNodeId: (id: string) => void;
  onSetNodeBatch: (setNodeBatch: Omit<ScenesAction.SetNodeBatch, 'type' | 'sceneId'>) => void;
  onResetScene: () => void;

  onDocumentationClick: () => void;
  onDocumentationPush: (location: DocumentationLocation) => void;
  onDocumentationSetLanguage: (language: 'c' | 'python') => void;
  onDocumentationGoToFuzzy: (query: string, language: 'c' | 'python') => void;


  onSaveScene: (id: string) => void;
  onDeleteRecord: (selector: Selector) => void;

  unfailScene: (id: string) => void;

  goToLogin: () => void;

  selectedScriptId?: string;

  onScriptRemove: (scriptId: string) => void;
}

interface RootState {
  layout: Layout;

  activeLanguage: ProgrammingLanguage;

  // A map of language to code.
  code: Dict<string>;

  simulatorState: SimulatorState;

  modal: Modal;

  console: StyledText;
  messages: Message[];

  theme: Theme;

  settings: Settings;

  feedback: Feedback;

  windowInnerHeight: number;


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
      console: StyledText.text({ text: LocalizedString.lookup(tr('Welcome to the KIPR Simulator!\n'), props.locale), style: STDOUT_STYLE(DARK) }),
      theme: DARK,
      messages: [],
      settings: DEFAULT_SETTINGS,
      feedback: DEFAULT_FEEDBACK,
      windowInnerHeight: window.innerHeight,

    };

    this.editorRef = React.createRef();
    this.overlayLayoutRef = React.createRef();

  }

  componentDidMount() {
    WorkerInstance.onStopped = this.onStopped_;

    const space = Space.getInstance();
    space.onSetNodeBatch = this.props.onSetNodeBatch;
    space.onSelectNodeId = this.props.onSelectNodeId;
    space.onNodeAdd = this.props.onNodeAdd;
    space.onNodeRemove = this.props.onNodeRemove;
    space.onNodeChange = this.props.onNodeChange;

    space.onGeometryRemove = this.props.onGeometryRemove;
    space.onGravityChange = this.props.onGravityChange;


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
        console: StyledText.extend(this.state.console, StyledText.text({
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
    const { activeLanguage, code, console, theme } = state;

    const activeCode = code[activeLanguage];

    switch (activeLanguage) {
      case 'c':
      case 'cpp': {
        let nextConsole: StyledText = StyledText.extend(console, StyledText.text({
          text: LocalizedString.lookup(tr('Compiling...\n'), locale),
          style: STDOUT_STYLE(this.state.theme)
        }));

        this.setState({
          simulatorState: SimulatorState.COMPILING,
          console: nextConsole
        }, () => {
          compile(activeCode, activeLanguage)
            .then(compileResult => {
              nextConsole = this.state.console;
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
                console: nextConsole
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
                console: nextConsole
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

  private onDownloadClick_ = () => {
    const { activeLanguage } = this.state;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(this.state.code[activeLanguage])}`);
    element.setAttribute('download', `program.${ProgrammingLanguage.FILE_EXTENSION[activeLanguage]}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  private onResetWorldClick_ = () => {
    this.props.onResetScene();
  };

  private onStartChallengeClick_ = () => {
    window.location.href = `/challenge/${this.props.match.params.sceneId}`;
  };

  private onClearConsole_ = () => {
    this.setState({
      console: StyledText.compose({ items: [] })
    });
  };

  private onGetUser_ = () => {
    console.log("Hello");
  };

  private onIndentCode_ = () => {
    if (this.editorRef.current) this.editorRef.current.ivygate.formatCode();
  };

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

  onLogoutClick = () => {
    void signOutOfApp().then(() => {
      this.props.goToLogin();
    });
  };

  onDashboardClick = () => {
    window.location.href = '/';
  };

  onCreateUser = () => {
    let wn = `${window.location.pathname}`;
    let windowName = wn.split("/", 3);
    let newUser = new User(this.state, windowName[2], []);
    console.log(newUser);
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

  private onOpenSceneClick_ = () => {
    this.setState({
      modal: Modal.SELECT_SCENE
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


  private onDeleteRecordAccept_ = (selector: Selector) => () => {
    this.props.onDeleteRecord(selector);
  };

  private onErrorClick_ = (event: React.MouseEvent<HTMLDivElement>) => {
    // not implemented
  };

  private onSceneErrorResolved_ = () => {
    this.props.unfailScene(this.props.match.params.sceneId);
  };

  private onSaveSceneClick_ = () => {
    this.props.onSaveScene(this.props.match.params.sceneId);
  };
  private onPageClick = () => {
    console.log("Clicked page 3");
  };

  render() {
    const { props, state } = this;

    const {
      match: { params: { sceneId, challengeId } },
      scene,
      challenge,
      challengeCompletion,
      selectedScriptId,
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
      console,
      messages,
      settings,
      feedback,
      windowInnerHeight,

    } = state;

    const theme = DARK;

    const editorTarget: LayoutEditorTarget = {
      type: LayoutEditorTarget.Type.Robot,
      code: code[activeLanguage],
      language: activeLanguage,
      onCodeChange: this.onCodeChange_,
      onLanguageChange: this.onActiveLanguageChange_,
    };

    const commonLayoutProps: LayoutProps = {
      theme,
      console,
      messages,
      settings,
      editorTarget,
      onClearConsole: this.onClearConsole_,
      onIndentCode: this.onIndentCode_,
      onDownloadCode: this.onDownloadClick_,
      onGetUser: this.onGetUser_,
      onCreateUser: this.onCreateUser,
      onResetCode: this.onResetCode_,
      editorRef: this.editorRef,
      scene,

      onNodeRemove: this.props.onNodeRemove,

      onGeometryRemove: this.props.onGeometryRemove,

      onScriptRemove: this.props.onScriptRemove,

      challengeState: challenge ? {
        challenge,
        challengeCompletion: challengeCompletion || Async.unloaded({ brief: {} }),
      } : undefined,
      onDocumentationGoToFuzzy,

      onNodeAdd: function (nodeId: string, node: Node): void {
        throw new Error('Function not implemented.');
      },
      onNodeChange: function (nodeId: string, node: Node): void {
        throw new Error('Function not implemented.');
      },
      onObjectAdd: function (nodeId: string, object: Node.Obj, geometry: Geometry): void {
        throw new Error('Function not implemented.');
      },
      onGeometryAdd: function (geometryId: string, geometry: Geometry): void {
        throw new Error('Function not implemented.');
      },
      onGeometryChange: function (geometryId: string, geometry: Geometry): void {
        throw new Error('Function not implemented.');
      },
      onScriptAdd: function (scriptId: string, script: Script): void {
        throw new Error('Function not implemented.');
      },
    };




    let impl: JSX.Element;
    switch (layout) {
      case Layout.Overlay: {
        impl = (
          <OverlayLayoutRedux robots={{}} ref={this.overlayLayoutRef} {...commonLayoutProps} />
        );
        break;
      }
      case Layout.Side: {
        impl = (
          <FileExplorerSideLayoutRedux {...commonLayoutProps} />
        );
        break;
      }
      default: {
        return null;
      }
    }



    return (
      <RootContainer $windowInnerHeight={windowInnerHeight}>


        <SimMenu
          layout={Layout.Side}
          onLayoutChange={this.onLayoutChange_}
          theme={theme}
          onShowAll={this.onShowAll_}
          onHideAll={this.onHideAll_}
          onSettingsClick={this.onModalClick_(Modal.SETTINGS)}
          onAboutClick={this.onModalClick_(Modal.ABOUT)}
          onResetWorldClick={this.onResetWorldClick_}
          onStartChallengeClick={this.onStartChallengeClick_}
          onRunClick={this.onRunClick_}
          onStopClick={this.onStopClick_}
          onDocumentationClick={onDocumentationClick}
          onDashboardClick={this.onDashboardClick}
          onLogoutClick={this.onLogoutClick}
          onFeedbackClick={this.onModalClick_(Modal.FEEDBACK)}
          onOpenSceneClick={this.onOpenSceneClick_}
          simulatorState={simulatorState}
          onNewSceneClick={!challenge && this.onModalClick_(Modal.NEW_SCENE)}

        />

        <Container $windowInnerHeight={windowInnerHeight}>
          <SidePanelContainer>
            {impl}
          </SidePanelContainer>



        </Container>


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
        {modal.type === Modal.Type.OpenScene && (
          <OpenSceneDialog
            theme={theme}
            onClose={this.onModalClose_}
          />
        )}


        {modal.type === Modal.Type.DeleteRecord && modal.record.type === Record.Type.Scene && (
          <DeleteDialog
            name={Record.latestName(modal.record)}
            theme={theme}
            onClose={this.onModalClose_}
            onAccept={this.onDeleteRecordAccept_(Record.selector(modal.record))}
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

      </RootContainer>

    );
  }
}

export default connect((state: ReduxState, { match: { params: { sceneId, challengeId } } }: RootPublicProps) => {
  const builder = new Builder(state);

  if (challengeId) {
    const challenge = builder.challenge(challengeId);

    challenge.completion();
  } else {

  }

  builder.dispatchLoads();

  return {

    challenge: Dict.unique(builder.challenges),
    challengeCompletion: Dict.unique(builder.challengeCompletions),
    locale: state.i18n.locale,
  };
}, (dispatch, { match: { params: { sceneId } } }: RootPublicProps) => ({

}))(Root) as React.ComponentType<RootPublicProps>;

export { RootState };