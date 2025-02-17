
import { ThemeProps } from './theme';
import { StyleProps } from '../style';
import axios from 'axios';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import * as React from 'react';
import ComboBox from './ComboBox';
import { styled } from 'styletron-react';
import { Dialog } from './Dialog';
import { State as ReduxState } from '../state';
import { I18nAction } from '../state/reducer';
import { connect } from 'react-redux';
import Form from './Form';
import { Modal } from '../pages/Modal';
import { Fa } from './Fa';
import ProgrammingLanguage from '../ProgrammingLanguage';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';


export interface CreateProjectDialogPublicProps extends ThemeProps, StyleProps {
  onClose: () => void;
  showRepeatUserDialog: boolean;
  userName: string;
  language: string;
  projectName: string;
  onChangeProjectName: (name: string) => void;
  onLanguageChange: (language: ProgrammingLanguage) => void;
  closeProjectDialog: (newProjName: string, newProjLanguage: ProgrammingLanguage) => void;
  onDocumentationSetLanguage: (language: 'c' | 'python') => void;

}

interface CreateProjectDialogPrivateProps {
  locale: LocalizedString.Language;
  onLocaleChange: (locale: LocalizedString.Language) => void;
  onUserCreation: (userName: string) => void;
}

interface CreateProjectDialogState {
  userName: string;
  modal: Modal;
  showRepeatProjectDialog: boolean;
  language: string;
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

const OPTIONS: ComboBox.Option[] = [{
  text: 'C',
  data: 'c'
}, {
  text: 'C++',
  data: 'cpp'
}, {
  text: 'Python',
  data: 'python'
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
      errorMessage: ''
    }
    console.log(" CreateProjectDialog.tsx constructor with state language:", this.state.language);
  }


  componentDidMount() {
    console.log("Inside CreateProjectDialog.tsx mount with state Username:", this.props.userName);
    console.log("CreateProjectDialog compDidMount theme: ", this.props.theme);
  }
  private onSelect_ = (index: number, option: ComboBox.Option) => {
    console.log("Selected index: ", index);
    console.log("Selected option: ", option);
    this.onLanguageChange(option.data as ProgrammingLanguage);
  };

  private onLanguageChange = (language: ProgrammingLanguage) => {
    this.setState({
      language: language
    }, () => {
      console.log("Updated language to: ", this.state.language);
    });

  };
  onFinalize_ = async (values: { [id: string]: string }) => {

    console.log('Inside onFinalizeClick_ in CreateProjectDialog.tsx with values:', values);
    console.log("Inside CreateProjectDialog.tsx with state Username:", this.props.userName);

    const projectName = values.projectName;

    const specialCharRegex = /[^a-zA-Z0-9 _-]/;
    const isOnlySpaces = !projectName.trim(); // Check if the name is empty or only spaces

    // Check if project name exceeds 100 characters
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

      const response = await axios.post('/initialize-repo', { userName: this.props.userName, projectName: values.projectName, language: this.state.language as ProgrammingLanguage });
      console.log("initialize-repo Response: ", response);

      if (response.status === 200) {
        console.log("closeProjectDialog language: ", this.state.language);
        this.props.closeProjectDialog(values.projectName, this.state.language as ProgrammingLanguage);
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

    const index = OPTIONS.findIndex(option => option.data === this.state.language);

    console.log("CreateProjectdialog render theme: ", theme);
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
                onSelect={this.onSelect_}
                options={OPTIONS}
                index={index}>
              </StyledComboBox>
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

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale
}), dispatch => ({
  onLocaleChange: (locale: LocalizedString.Language) => dispatch(I18nAction.setLocale({ locale })),

}))(CreateProjectDialog) as React.ComponentType<CreateProjectDialogPublicProps>;


