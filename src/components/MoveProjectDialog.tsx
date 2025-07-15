import * as React from 'react';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import Form from './Form';
import axios from 'axios';
import { InterfaceMode } from '../types/interfaceModes';
import { ThemeProps } from './theme';
import { StyleProps } from '../style';
import { styled } from 'styletron-react';
import { Dialog } from './Dialog';
import { Project } from '../types/projectTypes';
import { User } from '../types/userTypes';
import { Modal } from '../pages/Modal';
import { Fa } from './Fa';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import ResizeableComboBox from './ResizeableComboBox';
import ComboBox from './ComboBox';

export interface MoveProjectDialogPublicProps extends ThemeProps, StyleProps {
  user: User;
  users: User[];
  project: Project;
  toRenameName: string;
  toRenameType: string;
  onClose: () => void;
  onCloseMoveProjectDialog: (newUser: User) => void;
}

interface MoveProjectDialogPrivateProps {
  locale: LocalizedString.Language;
}

interface MoveProjectDialogState {
  modal: Modal;
  showRepeatProjectDialog: boolean;
  language: string;
  interfaceMode: InterfaceMode;
  errorMessage: string;
  userOptions: ComboBox.Option[];
  selectedUser: User;
}

type Props = MoveProjectDialogPublicProps & MoveProjectDialogPrivateProps;
type State = MoveProjectDialogState;

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const StyledResizeableComboBox = styled(ResizeableComboBox, {
  flex: '1 0',
  padding: '3px',
});

const MoveProjectContainer = styled('div', (props: ThemeProps) => ({
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
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
  height: '100%',
  gap: '10px',
  marginBottom: '1.5em',
  marginTop: '1em',
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

const Button = styled('button', {
  margin: '0 10px',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
});

// Styled component button for the "Yes" button
const YesItem = styled(Button, (props: ThemeProps & ClickProps) => ({
  backgroundColor: props.theme.yesButtonColor.standard,
  border: `1px solid ${props.theme.yesButtonColor.border}`,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: props.theme.yesButtonColor.hover,
      }
      : {},
  color: props.theme.yesButtonColor.textColor,
  textShadow: props.theme.yesButtonColor.textShadow,
  boxShadow: '2px 2px 4px rgba(0,0,0,0.9)',
  ':active': props.onClick && !props.disabled
    ? {
      boxShadow: '1px 1px 2px rgba(0,0,0,0.7)',
      transform: 'translateY(1px, 1px)',
    }
    : {},
}));


export class MoveProjectDialog extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: Modal.NONE,
      showRepeatProjectDialog: false,
      language: 'c',
      errorMessage: '',
      interfaceMode: InterfaceMode.SIMPLE,
      userOptions: props.users
        .filter(user => user.userName !== props.user.userName) // ✅ exclude current user
        .map(user => ({
          data: user.userName,
          text: user.userName,
        })),
      selectedUser: props.users.length > 0 ? props.users
        .filter(user => user.userName !== props.user.userName)[0] : null,
    }
  }

  componentDidMount(): void {
    console.log("MoveProjectDialog mounted");
    console.log("MoveProjectDialog props", this.props);
    this.setState({
      userOptions: this.props.users.map(user => ({
        data: user.userName,
        text: user.userName,
      })),


    });
  }
  onFinalize_ = async () => {

    console.log("MoveProjectDialog onFinalize_ props", this.props);
    console.log("MoveProjectDialog onFinalize_ state", this.state);

    const { user, project } = this.props;
    const { selectedUser } = this.state;

    const moveProjectResponse = await axios.post('/move-project', { user, project, newUser: selectedUser });
    console.log("MoveProjectDialog onFinalize_ moveProjectResponse", moveProjectResponse);
    if (moveProjectResponse.status === 200) {
      console.log("MoveProjectDialog onFinalize_ project moved successfully");
      this.props.onCloseMoveProjectDialog(selectedUser);
    } else {
      console.error("MoveProjectDialog onFinalize_ error moving project", moveProjectResponse);
      this.setState({ errorMessage: "Error moving project. Please try again." });
    }
  
  };
  USER_OPTIONS: ComboBox.Option[] = (() => {
    const ret: ComboBox.Option[] = [];

    for (const user of this.props.users) {
      const userName = LocalizedString.lookup(tr(`${user.userName}`), this.props.locale);
      if (userName && userName !== this.props.user.userName) {
        ret.push({
          data: user,
          text: userName
        });
      }
    }
    console.log("MoveProjectDialog USER_OPTIONS ret", ret);
    return ret;
  })();

  onUserSelect_ = (index: number, option: ResizeableComboBox.Option): void => {
    console.log("MoveProjectDialog onUserSelect_ index", index, "option", option);

    const selectedUser = option.data as User;

    if(selectedUser) {
      this.setState({ selectedUser });
    }
  };
  render() {
    const { props, state } = this;
    const { style, className, theme, onClose, locale, project, users } = props;
    const { errorMessage, userOptions, selectedUser } = state;
    console.log("MoveProjectDialog render userOptions", userOptions);
    console.log("MoveProjectDialog render selectedUser", selectedUser);
    console.log("MoveProjectDialog render users:", users);
    console.log("MoveProjectDialog render USEROPTIONS", this.USER_OPTIONS);
    const userIndex = this.USER_OPTIONS.findIndex(option => option.text === selectedUser.userName);
    console.log("MoveProjectDialog render userIndex", userIndex);

    return (
      <Dialog
        theme={theme}
        name={LocalizedString.lookup(tr('Move Project'), locale)}
        onClose={onClose}
      >
        <MoveProjectContainer theme={theme} style={style} className={className}>
          <CenteredContainer>
            <Bold>{LocalizedString.lookup(tr(`Move project ${this.props.project.projectName} to: `), locale)}</Bold>
            <StyledResizeableComboBox
              options={this.USER_OPTIONS}
              index={userIndex}
              onSelect={this.onUserSelect_}
              theme={theme}
              mainWidth={'8.3em'}
              mainHeight={'1.2em'}
              mainFontSize={'1em'}
            />



          </CenteredContainer>

          {errorMessage && (
            <ErrorMessageContainer theme={theme}>
              <ItemIcon icon={faExclamationTriangle} />
              <div style={{ fontWeight: 450 }}>
                {state.errorMessage}
              </div>

            </ErrorMessageContainer>
          )}
          <YesItem theme={theme} onClick={() => this.onFinalize_()}>
            {LocalizedString.lookup(tr(`Move project ${this.props.project.projectName} to ${this.state.selectedUser.userName}  `), locale)}
          </YesItem>


        </MoveProjectContainer>

      </Dialog>

    );
  }
}

export default MoveProjectDialog;