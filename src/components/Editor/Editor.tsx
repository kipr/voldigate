import * as React from 'react';
import ProgrammingLanguage from '../../ProgrammingLanguage';
import Dict from '../../Dict';
import type * as monaco from 'monaco-editor';
import tr from '@i18n';
import LocalizedString from '../../util/LocalizedString';
import { styled, withStyleDeep } from 'styletron-react';
import { StyleProps } from '../../style';
import { Theme } from '../theme';
import { middleBarSpacer, leftBarSpacer, rightBarSpacer } from '../common';
import { Fa } from '../Fa';
import { Button } from '../Button';
import { Text } from '../Text';
import { BarComponent } from '../Widget';
import { WarningCharm, ErrorCharm } from './';
import { GREEN, LIGHTMODE_GREEN, RED, ThemeProps } from '../theme';
import {  Message } from 'ivygate';
import type { Ivygate as IvygateType } from 'ivygate';

const Ivygate = React.lazy(() =>
  import('ivygate').then(module => ({ default: module.Ivygate }))
);
import { FontAwesome } from '../FontAwesome';
import { faFileDownload, faFloppyDisk, faIndent, faLink, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { Suspense } from 'react';
const GraphicalEditor = React.lazy(() => import('./GraphicalEditor'));

export enum EditorActionState {
  None,
  Compiling,
  Running,
}

export interface EditorPublicProps extends StyleProps, ThemeProps {
  language: ProgrammingLanguage
  code: string;
  autocomplete: boolean;
  isleftbaropen: boolean;
  isRunning: boolean;
  messages?: Message[];
  onCodeChange: (code: string) => void;
  onSaveCode: () => void;
  onDocumentationGoToFuzzy?: (query: string, language: 'c' | 'python' | 'plaintext' | 'graphical') => void;

  mini?: boolean;
}

interface EditorState {
  isleftbaropen: boolean;
  code: string;
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
  width: '100%',
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
  paddingLeft: '1em',
  paddingRight: '1em',
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
  marginTop: '0.1em',
  marginBottom: '0.1em',

}));

