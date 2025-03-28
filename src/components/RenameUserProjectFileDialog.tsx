import * as React from 'react';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import ComboBox from './ComboBox';
import Form from './Form';
import axios from 'axios';
import ProgrammingLanguage from '../ProgrammingLanguage';
import { InterfaceMode } from '../types/interfaceModes';
import { ThemeProps } from './theme';
import { StyleProps } from '../style';
import { styled } from 'styletron-react';
import { Dialog } from './Dialog';
import { BLANK_PROJECT, Project } from '../types/projectTypes';
import { User } from '../types/userTypes';
import { Modal } from '../pages/Modal';
import { Fa } from './Fa';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { JSX } from 'react';

export interface RenameUserProjectFileDialogPublicProps extends ThemeProps, StyleProps {
  user: User;
  project: Project;
  toRenameName: string;
  toRenameType: string;
  onClose: () => void;
  onCloseRenameUserProjectFileDialog: (renamedType: string, user: User, renamedData: {}) => void;

}

interface RenameUserProjectFileDialogPrivateProps {
  locale: LocalizedString.Language;

}

interface RenameUserProjectFileDialogState {
  modal: Modal;
  showRepeatProjectDialog: boolean;
  language: string;
  interfaceMode: InterfaceMode;
  errorMessage: string;
}

type Props = RenameUserProjectFileDialogPublicProps & RenameUserProjectFileDialogPrivateProps;
type State = RenameUserProjectFileDialogState;

const Container = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'row',
  color: props.theme.color,
  minHeight: '200px',
}));

const RenameContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'column',
  color: props.theme.color,
  backgroundColor: props.theme.backgroundColor,
  minHeight: '200px',
  paddingLeft: `${props.theme.itemPadding * 2}px`,
  paddingRight: `${props.theme.itemPadding * 2}px`,
  paddingTop: `${props.theme.itemPadding * 2}px`,
}));

const StyledForm = styled(Form, (props: ThemeProps) => ({
  paddingLeft: `${props.theme.itemPadding * 2}px`,
  paddingRight: `${props.theme.itemPadding * 2}px`,
}));


const CenteredContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
  height: '100%',
});

const Bold = styled('span', {
  fontWeight: 400
});


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

