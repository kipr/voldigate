import * as React from 'react';
import axios from 'axios';
import Dict from '../Dict';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import ProgrammingLanguage from '../ProgrammingLanguage';
import Widget, { Mode, Size } from './Widget';
import { connect } from 'react-redux';
import { styled } from 'styletron-react';
import { Console, createConsoleBarComponents } from './Console';
import { Editor, createEditorBarComponents, EditorBarTarget } from './Editor';
import { LayoutProps } from './Layout/Layout';
import { Slider } from './Slider';
import { State as ReduxState } from '../state';
import { StyledText } from '../util';
import { ThemeProps } from './theme';
import { Modal } from '../pages/Modal';
import { JSX } from 'react';


export interface EditorPageProps extends LayoutProps, ThemeProps {

  projectName: string;
  fileName: string;
  userName: string;
  isRunning: boolean;
  isleftbaropen: boolean;
  editorConsole: StyledText;
  language: ProgrammingLanguage;
  code: Dict<string>;
  onCodeChange: (code: string) => void;
  onRunClick: () => void;
  onStopClick: () => void;
  onCompileClick: () => void;
  onSaveCode: () => void;
  onDocumentationSetLanguage: (language: 'c' | 'python') => void;
  onFileNameChange: (newFileName: string) => void;
  onClearConsole: () => void;
}

interface ReduxEditorPageProps {
  locale: LocalizedString.Language;
}

interface EditorPageState {
  fileName: string;
  workingScriptCode?: string;
  activePanel: number;
  resetCodeAccept: boolean;
  sidePanelSize: Size.Type;
  language: ProgrammingLanguage;
  editorConsole: StyledText;
  modal: Modal;
  code: Dict<string>;
}

type Props = EditorPageProps;
type State = EditorPageState;

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

const SimultorWidgetContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flex: '1 0 0',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  backGroundColor: props.theme.editorConsoleBackground,

}));

const SimulatorWidget = styled(Widget, (props: ThemeProps) => ({
  display: 'flex',
  flex: '1 1 0',
  margin: '10px 0px 0px 0px',
  height: '100%',
  width: '100%',
  backgroundColor: props.theme.editorConsoleBackground,
}));

