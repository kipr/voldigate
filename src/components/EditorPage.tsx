import * as React from 'react';
import axios from 'axios';
import Dict from '../Dict';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import ProgrammingLanguage from '../ProgrammingLanguage';
import Widget, { Mode, Size } from './Widget';
import { styled, withStyleDeep } from 'styletron-react';
import { Console, createConsoleBarComponents } from './Console';
import { Editor, createEditorBarComponents, EditorBarTarget } from './Editor';
import { LayoutProps } from './Layout/Layout';
import { Slider } from './Slider';
import { FontAwesome } from './FontAwesome';
import { StyledText } from '../util';
import { ThemeProps, Theme, GREEN, RED, LIGHTMODE_GREEN, } from './theme';
import { Modal } from '../pages/Modal';
import { JSX } from 'react';
import { faFloppyDisk, faLink, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { Fa } from './Fa';


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
  onIndentCode: () => void;
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
  theme: Theme;
  screenWidth: number;
}
interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
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

const Item = styled('div', (props: ThemeProps & ClickProps) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  borderRight: `1px solid ${props.theme.borderColor}`,
  paddingLeft: '30px',
  paddingRight: '30px',
  height: '100%',
  opacity: props.disabled ? '0.5' : '1.0',
  ':last-child': {
    borderRight: 'none',
  },
  fontWeight: 400,
  ':hover':
    props.onClick && !props.disabled
      ? {
        cursor: 'pointer',
        backgroundColor: `rgba(255, 255, 255, 0.1)`,
      }
      : {},
  userSelect: 'none',

}));

const RunItem = withStyleDeep(Item, (props: ClickProps & ThemeProps) => ({
  fontSize: '0.9em',
  backgroundColor: props.disabled ? (props.theme.themeName === 'DARK' ? props.theme.runButtonColor.disabled : props.theme.runButtonColor.disabled) : (props.theme.themeName === 'DARK' ? props.theme.runButtonColor.standard : props.theme.runButtonColor.standard),
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: props.theme.themeName === 'DARK' ? GREEN.hover : LIGHTMODE_GREEN.hover,
      }
      : {},
}));

const ItemIcon = styled(FontAwesome, {
  paddingRight: '10px',
});

const StopItem = withStyleDeep(Item, (props: ClickProps) => ({
  fontSize: '0.9em',
  backgroundColor: props.disabled ? RED.disabled : RED.standard,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: RED.hover,
      }
      : {},
}));

const WidgetContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flex: '1 0 0',
  height: '100%',
  width: '100%',
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
  backgroundColor: props.theme.editorConsoleBackground,
  overflowY: 'auto',
  maxHeight: '100vh',
}));

const EPWidget = styled(Widget, (props: ThemeProps) => ({
  display: 'flex',
  flex: '1 1 auto',
  height: '100%',
  width: '500px',
  border: `1px solid ${props.theme.borderColor}`,
  fontSize: '22px',
  backgroundColor: props.theme.editorConsoleBackground,
}));

const MobileEPWidget = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',

  height: '100%',
  width: '100%',
  fontSize: '22px',
  //overflowY: 'auto',
  maxHeight: '100vh',
}));

const MobileEditorBar = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
  fontSize: '22px',
  borderBottom: `1px solid ${props.theme.borderColor}`,
  backgroundColor: props.theme.mobileEditorBarBackground,
  overflowY: 'auto',
  maxHeight: '100vh',

}));

const MobileEditorBarContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  margin: '10px 0px 0px 0px',
  width: '100%',
  fontSize: '22px',
}));

const InfoLabel = styled('span', (props: ThemeProps) => ({
  fontWeight: '500',
  fontSize: '0.9em',
  marginRight: '5px',
}));

const InformationText = styled('div', (props: ThemeProps) => ({
  color: props.theme.color,
  fontSize: '0.9em',
  marginLeft: '10px',
  marginRight: '10px',
}));

const FlexConsole = styled(Console, {
  flex: '1 1',
  color: 'black',
  marginBottom: '2.5em'
});

const Button = styled('button', (props: ThemeProps) => ({
  border: `1px solid ${props.theme.borderColor}`,
  borderRadius: `${props.theme.borderRadius}px`,
  padding: `${props.theme.itemPadding}px ${props.theme.itemPadding * 2}px`,
  cursor: 'pointer',
  fontSize: '1em',
}));

