import * as React from 'react';
import { connect } from 'react-redux';

import { styled } from 'styletron-react';



import { Console, createConsoleBarComponents } from './Console';
import { Editor, createEditorBarComponents, EditorBarTarget } from './Editor';
import World, { createWorldBarComponents } from './World';

import { Info } from './Info';
import { LayoutEditorTarget, LayoutProps } from './Layout/Layout';
import SimulatorArea from './SimulatorArea';
import { TabBar } from './TabBar';
import Widget, { BarComponent, Mode, Size } from './Widget';
import { Slider } from './Slider';

import { State as ReduxState } from '../state';
import Node from '../state/State/Scene/Node';
import Dict from '../Dict';
import Scene from '../state/State/Scene';
import { faCode, faFlagCheckered, faGlobeAmericas, faRobot } from '@fortawesome/free-solid-svg-icons';
import Async from '../state/State/Async';
import { EMPTY_OBJECT, StyledText } from '../util';
import Challenge from './Challenge';
import { ReferenceFrame } from '../unit-math';

import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import ProgrammingLanguage from '../ProgrammingLanguage';
import { DARK, Theme } from './theme';
import construct from 'util/construct';


const sizeDict = (sizes: Size[]) => {
  const forward: { [type: number]: number } = {};

  for (let i = 0; i < sizes.length; ++i) {
    const size = sizes[i];
    forward[size.type] = i;
  }

  return forward;
};
const SIDEBAR_SIZES: Size[] = [Size.MINIMIZED, Size.PARTIAL_RIGHT, Size.MAXIMIZED];
const SIDEBAR_SIZE = sizeDict(SIDEBAR_SIZES);

export interface EditorPageProps extends LayoutProps {
  language: ProgrammingLanguage;
  projectName: string;
  fileName: string;
  userName: string;
  onDocumentationSetLanguage: (language: 'c' | 'python') => void;
}

interface ReduxEditorPageProps {
  locale: LocalizedString.Language;
}

interface EditorPageState {
  activePanel: number;
  sidePanelSize: Size.Type;
  language: ProgrammingLanguage;
  code: Dict<string>;
  workingScriptCode?: string;
  editorConsole: StyledText;
  modal: Modal;

}

type Props = EditorPageProps;
type State = EditorPageState;


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

  export interface None {
    type: Type.None;
  }

  export const NONE: None = { type: Type.None };

  export const exception = (error: Error, info?: React.ErrorInfo): Exception => ({ type: Type.Exception, error, info });


  export interface ResetCode {
    type: Type.ResetCode;
  }

  export const RESET_CODE: ResetCode = { type: Type.ResetCode };
}

export type Modal = (
  Modal.Settings |
  Modal.About |
  Modal.Exception |
  Modal.None |
  Modal.Feedback |
  Modal.FeedbackSuccess |

  Modal.ResetCode
);

const Container = styled('div', {
  display: 'flex',
  flex: '1 1',
  position: 'relative'
});

const SidePanelContainer = styled('div', {
  display: 'flex',
  flex: '1 1',
  flexDirection: 'row',
});

const SideBar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  flex: '1 1 auto',
  width: '100%',
});

const SimulatorAreaContainer = styled('div', {
  display: 'flex',
  flex: '1 1',
});
const SimultorWidgetContainer = styled('div', {
  display: 'flex',
  flex: '1 0 0',
  height: '100%',
  width: '100%',
  overflow: 'hidden'

});
const SimulatorWidget = styled(Widget, {
  display: 'flex',
  flex: '1 1 0',
  height: '100%',
  width: '100%',
});


const FlexConsole = styled(Console, {
  flex: '1 1',
});

const SideBarMinimizedTab = -1;
const STDOUT_STYLE = (theme: Theme) => ({
  color: theme.color
});
export class EditorPage extends React.PureComponent<Props & ReduxEditorPageProps, State> {
  private editorRef: React.MutableRefObject<Editor>;
  constructor(props: Props & ReduxEditorPageProps) {
    super(props);

    this.state = {
      sidePanelSize: Size.Type.Miniature,
      activePanel: 0,
      modal: Modal.NONE,
      language: props.language,
      code: {
        'c': window.localStorage.getItem('code-c') || ProgrammingLanguage.DEFAULT_CODE['c'],
        'cpp': window.localStorage.getItem('code-cpp') || ProgrammingLanguage.DEFAULT_CODE['cpp'],
        'python': window.localStorage.getItem('code-python') || ProgrammingLanguage.DEFAULT_CODE['python'],
      },
      editorConsole: StyledText.text({ text: LocalizedString.lookup(tr('Welcome to the KIPR Simulator!\n'), props.locale), style: STDOUT_STYLE(DARK) }),
  
    };

    // TODO: this isn't working yet. Needs more tinkering
    // on an orientation change, trigger a rerender
    // this is deprecated, but supported in safari iOS
    // screen.orientation.onchange = () => {
    //   console.log('orientation change')
    //   this.render();
    // };
    // // this is not deprecated, but not supported in safari iOS
    // window.addEventListener('orientationchange', () => { console.log('deprecated orientation change'); this.render(); });
  }
  private onSideBarSizeChange_ = (index: number) => {
    if (SIDEBAR_SIZES[index].type === Size.Type.Minimized) {
      // unset active tab if minimizing
      this.setState({ activePanel: SideBarMinimizedTab });
    }
    this.setState({
      sidePanelSize: SIDEBAR_SIZES[index].type,
    });
  };
  private onTabBarIndexChange_ = (index: number) => {
    if (index === this.state.activePanel) {
      // collapse instead
      this.onSideBarSizeChange_(SIDEBAR_SIZE[Size.Type.Minimized]);
    } else {
      this.setState({ activePanel: index });
    }
  };
  private onTabBarExpand_ = (index: number) => {
    this.onSideBarSizeChange_(Size.Type.Miniature);
    this.setState({ activePanel: index });
  };

