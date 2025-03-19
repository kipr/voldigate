import * as React from 'react';
import axios from 'axios';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import ComboBox from './ComboBox';
import Form from './Form';
import ProgrammingLanguage from '../ProgrammingLanguage';
import { InterfaceMode } from '../types/interfaceModes';
import { ThemeProps } from './theme';
import { StyleProps } from '../style';
import { styled } from 'styletron-react';
import { Dialog } from './Dialog';
import { State as ReduxState } from '../state';
import { I18nAction } from '../state/reducer';
import { connect } from 'react-redux';
import { Modal } from '../pages/Modal';
import { Fa } from './Fa';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export interface CreateProjectDialogPublicProps extends ThemeProps, StyleProps {
  showRepeatUserDialog: boolean;
  userName: string;
  language: string;
  projectName: string;
  onClose: () => void;
  onChangeProjectName: (name: string) => void;
  onLanguageChange: (language: ProgrammingLanguage) => void;
  closeProjectDialog: (newProjName: string, newProjLanguage: ProgrammingLanguage, newInterfaceMode: InterfaceMode) => void;
  onDocumentationSetLanguage: (language: 'c' | 'python') => void;
}

interface CreateProjectDialogPrivateProps {
  locale: LocalizedString.Language;

}

interface CreateProjectDialogState {
  userName: string;
  modal: Modal;
  showRepeatProjectDialog: boolean;
  language: string;
  interfaceMode: InterfaceMode;
  errorMessage: string;
}

type Props = CreateProjectDialogPublicProps & CreateProjectDialogPrivateProps;
type State = CreateProjectDialogState;

const Container = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  color: props.theme.color,
  minHeight: '200px',
}));

const ComboBoxLabel = styled('label', (theme: ThemeProps) => ({
  display: 'block',
  color: theme.theme.color,
  fontSize: '1.1em',
  fontWeight: 'normal',
  marginTop: `${theme.theme.itemPadding * 2}px`,
  marginBottom: `${theme.theme.itemPadding}px`,
  marginRight: `${theme.theme.itemPadding}px`,
  userSelect: 'none'
}));

const ComboBoxContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  color: props.theme.color,
  spacing: '10px',
  minHeight: '30px',
  marginLeft: '8px',
  marginRight: '8px',
  marginBottom: '8px',
}));

const NewProjectContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'column',
  color: props.theme.color,
  backgroundColor: props.theme.backgroundColor,
  minHeight: '200px',
  paddingLeft: `${props.theme.itemPadding * 2}px`,
  paddingRight: `${props.theme.itemPadding * 2}px`,
  paddingTop: `${props.theme.itemPadding * 2}px`,
}));

const StyledComboBox = styled(ComboBox, {
  flex: '1 0',
});

const StyledForm = styled(Form, (props: ThemeProps) => ({
  paddingLeft: `${props.theme.itemPadding * 2}px`,
  paddingRight: `${props.theme.itemPadding * 2}px`,
}));

const LANGUAGE_OPTIONS: ComboBox.Option[] = [{
  text: 'C',
  data: 'c'
}, {
  text: 'C++',
  data: 'cpp'
}, {
  text: 'Python',
  data: 'python'
}];


const INTERFACE_OPTIONS: ComboBox.Option[] = [{
  text: 'Simple',
  data: 'Simple'
}, {
  text: 'Advanced',
  data: 'Advanced'

}];

const ErrorMessageContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: 'red',
  color: 'white',
  height: '40px',
  alignItems: 'center',
  marginTop: '10px',
}));

const ItemIcon = styled(Fa, {
  paddingLeft: '10px',
  paddingRight: '10px',
  alignItems: 'center',
  height: '30px'
});