export class EditorPage extends React.PureComponent<Props & ReduxEditorPageProps, State> {

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
        'graphical': '',

      },
      editorConsole: props.editorConsole,
      fileName: props.fileName,
      resetCodeAccept: false,
      theme: props.theme,
      screenWidth: window.innerWidth,
    };
  }


  async componentDidUpdate(prevProps: Props, prevState: State) {
    console.log("EditorPage compDidUpdate props:", this.props, "prevProps:", prevProps);
    console.log("EditorPage compDidUpdate state:", this.state, "prevState:", prevState);

    if (this.props.fileName !== prevProps.fileName || this.props.code !== prevProps.code) {

      this.setState({
        language: this.props.language,
        fileName: this.props.fileName,
        code: {
          ...this.state.code,
          [this.props.language]: this.props.code[this.props.language]
        },
      });
    }

    if (prevProps.theme !== this.props.theme) {
      this.setState({
        theme: prevProps.theme
      })
    }
    if (this.props.editorConsole !== prevProps.editorConsole) {
      this.setState({
        editorConsole: this.props.editorConsole
      });

    }
  }

  async componentDidMount() {
    window.addEventListener('resize', this.handleResize);

    try {
      const { userName, projectName, fileName, code } = this.props;
      let fileContent = '';

      if (fileName.includes('.h')) {
        const includeContent = await axios.get('/get-file-contents', {
          params: {
            filePath: `/home/kipr/Documents/KISS/${userName}/${projectName}/include/${fileName}`,
          },
        });
        fileContent = typeof includeContent.data === 'string' ? includeContent.data : JSON.stringify(includeContent.data);
      } else if (fileName.includes('.txt')) {
        const userFileContent = await axios.get('/get-file-contents', {
          params: {
            filePath: `/home/kipr/Documents/KISS/${userName}/${projectName}/data/${fileName}`,
          },
        });
        fileContent = typeof userFileContent.data === 'string' ? userFileContent.data : JSON.stringify(userFileContent.data);
      } else {
        const srcContent = await axios.get('/get-file-contents', {
          params: {
            filePath: `/home/kipr/Documents/KISS/${userName}/${projectName}/src/${fileName}`,
          },
        });
        fileContent = typeof srcContent.data === 'string' ? srcContent.data : JSON.stringify(srcContent.data);
      }

      this.setState((prevState) => {
        const updatedCode = {
          ...prevState.code,
          [prevState.language]: fileContent,
        };

        code[prevState.language] = fileContent;

        return {
          code: updatedCode,
        };
      });


      this.props.onFileNameChange(fileName);
    } catch (error) {
      console.error('Error getting content from file:', error);
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    this.setState({ screenWidth: window.innerWidth });
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
    if (this.props.editorRef) this.props.editorRef.current.ivygate.formatCode();
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
      onIndentCode: this.onIndentCode_,
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
    const isMobile = this.state.screenWidth < 1050;
    const editorBar = createEditorBarComponents({
      theme,
      target: editorBarTarget,
      locale,
    });

    const editorConsoleBar = createConsoleBarComponents(theme, this.props.onClearConsole, locale);

    let content: JSX.Element;
    let mobileEditorBarContent: JSX.Element;
    mobileEditorBarContent = (
      <div>
        <MobileEditorBarContainer theme={theme}>
          {this.props.isRunning ? (
            <StopItem
              theme={theme}
              onClick={this.props.onStopClick}
              disabled={!this.props.isRunning}
            >
              <ItemIcon icon={faStop} />
              {LocalizedString.lookup(tr('Stop'), locale)}
            </StopItem>
          ) : (
            <RunItem
              theme={theme}
              onClick={this.props.onRunClick}
              disabled={this.props.isRunning}
            >
              <ItemIcon icon={faPlay} />
              {LocalizedString.lookup(tr('Run'), locale)}
            </RunItem>
          )}
          <Button theme={theme} onClick={() => this.props.onCompileClick()}>
            <Fa icon={faLink} />
            {' '} {LocalizedString.lookup(tr('Compile'), locale)}

          </Button>
          <Button theme={theme} onClick={() => this.props.onSaveCode()}>
            <Fa icon={faFloppyDisk} />
            {' '} {LocalizedString.lookup(tr('Save'), locale)}
          </Button>
        </MobileEditorBarContainer>
        <MobileEditorBarContainer
          theme={theme}>
          <InformationText theme={theme}>
            <InfoLabel theme={theme}>
              {LocalizedString.lookup(tr('User Name'), locale)}:
            </InfoLabel>
            {this.props.userName}
          </InformationText>
          <InformationText theme={theme}>
            <InfoLabel theme={theme}>

              {LocalizedString.lookup(tr('Project Name'), locale)}:
            </InfoLabel>
            {this.props.projectName}
          </InformationText>
          <InformationText theme={theme}>
            <InfoLabel theme={theme}>
              {LocalizedString.lookup(tr('File Name'), locale)}:
            </InfoLabel>
            {this.props.fileName}
          </InformationText>

        </MobileEditorBarContainer>
      </div>

    );
    content = (
      <Slider
        key={settings.consoleLayout}
        isVertical={settings.consoleLayout === 'vertical'}
        theme={theme}
        minSizes={[100, 100]}
        sizes={isMobile ? [1.5, 2] : [3, 2]}
        visible={[true, true]}
      >
        <WidgetContainer theme={theme}  >
          {isMobile ? (
            <MobileEPWidget
              theme={theme}>
              <MobileEditorBar theme={theme}>
                {mobileEditorBarContent}
              </MobileEditorBar>
              {editor}
            </MobileEPWidget>
          ) : (
            <EPWidget
              theme={theme}
              name={LocalizedString.lookup(tr('Editor'), locale)}
              mode={Mode.Sidebar}
              barComponents={editorBar}
              fontSize={'1em'}
            >
              {editor}
            </EPWidget>
          )}
        </WidgetContainer>

        <WidgetContainer theme={theme}>
          <EPWidget
            theme={theme}
            name={LocalizedString.lookup(tr('Console'), locale)}
            barComponents={editorConsoleBar}
            mode={Mode.Sidebar}
            hideActiveSize={true}
            fontSize={'24px'}
          >
            <FlexConsole theme={theme} text={editorConsole} />
          </EPWidget>
        </WidgetContainer>
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