export class RenameUserProjectFileDialog extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: Modal.NONE,
      showRepeatProjectDialog: false,
      language: 'c',
      errorMessage: '',
      interfaceMode: InterfaceMode.SIMPLE
    }
  }

  componentDidMount(): void {
    console.log("RenameUserProjectFileDialog state: ", this.state);
    console.log("RenameUserProjectFileDialog props: ", this.props);
  }


  onFinalize_ = async (values: { [id: string]: string }) => {
    console.log("RenameUserProjectFileDialog onFinalize_ state: ", this.state);
    console.log("RenameUserProjectFileDialog values: ", values);

    let changedName: string;
    if (this.props.toRenameType === "User") {
      changedName = values.userName;
    }
    else if (this.props.toRenameType === "Project") {
      changedName = values.projectName;
    }
    else if (this.props.toRenameType === "File") {
      changedName = values.fileName;
    }

    const specialCharRegex = /[^a-zA-Z0-9 _-]/;
    const isOnlySpaces = !changedName.trim(); // Check if the name is empty or only spaces

    // Check if project name exceeds 50 characters
    if (changedName.length > 50) {
      this.setState({ errorMessage: `${this.props.toRenameType} name cannot exceed 50 characters.` });
      return;
    }
    if (specialCharRegex.test(changedName)) {
      this.setState({ errorMessage: `${this.props.toRenameType} name contains special characters. Please use only letters, numbers, underscores, and hyphens.` });
      return;
    }
    if (isOnlySpaces) {
      this.setState({ errorMessage: `${this.props.toRenameType} name cannot be empty or just spaces!` });
      return;
    }
    this.setState({ errorMessage: "" }); // Clear error message if input is valid


    if (this.props.toRenameType === "User") {

      try {
        const renameUserResponse = await axios.post('/rename', { renameType: 'User', oldUserName: this.props.toRenameName, newUserName: values.userName });

        console.log("Rename User Response: ", renameUserResponse.data);

        if(renameUserResponse.request.status === 200) { //success
          this.props.onCloseRenameUserProjectFileDialog("User",this.props.user, renameUserResponse.data);
        }

      }
      catch (error) {
        if (error.response && error.response.status === 409) {
          console.log("INSIDE ERROR");
          this.setState({ errorMessage: 'User name already exists. Please choose a different name.' });
          return;
        }

      }
    }
    else if (this.props.toRenameType === "Project") {
      try {
        const renameProjectResponse = await axios.post('/rename', { renameType: 'Project', userName: this.props.user.userName, oldProjectName: this.props.toRenameName, newProjectName: values.projectName });
        console.log("Rename Project Response: ", renameProjectResponse.data);
        if(renameProjectResponse.request.status === 200) { //success
          this.props.onCloseRenameUserProjectFileDialog("Project",this.props.user, renameProjectResponse.data);
        }
      }
      catch (error) {
        console.error("Error renaming project: ", error);
      }
    }
    else if (this.props.toRenameType === "File") {
      try {
        const [file, extension] = this.props.toRenameName.split('.');
        const renameFileResponse = await axios.post('/rename', { renameType: 'File', userName: this.props.user.userName, projectName: this.props.project.projectName, oldFileName: this.props.toRenameName, newFileName: `${values.fileName}.${extension}` });
        console.log("Rename File Response: ", renameFileResponse.data);
        if(renameFileResponse.request.status === 200) { //success
          this.props.onCloseRenameUserProjectFileDialog("File",this.props.user, renameFileResponse.data);
        }
      }
      catch (error) {
        console.error("Error renaming file: ", error);
      }
    }
  };


  render() {
    const { props, state } = this;
    const { style, className, theme, onClose, locale } = props;
    const { errorMessage } = state;
    const RENAMEUSER_FORM_ITEMS: Form.Item[] = [
      Form.username('userName', 'User Name')
    ];
    const RENAMEPROJECT_FORM_ITEMS: Form.Item[] = [
      Form.projectName('projectName', 'Project Name')
    ];
    const RENAMEFILE_FORM_ITEMS: Form.Item[] = [
      Form.fileName('fileName', 'File Name')
    ];


    let renameUserContent: JSX.Element;

    renameUserContent = (
      <Dialog
        theme={theme}
        name={LocalizedString.lookup(tr('Rename User'), locale)}
        onClose={onClose}
      >
        <RenameContainer theme={theme} style={style} className={className}>
          <CenteredContainer>
            <Bold>{LocalizedString.lookup(tr(`Rename User ${this.props.toRenameName} to: `), locale)}</Bold>

          </CenteredContainer>
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
              items={RENAMEUSER_FORM_ITEMS}
              finalizeText="Create"
            />
          </Container>

        </RenameContainer>

      </Dialog>
    );

    let renameProjectContent: JSX.Element;

    renameProjectContent = (
      <Dialog
        theme={theme}
        name={LocalizedString.lookup(tr('Rename Project'), locale)}
        onClose={onClose}
      >
        <RenameContainer theme={theme} style={style} className={className}>
          <CenteredContainer>
            <Bold>{LocalizedString.lookup(tr(`Rename Project ${this.props.toRenameName} to: `), locale)}</Bold>

          </CenteredContainer>
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
              items={RENAMEPROJECT_FORM_ITEMS}
              finalizeText="Create"
            />
          </Container>

        </RenameContainer>

      </Dialog>
    );

    let renameFileContent: JSX.Element;

    renameFileContent = (
      <Dialog
        theme={theme}
        name={LocalizedString.lookup(tr('Rename File'), locale)}
        onClose={onClose}
      >
        <RenameContainer theme={theme} style={style} className={className}>
          <CenteredContainer>
            <Bold>{LocalizedString.lookup(tr(`Rename File ${this.props.toRenameName} to: `), locale)}</Bold>

          </CenteredContainer>
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
              items={RENAMEFILE_FORM_ITEMS}
              finalizeText="Create"
            />
          </Container>

        </RenameContainer>

      </Dialog>
    );


    const panelContents = {
      User: renameUserContent,
      Project: renameProjectContent,
      File: renameFileContent
    }

    return (
      <div>
        {panelContents[this.props.toRenameType]}

      </div>

    );
  }
}

export default RenameUserProjectFileDialog;