const FlexConsole = styled(Console, {
  flex: '1 1',
  color: 'black',
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
        'c': '',
        'cpp': '',
        'python': '',
        'plaintext': '',

      },
      editorConsole: props.editorConsole,
      fileName: props.fileName,
      resetCodeAccept: false,
    };
  }

  async componentDidUpdate(prevProps: Props, prevState: State) {

    if (this.props.fileName !== prevProps.fileName || this.props.code !== prevProps.code) { 

      this.setState({
        language: this.props.language,
        fileName: this.props.fileName,
        code: {
          ...this.state.code,
          [this.props.language]: this.props.code[this.props.language]
        },

      }, () => {

      });
    }
    // if (this.props.code !== prevProps.code) {
    //   console.log("EditorPage compDidUpdate changing code from: ", prevProps.code, " to: ", this.props.code);
    //   this.setState({
    //     code: {
    //       ...this.state.code,
    //       [this.state.language]: this.props.code[this.state.language]
    //     }
    //   }, () => {
    //     console.log("EditorPage compDidUpdate code state: ", this.state.code);
    //   });
    // }
    if (this.props.editorConsole !== prevProps.editorConsole) {
      this.setState({
        editorConsole: this.props.editorConsole
      });

    }
    //
  }
  async componentDidMount() {
    try {

      const { userName, projectName } = this.props;

      if (this.props.fileName.includes(".h")) {
        const includeContent = await axios.get("/get-file-contents", { params: { filePath: `/home/kipr/Documents/KISS/${userName}/${projectName}/include/${this.props.fileName}` } });
        // Ensure includeContent.data is a string
        const fileContent = typeof includeContent.data === 'string' ? includeContent.data : JSON.stringify(includeContent.data);


        this.setState((prevState) => ({
          code: {
            ...prevState.code,
            [prevState.language]: fileContent,
          }
        }));
      }
      else if (this.props.fileName.includes(".txt")) {
        const userFileContent = await axios.get("/get-file-contents", { params: { filePath: `/home/kipr/Documents/KISS/${userName}/${projectName}/data/${this.props.fileName}` } });
        // Ensure userFileContent.data is a string
        const fileContent = typeof userFileContent.data === 'string' ? userFileContent.data : JSON.stringify(userFileContent.data);

        this.setState((prevState) => ({
          code: {
            ...prevState.code,
            [prevState.language]: fileContent,
          }
        }));
      }
      else {

        const srcContent = await axios.get("/get-file-contents", { params: { filePath: `/home/kipr/Documents/KISS/${userName}/${projectName}/src/${this.props.fileName}` } });
        // Ensure srcContent.data is a string
        const fileContent = typeof srcContent.data === 'string' ? srcContent.data : JSON.stringify(srcContent.data);

        this.setState((prevState) => ({
          code: {
            ...prevState.code,
            [prevState.language]: fileContent,
          }
        }));
      }

      this.props.onFileNameChange(this.state.fileName);
      this.props.code[this.state.language] = this.state.code[this.state.language];
    }
    catch (error) {
      console.error('Error getting content from src file:', error);
    }

  }

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
    const { language, fileName } = this.state;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(this.state.code[language])}`);
    element.setAttribute('download', `${fileName}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  render() {
    const { props } = this;
    const {
      style,
      className,
      theme,
      messages,
      settings,
      onClearConsole,
      onIndentCode,
      onDownloadCode,
      onSaveCode,
      editorRef,
      onDocumentationGoToFuzzy,
      locale,
      isleftbaropen,
      projectName,
      userName
    } = props;

    const {
      editorConsole,
    } = this.state;

    let editorBarTarget: EditorBarTarget;
    let editor: JSX.Element;
    editorBarTarget = {
      type: EditorBarTarget.Type.Robot,
      messages,
      isleftbaropen_: isleftbaropen,

      isRunning: this.props.isRunning,
      language: this.props.language,
      onRunClick: this.props.onRunClick,
      onStopClick: this.props.onStopClick,
      onCompileClick: this.props.onCompileClick,
      onLanguageChange: this.onActiveLanguageChange_,
      onIndentCode,
      onDownloadCode: this.onDownloadClick_,
      onSaveCode,
      onErrorClick: this.onErrorClick_,
      userName: userName,
      projectName: projectName,
      fileName: this.props.fileName,
    };
    editor = (
      <Editor
      
        theme={theme}
        isleftbaropen={isleftbaropen}
        isRunning={this.props.isRunning}
        ref={editorRef}
        code={this.state.code[this.state.language]}
        language={this.props.language}
        onCodeChange={this.props.onCodeChange}
        onSaveCode={this.props.onSaveCode}
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
    const editorConsoleBar = createConsoleBarComponents(theme, this.props.onClearConsole, locale);

    let content: JSX.Element;
    content = (
      <Slider
        isVertical={false}
        theme={theme}
        minSizes={[100, 100]}
        sizes={[3, 1]}
        visible={[true, true]}
      >
        <SimultorWidgetContainer theme={theme}>
          <SimulatorWidget
            theme={theme}
            name={LocalizedString.lookup(tr('Editor'), locale)}
            mode={Mode.Sidebar}
            barComponents={editorBar}
          >
            {editor}
          </SimulatorWidget>
        </SimultorWidgetContainer>

        <SimultorWidgetContainer theme={theme}>
          <SimulatorWidget
            theme={theme}
            name={LocalizedString.lookup(tr('Console'), locale)}
            barComponents={editorConsoleBar}
            mode={Mode.Sidebar}
            hideActiveSize={true}
            style={{ height: '85%', paddingBottom: '20px' }}
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

export default EditorPage;