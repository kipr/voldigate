import * as React from 'react';
import { connect } from 'react-redux';
import { styled } from 'styletron-react';
import axios from 'axios';
import { Console, createConsoleBarComponents } from './Console';
import { Editor, createEditorBarComponents, EditorBarTarget } from './Editor';
import { LayoutProps } from './Layout/Layout';
import Widget, { Mode, Size } from './Widget';
import { Slider } from './Slider';
import { State as ReduxState } from '../state';
import Dict from '../Dict';
import { StyledText } from '../util';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import ProgrammingLanguage from '../ProgrammingLanguage';
import { Theme, ThemeProps } from './theme';
import { Modal } from '../pages/Modal';



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

export interface EditorPageProps extends LayoutProps, ThemeProps {
  language: ProgrammingLanguage;
  projectName: string;
  fileName: string;
  userName: string;
  code: Dict<string>;
  isleftbaropen: boolean;
  onCodeChange: (code: string) => void;
  onRunClick: () => void;
  onStopClick: () => void;
  onCompileClick: () => void;
  onSaveCode: () => void;
  onDocumentationSetLanguage: (language: 'c' | 'python') => void;
  onFileNameChange: (newFileName: string) => void;
  onClearConsole: () => void;
  editorConsole: StyledText;

  isRunning: boolean;

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
  fileName: string;
  resetCodeAccept: boolean;
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

    console.log("EditorPage compDidUpdate prevProps:", prevProps);
    console.log("EditorPage compDidUpdate prevState:", prevState);
    console.log("EditorPage compDidUpdate props:", this.props);
    console.log("EditorPage compDidUpdate state:", this.state);


     if (this.props.fileName !== prevProps.fileName) {
      console.log("Editor page current state:", this.state);
      console.log("Editor page previous props:", prevProps);
      console.log("Editor page proped this.props:", this.props);

      this.setState({
        language: this.props.language,
        fileName: this.props.fileName,
        code: {
          ...this.state.code,
          [this.props.language]: this.props.code[this.props.language]
        },
        
        
      },async () => {
        console.log("EditorPage updated state:", this.state);
      });
      
    }
    else if (this.props.code !== prevProps.code) {
      console.log("EditorPage previous props code:", prevProps.code);
      console.log("EditorPage updated props code:", this.props.code);

      this.setState({
        code: {
          ...this.state.code,
          [this.state.language]: this.props.code[this.state.language]
        }

      });
    }

    else if (this.props.editorConsole !== prevProps.editorConsole) {
      console.log("EditorPage previous props console:", prevProps.editorConsole);
      console.log("EditorPage updated props console:", this.props.editorConsole);

      this.setState({

        editorConsole: this.props.editorConsole
      });

    }
    
    

  }
  async componentDidMount() {

    console.log("current activeLanguage:", this.state.language);
    console.log("current user name:", this.props.userName);
    console.log("current project name:", this.props.projectName);
    console.log("current file name:", this.props.fileName);
    console.log("Editor page current code:", this.state.code);

    console.log("EditorPage mounted console:", this.state.editorConsole);
    try {

      const { language, fileName } = this.state;
      const { userName, projectName } = this.props;

      if (this.props.fileName.includes(".h")) {
        const includeContent = await axios.get("/get-file-contents", { params: { filePath: `/home/kipr/Documents/KISS/${userName}/${projectName}/include/${this.props.fileName}` } });
        console.log("EditorPage includeContent.data:", includeContent.data);
        console.log("EditorPage state code:", this.state.code);
        // Ensure includeContent.data is a string
        const fileContent = typeof includeContent.data === 'string' ? includeContent.data : JSON.stringify(includeContent.data);


        this.setState((prevState) => ({
          code: {
            ...prevState.code,
            [prevState.language]: fileContent,
          }
        }), () => {
          console.log("EditorPage updated state code:", this.state.code);
        });
      }
      else if (this.props.fileName.includes(".txt")) {
        const userFileContent = await axios.get("/get-file-contents", { params: { filePath: `/home/kipr/Documents/KISS/${userName}/${projectName}/data/${this.props.fileName}` } });
        console.log("EditorPage userFileContent.data:", userFileContent.data);
        console.log("EditorPage state code:", this.state.code);
        // Ensure userFileContent.data is a string
        const fileContent = typeof userFileContent.data === 'string' ? userFileContent.data : JSON.stringify(userFileContent.data);


        this.setState((prevState) => ({
          code: {
            ...prevState.code,
            [prevState.language]: fileContent,
          }
        }), () => {
          console.log("EditorPage updated state code:", this.state.code);
        });
      }
      else {

        const srcContent = await axios.get("/get-file-contents", { params: { filePath: `/home/kipr/Documents/KISS/${userName}/${projectName}/src/${this.props.fileName}` } });
        console.log("EditorPage srcContent.data:", srcContent.data);
        console.log("EditorPage state code:", this.state.code);
        // Ensure srcContent.data is a string
        const fileContent = typeof srcContent.data === 'string' ? srcContent.data : JSON.stringify(srcContent.data);


        this.setState((prevState) => ({
          code: {
            ...prevState.code,
            [prevState.language]: fileContent,
          }
        }), () => {
          console.log("EditorPage updated state code:", this.state.code);
        });
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
    const { language } = this.state;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(this.state.code[language])}`);
    element.setAttribute('download', `program.${ProgrammingLanguage.FILE_EXTENSION[language]}`);
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
      fileName,
      userName
    } = props;

    const {
      language,
      code,
      editorConsole,
    } = this.state;
    console.log("EditorPage render prop:", this.props);
    console.log("EditorPage render state:", this.state);
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
      onDownloadCode,
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
        code={this.props.code[this.props.language]}
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
            style={{ height: '85%' }}
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