  private onErrorClick_ = (event: React.MouseEvent<HTMLDivElement>) => {
    // not implemented
  };
  private onActiveLanguageChange_ = (language: ProgrammingLanguage) => {
    this.setState({
      language: language
    }, () => {
      this.props.onDocumentationSetLanguage(language === 'python' ? 'python' : 'c');
    });
  };
  private onIndentCode_ = () => {
    if (this.editorRef.current) this.editorRef.current.ivygate.formatCode();
  };
  private onDownloadClick_ = () => {
    const { language } = this.state;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(this.state.code[language])}`);
    element.setAttribute('download', `program.${ProgrammingLanguage.FILE_EXTENSION[language]}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  private onResetCodeAccept_ = () => {
    const { language } = this.state;
    this.setState({
      code: {
        ...this.state.code,
        [language]: ProgrammingLanguage.DEFAULT_CODE[language]
      },
      modal: Modal.NONE,
    });
  };
  private onCodeChange_ = (code: string) => {
    const { language } = this.state;
    this.setState({
      code: {
        ...this.state.code,
        [language]: code,
      }
    }, () => {
      window.localStorage.setItem(`code-${language}`, code);
    });
  };


  render() {
    const { props } = this;
    const {
      style,
      className,
      theme,
      editorTarget,

      messages,
      settings,
      onClearConsole,
      onIndentCode,
      onDownloadCode,
      onResetCode,
      editorRef,
      onDocumentationGoToFuzzy,
      locale,
      language,
      projectName,
      fileName,
      userName
    } = props;

    const {
      activePanel,
      sidePanelSize,
      code,

      editorConsole,
    } = this.state;

    let editorBarTarget: EditorBarTarget;
    let editor: JSX.Element;
    editorBarTarget = {
      type: EditorBarTarget.Type.Robot,
      messages,
      language: language,
      onLanguageChange: this.onActiveLanguageChange_,
      onIndentCode,
      onDownloadCode,
      onResetCode,
      onErrorClick: this.onErrorClick_,
      userName: userName,
      projectName: projectName,
      fileName: fileName,
    };
    editor = (
      <Editor
        theme={theme}
        ref={editorRef}
        code={code[language]}
        language={language}
        onCodeChange={this.onCodeChange_}
        messages={messages}
        autocomplete={settings.editorAutoComplete}
        onDocumentationGoToFuzzy={onDocumentationGoToFuzzy}
      />
    );
    const editorBar = createEditorBarComponents({
      theme,
      target: editorBarTarget,
      locale
    });
    const editorConsoleBar = createConsoleBarComponents(theme, onClearConsole, locale);

    let content: JSX.Element;
    content = (
      <Slider
        isVertical={false}
        theme={theme}
        minSizes={[100, 100]}
        sizes={[3, 1]}
        visible={[true, true]}
      >
        <SimultorWidgetContainer>
          <SimulatorWidget
            theme={theme}
            name={LocalizedString.lookup(tr('Editor'), locale)}
            mode={Mode.Sidebar}
            barComponents={editorBar}
          >
            {editor}
          </SimulatorWidget>
        </SimultorWidgetContainer>

        <SimultorWidgetContainer>
          <SimulatorWidget
            theme={theme}
            name={LocalizedString.lookup(tr('Console'), locale)}
            barComponents={editorConsoleBar}
            mode={Mode.Sidebar}
            hideActiveSize={true}
          >
            <FlexConsole theme={theme} text={editorConsole} />
          </SimulatorWidget>
        </SimultorWidgetContainer>
      </Slider>

    );

  

    return <Container style={style} className={className}>
      <SidePanelContainer>
        {content}
      </SidePanelContainer>
    </Container>;
  }
}

export default connect((state: ReduxState) => {

  return {

    locale: state.i18n.locale,
  };
}, dispatch => ({

}), null, { forwardRef: true })(EditorPage) as React.ComponentType<EditorPageProps>;