export class CreateProjectDialog extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: Modal.NONE,
      userName: this.props.userName,
      showRepeatProjectDialog: false,
      language: 'c',
      errorMessage: '',
      interfaceMode: InterfaceMode.SIMPLE
    }
  }

  componentDidMount(): void {
    console.log("CreateProjectDialog state: ", this.state);
  }

  private onSelectLanguage_ = (languageIndex: number, option: ComboBox.Option) => {
    this.onLanguageChange(option.data as ProgrammingLanguage);
  };

  private onSelectInterface_ = (interfaceIndex: number, option: ComboBox.Option) => {
    this.onInterfaceChange(option.data as InterfaceMode);
  };


  private onLanguageChange = (language: ProgrammingLanguage) => {
    this.setState({
      language: language
    });
  };

  private onInterfaceChange = (interfaceMode: InterfaceMode) => {
    this.setState({
      interfaceMode: interfaceMode
    }, () => {
      console.log("Interface Mode: ", this.state.interfaceMode);
    });
  };


  onFinalize_ = async (values: { [id: string]: string }) => {

    console.log("CreateProjectDialog onFinalize_ state: ", this.state);

    const projectName = values.projectName;

    const specialCharRegex = /[^a-zA-Z0-9 _-]/;
    const isOnlySpaces = !projectName.trim(); // Check if the name is empty or only spaces

    // Check if project name exceeds 50 characters
    if (projectName.length > 50) {
      this.setState({ errorMessage: 'Project name cannot exceed 50 characters.' });
      return;
    }
    if (specialCharRegex.test(projectName)) {
      this.setState({ errorMessage: 'Project name contains special characters. Please use only letters, numbers, underscores, and hyphens.' });
      return;
    }
    if (isOnlySpaces) {
      this.setState({ errorMessage: "Project name cannot be empty or just spaces!" });
      return;
    }
    this.setState({ errorMessage: "" }); // Clear error message if input is valid
    try {

      const response = await axios.post('/initialize-repo', { userName: this.props.userName, projectName: values.projectName, language: this.state.language as ProgrammingLanguage, interfaceMode: this.state.interfaceMode });
      console.log("initialize-repo Response: ", response);

      if (response.status === 200) {
        this.props.closeProjectDialog(values.projectName, this.state.language as ProgrammingLanguage, this.state.interfaceMode);
      }

    }
    catch (error) {
      console.error('Error adding user to database:', error);
    }

  };

  public myComponent(props: CreateProjectDialogPublicProps) {
    return (props.projectName)
  }

  render() {
    const { props, state } = this;
    const { style, className, theme, onClose, locale } = props;
    const { errorMessage } = state;
    const CREATEPROJECT_FORM_ITEMS: Form.Item[] = [
      Form.projectName('projectName', 'Project Name')
    ];

    const languageIndex = LANGUAGE_OPTIONS.findIndex(option => option.data === this.state.language);
    
    const interfaceIndex = INTERFACE_OPTIONS.findIndex(option => option.data === this.state.interfaceMode);

    return (
      <div>
        <Dialog
          theme={theme}
          name={LocalizedString.lookup(tr('Create New Project'), locale)}
          onClose={onClose}
        >
          <NewProjectContainer theme={theme} style={style} className={className}>
            <ComboBoxContainer theme={theme} style={style} className={className}>
              <ComboBoxLabel theme={theme}>Language:</ComboBoxLabel>
              <StyledComboBox
                theme={theme}
                onSelect={this.onSelectLanguage_}
                options={LANGUAGE_OPTIONS}
                index={languageIndex}
              />
            </ComboBoxContainer>

            {/* Show error message if it exists */}
            {errorMessage && (
              <ErrorMessageContainer theme={theme}>
                <ItemIcon icon={faExclamationTriangle} />
                <div style={{ fontWeight: 450 }}>
                  {state.errorMessage}
                </div>

              </ErrorMessageContainer>
            )}

            <ComboBoxContainer theme={theme} style={style} className={className}>
              <ComboBoxLabel theme={theme}>Interface Mode:</ComboBoxLabel>
              <StyledComboBox
                theme={theme}
                onSelect={this.onSelectInterface_}
                options={INTERFACE_OPTIONS}
                index={interfaceIndex}
              />
            </ComboBoxContainer>

            <Container theme={theme} style={style} className={className}>
              <StyledForm
                theme={theme}
                onFinalize={this.onFinalize_}
                items={CREATEPROJECT_FORM_ITEMS}
                finalizeText="Create"
              />
            </Container>

          </NewProjectContainer>

        </Dialog>

      </div>

    );
  }
}

export default CreateProjectDialog;