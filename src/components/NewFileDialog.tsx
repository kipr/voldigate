
import { ThemeProps } from './theme';
import { StyleProps } from '../style';
import { Fa } from './Fa';
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
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { push } from 'connected-react-router';

import { Editor } from './Editor';

import ProgrammingLanguage from 'ProgrammingLanguage';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import { Modal } from '../pages/Modal';

export interface NewFileDialogPublicProps extends ThemeProps, StyleProps {

  showRepeatUserDialog: boolean;

  language: ProgrammingLanguage;
  otherFileType?: string;
  projectName: string;
  userName: string;
  onClose: () => void;
  onEditorPageOpen: () => void;
  onCloseNewFileDialog: (newFileName: string, fileType: string) => void;
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
  showEditorPage: boolean;
  language: ProgrammingLanguage;
  errorMessage: string;
}

type Props = NewFileDialogPublicProps & NewFileDialogPrivateProps;
type State = NewFileDialogState;



const Container = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  color: props.theme.color,
  minHeight: '200px',
}));

const StyledForm = styled(Form, (props: ThemeProps) => ({
  paddingLeft: `${props.theme.itemPadding * 2}px`,
  paddingRight: `${props.theme.itemPadding * 2}px`,
}));

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


const NewFileContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'column',
  color: props.theme.color,
  backgroundColor: props.theme.backgroundColor,
  minHeight: '200px',
  paddingLeft: `${props.theme.itemPadding * 2}px`,
  paddingRight: `${props.theme.itemPadding * 2}px`,
}));

const OPTIONS: ComboBox.Option[] = [{
  text: 'H',
  data: 'h'
}, {
  text: 'Txt',
  data: 'txt'
}];


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
      showEditorPage: false,
      language: props.language,
      errorMessage: ''
    }
  }


  private onModalClick_ = (modal: Modal) => () => this.setState({ modal });
  private onModalClose_ = () => this.setState({ modal: Modal.NONE });
  private closeRepeatUserDialog_ = () => {

    this.setState({ showRepeatUserDialog: false });
  };




  componentDidMount() {
    console.log("Inside componentDidMount in NewFileDialog.tsx with state:", this.state);
    console.log("Inside compondidMount in NewFileDialog.tsx with props:", this.props);
  }


  private onFinalize_ = async (values: { [id: string]: string }) => {

    console.log('Inside onFinalizeClick_ in NewFileDialog.tsx with values:', values);
    console.log('Inside onFinalizeClick_ in NewFileDialog.tsx with props:', this.props);

    const { fileName } = values;
    const {projectName, userName} = this.props;
    const specialCharRegex = /[^a-zA-Z0-9 _-]/;
    const isOnlySpaces = !fileName.trim(); // Check if the name is empty or only spaces

    try {

      let finalDirectory = ''
      switch(this.props.otherFileType) {
        case 'h':
          finalDirectory = `/home/kipr/Documents/KISS/${userName}/${projectName}/include`;
          break;
        case 'c':
        case 'cpp':
        case 'py':
          finalDirectory = `/home/kipr/Documents/KISS/${userName}/${projectName}/src`;
          break;
        case 'txt':
          finalDirectory = `/home/kipr/Documents/KISS/${userName}/${projectName}/data`;
          break;

      }
      const projectData = await axios.get('/get-all-file-names', { params: { dirPath: `${finalDirectory}` } });
      console.log("NewFileDialog projectData: ", projectData);

      if (projectData.data.fileNames.some(name => name.includes(fileName))) {
        console.log("Project contains file with similar name");
        this.setState({ errorMessage: 'File name already exists. Please choose a different name.' });
        return;
      }

    }
    catch (error) {
      console.error('Error creating new file:', error);
    }

    // Check if file name exceeds 50 characters
    if (fileName.length > 50) {
      this.setState({ errorMessage: 'File name cannot exceed 50 characters.' });
      return;
    }
    if (specialCharRegex.test(fileName)) {
      this.setState({ errorMessage: 'File name contains special characters. Please use only letters, numbers, underscores, and hyphens.' });
      return;
    }
    if (isOnlySpaces) {
      this.setState({ errorMessage: "File name cannot be empty or just spaces!" });
      return;
    }
    this.setState({ errorMessage: "" }); // Clear error message if input is valid
    try {

      this.props.onCloseNewFileDialog(values.fileName, this.props.otherFileType);

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
      locale,

    } = props;


    const { errorMessage } = state;
    const CREATE_NEW_FILE_FORM_ITEMS: Form.Item[] = [
      Form.fileName('fileName', 'File Name')

    ];



    const FORMS = [CREATE_NEW_FILE_FORM_ITEMS];
    const index = OPTIONS.findIndex(option => option.data === this.state.language);
    return (
      <div>
        <Dialog
          theme={theme}
          name={LocalizedString.lookup(tr('Create New File'), locale)}
          onClose={onClose}
        >
          <NewFileContainer theme={theme} style={style} className={className}>
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
                items={CREATE_NEW_FILE_FORM_ITEMS}
                finalizeText="Create"
              />
            </Container>

          </NewFileContainer>

        </Dialog>

      </div>

    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale
}), dispatch => ({
  onLocaleChange: (locale: LocalizedString.Language) => dispatch(I18nAction.setLocale({ locale })),
 
}))(NewFileDialog) as React.ComponentType<NewFileDialogPublicProps>;

