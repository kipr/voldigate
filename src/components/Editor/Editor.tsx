import * as React from 'react';
import { styled, withStyleDeep } from 'styletron-react';

import { StyleProps } from '../../style';
import { Theme } from '../theme';
import { middleBarSpacer, rightBarSpacerOpen, rightBarSpacerClosed, leftBarSpacerOpen, leftBarSpacerClosed } from '../common';
import { Fa } from '../Fa';
import { Button } from '../Button';
import { Text } from '../Text';
import { BarComponent } from '../Widget';
import { WarningCharm, ErrorCharm } from './';
import { GREEN, LIGHTMODE_GREEN, RED, ThemeProps } from '../theme';
import { Ivygate, Message } from 'ivygate';
import { FontAwesome } from '../FontAwesome';
import ProgrammingLanguage from '../../ProgrammingLanguage';

import { faFileDownload, faFloppyDisk, faIndent, faLink, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

import Dict from '../../Dict';
import * as monaco from 'monaco-editor';

import tr from '@i18n';

import LocalizedString from '../../util/LocalizedString';


export enum EditorActionState {
  None,
  Compiling,
  Running,
}

export interface EditorPublicProps extends StyleProps, ThemeProps {
  language: ProgrammingLanguage
  code: string;
  onCodeChange: (code: string) => void;
  onSaveCode: () => void;
  messages?: Message[];
  autocomplete: boolean;
  isleftbaropen: boolean;
  isRunning: boolean;
  onDocumentationGoToFuzzy?: (query: string, language: 'c' | 'python' | 'plaintext') => void;
}

interface EditorPrivateProps {
  locale: LocalizedString.Language;
}

interface EditorState {
  isleftbaropen: boolean;
}

type Props = EditorPublicProps;
type State = EditorState;

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const Container = styled('div', (props: ThemeProps) => ({
  flex: '1',
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
  resize: 'none',
  border: 'none',
  ':focus': {
    outline: 'none'
  },
  height: '100%',


}));
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
  transition: 'background-color 0.2s, opacity 0.2s',
}));

const RunItem = withStyleDeep(Item, (props: ClickProps & ThemeProps) => ({
  
  backgroundColor: props.disabled ? (props.theme.themeName === 'DARK' ? props.theme.runButtonColor.disabled : props.theme.runButtonColor.disabled) : (props.theme.themeName === 'DARK' ? props.theme.runButtonColor.standard: props.theme.runButtonColor.standard),
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
  backgroundColor: props.disabled ? RED.disabled : RED.standard,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: RED.hover,
      }
      : {},
}));

export namespace EditorBarTarget {
  export enum Type {
    Robot,
    Script,

  }

  export interface Robot {
    type: Type.Robot;
    messages: Message[];
    language: ProgrammingLanguage;
    isleftbaropen_: boolean;
    isRunning: boolean;
    projectName: string;
    fileName: string;
    userName: string;
    onLanguageChange: (language: ProgrammingLanguage) => void;
    onIndentCode: () => void;
    onSaveCode: () => void;
    onRunClick: () => void;
    onStopClick: () => void;
    onCompileClick: () => void;
    onDownloadCode: () => void;
    onErrorClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  }
}

export type EditorBarTarget = EditorBarTarget.Robot;


export const createNavigationNamesBar = (
  theme: Theme,
  onClearConsole: () => void,
  locale: LocalizedString.Language
) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const consoleBar: BarComponent<object>[] = [];

  consoleBar.push(BarComponent.create(Text, {
    text: 'File Name'
  }));

  return consoleBar;
};

