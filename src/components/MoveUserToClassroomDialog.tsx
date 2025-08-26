import * as React from 'react';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Dialog } from './Dialog';
import { ThemeProps, LIGHTMODE_YES, LIGHTMODE_NO, LIGHT } from './theme';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';

import Classroom from 'types/classroomTypes';
import { User } from 'types/userTypes';
import ComboBox from './ComboBox';
import ResizeableComboBox from './ResizeableComboBox';

export interface MoveUserToClassroomDialogPublicProps extends ThemeProps, StyleProps {
  onClose: () => void;
  onCloseMoveUserToClassroomDialog: (user: User, newClassroom: Classroom) => void;
  toMoveUser: User;
  classrooms: Classroom[];

}

interface MoveUserToClassroomDialogPrivateProps {
  locale: LocalizedString.Language;
}
export interface MoveUserToClassroomDialogState {
  selectedClassroom: Classroom | null;
  classroomOptions: ComboBox.Option[];
}

type Props = MoveUserToClassroomDialogPublicProps & MoveUserToClassroomDialogPrivateProps;
type State = MoveUserToClassroomDialogState;

namespace Modal {
  export enum Type {
    Settings,
    CreateUser,
    DeleteUserProjectFile,
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

  export interface DeleteUserProjectFile {
    type: Type.DeleteUserProjectFile;
  }

  export const DeleteUserProjectFile: DeleteUserProjectFile = { type: Type.DeleteUserProjectFile };
}

export type Modal = (
  Modal.Settings |
  Modal.CreateUser |
  Modal.None |
  Modal.DeleteUserProjectFile
);

const Logo = styled('img', {
  width: '150px',
  height: 'auto',
});

const Container = styled('div', (props: ThemeProps) => ({
  color: props.theme.color,
  padding: `${props.theme.itemPadding * 2}px`,
  background: props.theme.titleBarBackground
}));

const Bold = styled('span', {
  fontWeight: 400
});

const CenteredContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
  height: '100%',
});
const BottomButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px',
});

const Button = styled('button', {
  margin: '0 10px',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
});

// Styled component button for the "Yes" button
const YesItem = styled(Button, (props: ThemeProps & { onClick?: () => void; disabled?: boolean }) => ({
  backgroundColor: LIGHTMODE_YES.standard,
  border: `1px solid ${LIGHTMODE_YES.border}`,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: LIGHTMODE_YES.hover,
      }
      : {},
  color: LIGHTMODE_YES.textColor,
  textShadow: LIGHTMODE_YES.textShadow,
  boxShadow: '2px 2px 4px rgba(0,0,0,0.9)',
  ':active': props.onClick && !props.disabled
    ? {
      boxShadow: '1px 1px 2px rgba(0,0,0,0.7)',
      transform: 'translateY(1px, 1px)',
    }
    : {},
}));

// Styled component button for the "No, don't save and continue" button
const NoItem = styled(Button, (props: ThemeProps & { onClick?: () => void; disabled?: boolean }) => ({
  backgroundColor: LIGHTMODE_NO.standard,
  border: `1px solid ${LIGHTMODE_NO.border}`,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: LIGHTMODE_NO.hover,
      }
      : {},
  color: LIGHTMODE_NO.textColor,
  textShadow: LIGHTMODE_NO.textShadow,
  boxShadow: '2px 2px 4px rgba(0,0,0,0.9)',
  ':active': props.onClick && !props.disabled
    ? {
      boxShadow: '1px 1px 2px rgba(0,0,0,0.7)',
      transform: 'translateY(1px, 1px)',
    }
    : {},
}));

const StyledComboBox = styled(ResizeableComboBox, {

 
});
class MoveUserToClassroomDialog extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedClassroom: this.props.classrooms.filter(c => c.name !== this.props.toMoveUser.classroomName)[0] || null,
      classroomOptions: this.CLASS_OPTIONS,

    }
  }


  CLASS_OPTIONS: ComboBox.Option[] = (() => {
    const ret: ComboBox.Option[] = [];
    console.log("MoveUserToClassroomDialog CLASS_OPTIONS props.classrooms:", this.props.classrooms);
    console.log("MoveUserToClassroomDialog CLASS_OPTIONS props.toMoveUser:", this.props.toMoveUser);
    const classroomsArray = Object.values(this.props.classrooms);
    for (const classroom of classroomsArray) {
      const classroomName = LocalizedString.lookup(tr(`${classroom.name}`), this.props.locale);
      if (classroomName && classroomName !== this.props.toMoveUser.classroomName) {
        ret.push({
          data: classroom,
          text: classroomName
        });
      } else {
        console.error(`Classroom ${classroom.name} has an invalid localized name.`);
      }
    }
    return ret;
  })();


  private onClassroomSelect_ = (index: number, option: ComboBox.Option) => {
    console.log("MoveUserToClassroomDialog onClassroomSelect_ props:", this.props);
    console.log("MoveUserToClassroomDialog onClassroomSelect_ option:", option);
    this.setState({
      selectedClassroom: option.data as Classroom,
    });

  };

  render() {
    const { props, state } = this;
    const { theme, onClose, locale } = props;
    const { selectedClassroom, classroomOptions } = state;

    const classroomIndex = classroomOptions.findIndex(option => option.data === selectedClassroom);

    return (
      <Dialog theme={theme} name={LocalizedString.lookup(tr('Move Classrooms'), locale)} onClose={onClose}>
        <Container theme={theme}>
          <br />
          <CenteredContainer>
            <Bold>{LocalizedString.lookup(tr(`What classroom do you want to move ${this.props.toMoveUser.userName} to?`), locale)}</Bold>

          </CenteredContainer>
          <CenteredContainer style ={{gap: '10px', marginTop: "0.8em"}}>
             <Bold>{LocalizedString.lookup(tr(`New Classroom: `), locale)}</Bold>

            <StyledComboBox
              options={this.CLASS_OPTIONS}
              index={classroomIndex}
              onSelect={this.onClassroomSelect_}
              theme={theme}
              mainWidth='17.5em'
            />
          </CenteredContainer>
          <br />
          <CenteredContainer>

            <BottomButtonContainer>
              <YesItem onClick={() => this.props.onCloseMoveUserToClassroomDialog(this.props.toMoveUser, this.state.selectedClassroom)} theme={theme}>
                Move User
              </YesItem>
             
            </BottomButtonContainer>
          </CenteredContainer>
          <br />

        </Container>
      </Dialog>
    );
  }
}

export default MoveUserToClassroomDialog;