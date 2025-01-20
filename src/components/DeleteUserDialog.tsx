import * as React from 'react';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Dialog } from './Dialog';
import { ThemeProps } from './theme';
import { Fa } from './Fa';

import { faCopyright } from '@fortawesome/free-solid-svg-icons';

import KIPR_LOGO_BLACK from '../assets/KIPR-Logo-Black-Text-Clear-Large.png';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';

import tr from '@i18n';

import { connect } from 'react-redux';
import { State as ReduxState } from '../state';
import LocalizedString from '../util/LocalizedString';
import { sprintf } from 'sprintf-js';
import Dict from '../Dict';

export interface DeleteUserDialogPublicProps extends ThemeProps, StyleProps {
  onClose: () => void;
  onConfirm: () => void;
  onDeny: () => void;
  userName: string;
}

interface DeleteUserDialogPrivateProps {
  locale: LocalizedString.Language;
}
interface DeleteUserDialogState {
  userName: string;
}

type Props = DeleteUserDialogPublicProps & DeleteUserDialogPrivateProps;
type State = DeleteUserDialogState;

namespace Modal {
  export enum Type {
    Settings,
    CreateUser,
    DeleteUser,
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

  export interface DeleteUser {
    type: Type.DeleteUser;
  }

  export const DeleteUser: DeleteUser = { type: Type.DeleteUser };
}

export type Modal = (
  Modal.Settings |
  Modal.CreateUser |
  Modal.None |
  Modal.DeleteUser
);

const Logo = styled('img', {
  width: '150px',
  height: 'auto',
});

const LogoContainer = styled('div', {
  flex: '1 1'
});

const Container = styled('div', (props: ThemeProps) => ({
  color: props.theme.color,
  padding: `${props.theme.itemPadding * 2}px`,
}));

const Bold = styled('span', {
  fontWeight: 400
});

const Link = styled('a', (props: ThemeProps) => ({
  color: props.theme.color,
}));

const LogoRow = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '10px',
  alignItems: 'center',
});

const CopyrightContainer = styled('div', {
  flex: '1 1'
});

const CenteredContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center', // Ensures that text within the Bold component is centered
  width: '100%', // Ensures the container takes up the full width of its parent
  height: '100%', // Ensures the container takes up the full height of its parent (if required)
});
const BottomButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px', // Add some space above the button
  
});

const Button = styled('button', {
  margin: '0 10px', // Add some space to the left and right of the button
  padding: '10px 20px', // Add some padding to the button
  border: 'none', // Remove the border
  borderRadius: '5px', // Add some border radius
  cursor: 'pointer', // Change the cursor to a pointer when hovering over the button
});

class DeleteUserDialog extends React.PureComponent<Props, State> {

  constructor(props: Props, state: State) {
    super(props);
    this.state = {
      userName: ''
    }
  }

  render() {
    const { props, state } = this;
    const { theme, onClose, locale } = props;
    const { userName } = state;

    let logo: JSX.Element;

    switch (theme.foreground) {
      case 'black': {
        logo = <Logo src={KIPR_LOGO_WHITE as string} />;
        break;
      }
      case 'white': {
        logo = <Logo src={KIPR_LOGO_BLACK as string} />;
        break;
      }
    }

    return (
      <Dialog theme={theme} name={LocalizedString.lookup(tr('Are You Sure?'), locale)} onClose={onClose}>
        <Container theme={theme}>
          <br />
          <CenteredContainer>
            <Bold>{LocalizedString.lookup(tr(`Are you sure you want to delete user ${this.props.userName}?`), locale)}</Bold>
          </CenteredContainer>
          <br />
          <CenteredContainer>
            
            <BottomButtonContainer>
              <Button onClick={this.props.onConfirm}>
                Yes
              </Button>
              <Button onClick={this.props.onDeny}>
                No
              </Button>
            </BottomButtonContainer>
          </CenteredContainer>
          <br />

        </Container>
      </Dialog>
    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale,
}))(DeleteUserDialog) as React.ComponentType<DeleteUserDialogPublicProps>;