const RunItem = withStyleDeep(Item, (props: ClickProps & ThemeProps) => ({

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

            >
              <ItemIcon icon={faPlay} />
              {LocalizedString.lookup(tr('Run', 'Begin program execution'), locale)}
            </RunItem>

          )
      }));

      editorBar.push(BarComponent.create(Button, {
        theme,
        onClick: target.onCompileClick,
        style: { fontSize: '0.9em' },
        children:
          <>
            <Fa icon={faLink} />
            {' '} {LocalizedString.lookup(tr('Compile'), locale)}
          </>
      }));
      editorBar.push(BarComponent.create(Button, {
        theme,
        onClick: target.onSaveCode,
        style: { fontSize: '0.9em' },
        children:
          <>
            <Fa icon={faFloppyDisk} />
            {' '} {LocalizedString.lookup(tr('Save'), locale)}
          </>
      }));

      editorBar.push(BarComponent.create(leftBarSpacer, {
      }));


      editorBar.push(BarComponent.create(Text, {
        text: 'User:',
        style: {
          fontWeight: '500',
          fontSize: '0.9em'
        }
      }));

      editorBar.push(BarComponent.create(middleBarSpacer, {

      }));

      editorBar.push(BarComponent.create(Text, {
        style: {
          minWidth: '1.5em',
          maxWidth: '15em',
          fontSize: '0.9em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        },
        text: target.userName

      }));

      editorBar.push(BarComponent.create(middleBarSpacer, {

      }));


      editorBar.push(BarComponent.create(Text, {
        text: 'Project:',
        style: {
          fontWeight: '500',
          fontSize: '0.9em'
        }
      }));

      editorBar.push(BarComponent.create(middleBarSpacer, {

      }));
      editorBar.push(BarComponent.create(Text, {
        style: {
          minWidth: '1.5em',
          maxWidth: '15em',
          fontSize: '0.9em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        },
        text: target.projectName
      }));
      editorBar.push(BarComponent.create(middleBarSpacer, {

      }));
      editorBar.push(BarComponent.create(Text, {
        text: 'File:',
        style: {
          fontWeight: '500',
          fontSize: '0.9em'
        }

      }));
      editorBar.push(BarComponent.create(middleBarSpacer, {

      }));
      editorBar.push(BarComponent.create(Text, {
        style: {
          minWidth: '0.9em',
          maxWidth: '15em',
          fontSize: '0.9em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        },
        text: target.fileName
      }));



      editorBar.push(BarComponent.create(rightBarSpacer, {

      }));


      editorBar.push(BarComponent.create(Button, {
        theme,
        onClick: target.onIndentCode,
        style: { fontSize: '0.9em' },
        children:
          <>
            <Fa icon={faIndent} />
            {' '} {LocalizedString.lookup(tr('Indent'), locale)}
          </>
      }));

      editorBar.push(BarComponent.create(Button, {
        theme,
        onClick: target.onDownloadCode,
        style: { fontSize: '0.9em' },
        children:
          <>
            <Fa icon={faFileDownload} />
            {' '} {LocalizedString.lookup(tr('Download'), locale)}
          </>
      }));

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
  'python': 'customPython',
  'c': 'customCpp',
  'cpp': 'customCpp',
  'plaintext': 'plaintext',
};

const DOCUMENTATION_LANGUAGE_MAPPING: { [key in ProgrammingLanguage]?: 'c' | 'python' | 'plaintext' | 'graphical' | undefined } = {
  'python': 'python',
  'c': 'c',
  'cpp': 'c',
  'plaintext': 'plaintext',

};

class Editor extends React.PureComponent<Props, State> {
  monaco: typeof import('monaco-editor') | null = null;
  constructor(props: Props) {
    super(props);
    this.state = {
      code: '',
      isleftbaropen: props.isleftbaropen,
    };
  }

  async componentDidMount() {
    this.monaco = await import('monaco-editor');
    // Now you can use this.monaco.* in your methods.
    // For example, setup code editor actions here if editor instance is ready.
  }
  setupCodeEditor_ = (editor: any) => {
    if (!this.monaco) {
      // Monaco not loaded yet — maybe queue or skip
      return;
    }
    const monaco = this.monaco;
    // use monaco here, e.g.
    if (this.props.onDocumentationGoToFuzzy) {
      this.openDocumentationAction_ = editor.addAction({
        id: 'open-documentation',
        label: 'Open Documentation',
        contextMenuOrder: 0,
        contextMenuGroupId: "operation",
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
        run: this.openDocumentation_,
      });
    }
  };
  
  async componentDidUpdate(prevProps: Props) {

    console.log("Editor compDidUpdate prevProps: ", prevProps);
    console.log("Editor compDidUpdate this.props: ", this.props);
    console.log("Editor compDidUpdate this.prevProps.code: ", prevProps.code);
    console.log("Editor compDidUpdate this.props.code: ", this.props.code);

    if (prevProps.code !== this.props.code) {
      console.log("Editor compDidUpdate code changed from:\n ", prevProps.code, " to:\n ", this.props.code);
      const editorValue = this.ivygate_?.editor?.getValue();

      if (editorValue !== this.props.code) {
        this.setState({ code: this.props.code }, () => {
          if (this.ivygate_ && this.ivygate_.editor) {
            this.ivygate_.editor.getModel().setValue(this.props.code);
            this.ivygate_.editor.setScrollLeft(0);
            this.ivygate_.editor.setScrollTop(0);
            this.ivygate_.editor.setPosition({ lineNumber: 1, column: 1 });

          }


        });
      }
    }
    if (this.props.isleftbaropen !== this.state.isleftbaropen) {
      this.setState({ isleftbaropen: this.props.isleftbaropen });
    }
  }

  private openDocumentation_ = () => {
    const { word } = this.ivygate_.editor.getModel().getWordAtPosition(this.ivygate_.editor.getPosition());
    const language = DOCUMENTATION_LANGUAGE_MAPPING[this.props.language];
    if (!language) return;
    this.props.onDocumentationGoToFuzzy?.(word, language);

  };

  private openDocumentationAction_?: monaco.IDisposable;


  private disposeCodeEditor_ = (editor: monaco.editor.IStandaloneCodeEditor) => {
    if (this.openDocumentationAction_) this.openDocumentationAction_.dispose();
  };

  private ivygate_: IvygateType | null = null;

  private bindIvygate_ = (ivygate: IvygateType) => {
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
    console.log("Editor render props", this.props);
    console.log("Editor render state", this.state);
    const {
      style,
      className,
      theme,
      code,
      onCodeChange,
      messages,
      autocomplete,
      language,
      mini
    } = this.props;

    let component: JSX.Element;

    if (language === 'graphical') {
      component = (
        <Suspense fallback={<div>Loading...</div>}>
          <GraphicalEditor
            code={code}
            onCodeChange={onCodeChange}
            theme={theme}
            toolboxHidden={mini}
          />
        </Suspense>
      );
    }
    else {
      console.log("Editor render Ivygate props: ", this.props);
      component = (
        <Suspense fallback={<div>Loading Ivygate...</div>}>
          <Ivygate
          ref={this.bindIvygate_}

          code={this.props.code}
          language={IVYGATE_LANGUAGE_MAPPING[language] || language}
          messages={messages}
          onCodeChange={onCodeChange}
          autocomplete={autocomplete}
          theme={theme.themeName}
        />
        </Suspense>
      );
    }

    console.log("Editor render component", component);
    console.log("Editor state", this.state);
    return (
      <Container theme={theme} style={style} className={className} >
        {component}
      </Container>
    );
  }
}

export default Editor;