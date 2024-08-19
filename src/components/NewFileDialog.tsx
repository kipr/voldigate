
import { LIGHT, ThemeProps } from './theme';
import { StyleProps } from '../style';

import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import * as React from 'react';
import ComboBox from './ComboBox';
import { styled } from 'styletron-react';
import ScrollArea from './ScrollArea';
import { Dialog } from './Dialog';
import { State as ReduxState } from '../state';
import { I18nAction } from '../state/reducer';
import { connect } from 'react-redux';
import Form from './Form';
import { StyledText } from '../util';
import { push } from 'connected-react-router';

import { DatabaseService } from './DatabaseService';
import { Editor, createEditorBarComponents, EditorBarTarget } from './Editor';
import { EditorPage } from './EditorPage';
import Geometry from 'state/State/Scene/Geometry';
import Node from 'state/State/Scene/Node';
import Script from 'state/State/Scene/Script';
import { LayoutProps, SideLayout } from './Layout';
import { Slider } from './Slider';
import Widget, { Mode } from './Widget';
import { Console, createConsoleBarComponents } from './Console';
import { Message } from "ivygate";
import ProgrammingLanguage from 'ProgrammingLanguage';
import { DEFAULT_SETTINGS, Settings } from '../Settings';

export interface NewFileDialogPublicProps extends ThemeProps, StyleProps {
  onClose: () => void;
  showRepeatUserDialog: boolean;
  fileName: string;
  editorTarget: EditorBarTarget;
  messages: Message[];
  onIndentCode: () => void;
  onDownloadCode: () => void;
  onResetCode: () => void;
  onClearConsole: () => void;
  language: ProgrammingLanguage;
  editorConsole: StyledText;
  onDocumentationGoToFuzzy?: (query: string, language: 'c' | 'python') => void;
  onEditorPageOpen: () => void;
  onChangeProjectName: (projectName: string) => void;
}
export enum Type {
  Robot = 'robot',
}
export interface Robot {
  type: Type.Robot;
  language: ProgrammingLanguage;
  onLanguageChange: (language: ProgrammingLanguage) => void;
  code: string;
  onCodeChange: (code: string) => void;
}
interface NewFileDialogPrivateProps {
  locale: LocalizedString.Language;
  onLocaleChange: (locale: LocalizedString.Language) => void;
  onUserCreation: (fileName: string) => void;
}

interface NewFileDialogState {
  fileName: string;
  modal: Modal;
  settings: Settings;
  showRepeatUserDialog: boolean;
  editorTarget: EditorBarTarget;
  showEditorPage: boolean;
  language: ProgrammingLanguage;
}



type Props = NewFileDialogPublicProps & NewFileDialogPrivateProps;
type State = NewFileDialogState;

const Container = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  color: props.theme.color,
  minHeight: '200px',
}));
namespace Modal {
  export enum Type {
    Settings,
    CreateUser,
    RepeatUser,
    None,
    OpenUser
  }
  export interface None {
    type: Type.None;
  }

  export const NONE: None = { type: Type.None };

  export interface Settings {
    type: Type.Settings;
  }

  export const SETTINGS: Settings = { type: Type.Settings };

  export interface CreateUser {
    type: Type.CreateUser;
  }

  export const CREATEUSER: CreateUser = { type: Type.CreateUser };

  export interface RepeatUser {
    type: Type.RepeatUser;
  }

  export const REPEATUSER: RepeatUser = { type: Type.RepeatUser };
}

export type Modal = (
  Modal.Settings |
  Modal.CreateUser |
  Modal.None |
  Modal.RepeatUser
);

const SectionsColumn = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: '0 0 150px',
  borderRight: `1px solid ${props.theme.borderColor}`,
}));

const SectionName = styled('span', (props: ThemeProps & SectionProps) => ({
  backgroundColor: props.selected ? `rgba(255, 255, 255, 0.1)` : undefined,
  ':hover': {
    cursor: 'pointer',
    backgroundColor: `rgba(255, 255, 255, 0.1)`
  },
  transition: 'background-color 0.2s, opacity 0.2s',
  padding: `${props.theme.itemPadding * 2}px`,
  fontWeight: props.selected ? 400 : undefined,
  userSelect: 'none',
}));

const SettingsColumn = styled(ScrollArea, {
  flex: '1 1',
});

const SettingContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: `${props.theme.itemPadding * 2}px`,
}));

const SettingInfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0',
});

const SettingInfoText = styled('span', {
  userSelect: 'none',
});

const SettingInfoSubtext = styled(SettingInfoText, {
  fontSize: '10pt',
});

interface SectionProps {
  selected?: boolean;
}

const LOCALE_OPTIONS: ComboBox.Option[] = (() => {
  const ret: ComboBox.Option[] = [];
  for (const locale of [LocalizedString.EN_US]) {
    ret.push(ComboBox.option(LocalizedString.NATIVE_LOCALE_NAMES[locale], locale));
  }
  return ret;
})();

const StyledComboBox = styled(ComboBox, {
  flex: '1 1',
});

const StyledForm = styled(Form, (props: ThemeProps) => ({
  paddingLeft: `${props.theme.itemPadding * 2}px`,
  paddingRight: `${props.theme.itemPadding * 2}px`,
}));


const OverlayContainer = styled('div', {
  position: 'relative',
});

const OverlayDialog = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
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



export class NewFileDialog extends React.PureComponent<Props, State> {
  //state = {fileName: ''};
  private editorRef: React.MutableRefObject<Editor>;
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: Modal.NONE,
      fileName: '',
      showRepeatUserDialog: false,
      settings: DEFAULT_SETTINGS,
      editorTarget: props.editorTarget,
      showEditorPage: false,
      language: props.language,
    }
  }


  private onModalClick_ = (modal: Modal) => () => this.setState({ modal });
  private onModalClose_ = () => this.setState({ modal: Modal.NONE });
  private closeRepeatUserDialog_ = () => {

    this.setState({ showRepeatUserDialog: false });
  };
  private onLocaleSelect_ = (index: number, option: ComboBox.Option) => {
    this.props.onLocaleChange(option.data as LocalizedString.Language);
  };

  private onIndentCode_ = () => {
    if (this.editorRef.current) this.editorRef.current.ivygate.formatCode();
  };


  public myComponent(props: NewFileDialogPublicProps) {
    return (props.fileName)
  }
  private onErrorClick_ = (event: React.MouseEvent<HTMLDivElement>) => {
    // not implemented
  };
  private onCodeChange = (newCode: string) => {
    console.log('Code changed:', newCode);
    // Handle code change logic
  };

  private onFinalize_ = async (values: { [id: string]: string }) => {

    console.log('Inside onFinalizeClick_ in NewFileDialog.tsx with values:', values);

    try {
      //
      // this.props.onShowEditorPage();
      //this.setState({ showEditorPage: true });
     // this.setState({ fileName: values.fileName });
      this.props.onChangeProjectName(values.fileName);
      this.props.onEditorPageOpen();

    }
    catch (error) {
      console.error('Error creating new file:', error);
    }

  };
  render() {
    const { props, state } = this;
    const {
      style,
      className,
      theme,
      onClose,
      editorConsole,
      locale,
      editorTarget,
      messages,
      onDocumentationGoToFuzzy,
      onClearConsole,
      onIndentCode,
      onDownloadCode,
      onResetCode
    } = props;
    const { modal, settings, language, showEditorPage } = state;

    const { showRepeatUserDialog } = state;
    const CREATE_NEW_FILE_FORM_ITEMS: Form.Item[] = [
      Form.fileName('fileName', 'File Name')

    ];



    const FORMS = [CREATE_NEW_FILE_FORM_ITEMS];
    return (
      <div>
        <Dialog
          theme={theme}
          name={LocalizedString.lookup(tr('Create New File'), locale)}
          onClose={onClose}
        >
          <Container theme={theme} style={style} className={className}>
            <StyledForm
              theme={theme}
              onFinalize={this.onFinalize_}
              items={CREATE_NEW_FILE_FORM_ITEMS}
              finalizeText="Create"
            />
          </Container>
        </Dialog>

      </div>

    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale
}), dispatch => ({
  onLocaleChange: (locale: LocalizedString.Language) => dispatch(I18nAction.setLocale({ locale })),
  onUserCreation: (fileName: string) => {
    dispatch(push(`/scene/${fileName}`));
  }
}))(NewFileDialog) as React.ComponentType<NewFileDialogPublicProps>;