export const createEditorBarComponents = ({
  theme,
  target,
  locale,


}: {
  theme: Theme,
  target: EditorBarTarget,
  locale: LocalizedString.Language,

}) => {

  // eslint-disable-next-line @typescript-eslint/ban-types
  const editorBar: BarComponent<object>[] = [];
  let wn = `${window.location.pathname}`;
  let windowName = wn.split("/", 3);

  switch (target.type) {
    case EditorBarTarget.Type.Robot: {
      let errors = 0;
      let warnings = 0;

      editorBar.push(BarComponent.create(Button, {
        theme,
        //onClick: target.isRunning ? target.onStopClick : target.onRunClick,

        children: target.isRunning
          ? (
            <StopItem
              theme={theme}
              onClick={target.onStopClick}
              disabled={false}
            >
              <ItemIcon icon={faStop} />
              {LocalizedString.lookup(tr('Stop', 'Terminate program execution'), locale)}
            </StopItem>
          )
          : (
            <RunItem
              theme={theme}
              onClick={target.onRunClick}
              style={{ borderLeft: `1px solid ${theme.borderColor}` }}
            >
              <ItemIcon icon={faPlay} />
              {LocalizedString.lookup(tr('Run', 'Begin program execution'), locale)}
            </RunItem>
          )
      }));

      editorBar.push(BarComponent.create(Button, {
        theme,
        onClick: target.onCompileClick,
        children:
          <>
            <Fa icon={faLink} />
            {' '} {LocalizedString.lookup(tr('Compile'), locale)}
          </>
      }));
      editorBar.push(BarComponent.create(Button, {
        theme,
        onClick: target.onSaveCode,
        children:
          <>
            <Fa icon={faFloppyDisk} />
            {' '} {LocalizedString.lookup(tr('Save'), locale)}
          </>
      }));

      if (target.isleftbaropen_) {
        editorBar.push(BarComponent.create(leftBarSpacerOpen, {
        }));
      }
      else {
        editorBar.push(BarComponent.create(leftBarSpacerClosed, {
        }));

      }


      editorBar.push(BarComponent.create(Text, {
        text: 'User:'
      }));

      editorBar.push(BarComponent.create(middleBarSpacer, {

      }));

      editorBar.push(BarComponent.create(Text, {
        text: target.userName
      }));

      editorBar.push(BarComponent.create(middleBarSpacer, {

      }));


      editorBar.push(BarComponent.create(Text, {
        text: 'Project Name:'
      }));

      editorBar.push(BarComponent.create(middleBarSpacer, {

      }));
      editorBar.push(BarComponent.create(Text, {
        text: target.projectName
      }));
      editorBar.push(BarComponent.create(middleBarSpacer, {

      }));
      editorBar.push(BarComponent.create(Text, {
        text: 'File Name:',

      }));
      editorBar.push(BarComponent.create(middleBarSpacer, {

      }));
      editorBar.push(BarComponent.create(Text, {
        text: target.fileName
      }));

      if (target.isleftbaropen_.toString() === 'true') {
         editorBar.push(BarComponent.create(rightBarSpacerOpen, {

        }));

      }
      else {
        editorBar.push(BarComponent.create(rightBarSpacerClosed, {

        }));
      }



      editorBar.push(BarComponent.create(Button, {
        theme,
        onClick: target.onIndentCode,
        children:
          <>
            <Fa icon={faIndent} />
            {' '} {LocalizedString.lookup(tr('Indent'), locale)}
          </>
      }));

      editorBar.push(BarComponent.create(Button, {
        theme,
        onClick: target.onDownloadCode,
        children:
          <>
            <Fa icon={faFileDownload} />
            {' '} {LocalizedString.lookup(tr('Download'), locale)}
          </>
      }));

      target.messages.forEach(message => {
        switch (message.severity) {
          case 'error': {
            ++errors;
            break;
          }
          case 'warning': {
            ++warnings;
            break;
          }
        }
      });

      if (errors > 0) editorBar.push(BarComponent.create(ErrorCharm, {
        theme,
        count: errors,
        onClick: target.onErrorClick,
        locale
      }));

      if (warnings > 0) editorBar.push(BarComponent.create(WarningCharm, {
        theme,
        count: warnings,
        onClick: target.onErrorClick,
        locale
      }));
      break;
    }
  }

  return editorBar;
};

export const IVYGATE_LANGUAGE_MAPPING: Dict<string> = {
  'ecmascript': 'javascript',
  'python': 'python',
  'c': 'c',
  'cpp': 'c',
  'plaintext': 'plaintext',
};

const DOCUMENTATION_LANGUAGE_MAPPING: { [key in ProgrammingLanguage]: 'c' | 'python' | 'plaintext' } = {

  'python': 'python',
  'c': 'c',
  'cpp': 'c',
  'plaintext': 'plaintext',
};

class Editor extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {

      isleftbaropen: props.isleftbaropen,
    };
  }

  componentDidMount() {
    console.log("inside componentDidMount in Editor.tsx with props:", this.props);

  }

  async componentDidUpdate(prevProps: Props) {

    console.log("inside componentDidUpdate in Editor.tsx with props:", this.props);

    if (this.props.isleftbaropen !== this.state.isleftbaropen) {
      this.setState({ isleftbaropen: this.props.isleftbaropen });
    }

    if (this.props.language !== prevProps.language) {
      console.log("Editor Language changed from: ", prevProps.language);
      console.log("Editor Language changed to: ", this.props.language);
    }

    if (this.props.code !== prevProps.code) {
      console.log("Code changed from: ", prevProps.code);
      console.log("Code changed to: ", this.props.code);
    }


  }
  private openDocumentation_ = () => {
    const { word } = this.ivygate_.editor.getModel().getWordAtPosition(this.ivygate_.editor.getPosition());
    const language = DOCUMENTATION_LANGUAGE_MAPPING[this.props.language];
    if (!language) return;
    this.props.onDocumentationGoToFuzzy?.(word, language);

  };

  private openDocumentationAction_?: monaco.IDisposable;
  private setupCodeEditor_ = (editor: monaco.editor.IStandaloneCodeEditor) => {
    if (this.props.onDocumentationGoToFuzzy) this.openDocumentationAction_ = editor.addAction({
      id: 'open-documentation',
      label: 'Open Documentation',
      contextMenuOrder: 0,
      contextMenuGroupId: "operation",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: this.openDocumentation_,
    });
  };

  private disposeCodeEditor_ = (editor: monaco.editor.IStandaloneCodeEditor) => {
    if (this.openDocumentationAction_) this.openDocumentationAction_.dispose();
  };

  private ivygate_: Ivygate;
  private bindIvygate_ = (ivygate: Ivygate) => {
    if (this.ivygate_ === ivygate) return;
    const old = this.ivygate_;
    this.ivygate_ = ivygate;
    if (this.ivygate_ && this.ivygate_.editor) {
      this.setupCodeEditor_(this.ivygate_.editor as monaco.editor.IStandaloneCodeEditor);
    } else {
      this.disposeCodeEditor_(old.editor as monaco.editor.IStandaloneCodeEditor);
    }
  };

  get ivygate() {
    return this.ivygate_;
  }

  render() {

    console.log("inside render in Editor.tsx with props:", this.props);
    const {
      style,
      className,
      theme,
      code,
      onCodeChange,
      messages,
      autocomplete,
      language
    } = this.props;
    console.log("Editor theme:", this.props.theme); // Debugging
    return (
      <Container theme={theme} style={style} className={className} >
        <Ivygate
          ref={this.bindIvygate_}
          code={code}
          language={IVYGATE_LANGUAGE_MAPPING[language] || language}
          messages={messages}
          onCodeChange={onCodeChange}
          autocomplete={autocomplete}
        />
      </Container>
    );
  }
}

export default Editor;