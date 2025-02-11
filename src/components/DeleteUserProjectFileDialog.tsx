import * as React from 'react';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Dialog } from './Dialog';
import { ThemeProps, LIGHTMODE_YES,LIGHTMODE_NO,LIGHT } from './theme';
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

export interface DeleteUserProjectFileDialogPublicProps extends ThemeProps, StyleProps {
  onClose: () => void;
  onConfirm: (confirmDeleteName: string, confirmDeleteType: string, action: string) => void;
  onDeny: () => void;
  toDeleteName: string;
  toDeleteType: string;
}

interface DeleteUserProjectFileDialogPrivateProps {
  locale: LocalizedString.Language;
}
interface DeleteUserProjectFileDialogState {

}
interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}
type Props = DeleteUserProjectFileDialogPublicProps & DeleteUserProjectFileDialogPrivateProps;
type State = DeleteUserProjectFileDialogState;

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

const LogoContainer = styled('div', {
  flex: '1 1'
});

const Container = styled('div', (props: ThemeProps) => ({
  color: props.theme.color,
  padding: `${props.theme.itemPadding * 2}px`,
  background: props.theme.titleBarBackground
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


// Styled component button for the "Yes" button
const YesItem = styled(Button, (props: ThemeProps & ClickProps) => ({
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
      boxShadow: '1px 1px 2px rgba(0,0,0,0.7)', // Fixed incorrect commas
      transform: 'translateY(1px, 1px)', // Adds a press-down effect
    }
    : {},
}));

// Styled component button for the "No, don't save and continue" button
const NoItem = styled(Button, (props: ThemeProps & ClickProps) => ({
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
        boxShadow: '1px 1px 2px rgba(0,0,0,0.7)', // Fixed incorrect commas
        transform: 'translateY(1px, 1px)', // Adds a press-down effect
      }
    : {},
}));


class DeleteUserProjectFileDialog extends React.PureComponent<Props, State> {

  constructor(props: Props, state: State) {
    super(props);
    this.state = {
      }
  }

  componentDidMount(): void {
    console.log("DeleteUserProjectFileDialog.tsx: componentDidMount with props:", this.props);  
  }
  render() {
    const { props, state } = this;
    const { theme, onClose, locale } = props;


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
            <Bold>{LocalizedString.lookup(tr(`Are you sure you want to delete ${this.props.toDeleteName}?`), locale)}</Bold>
          </CenteredContainer>
          <br />
          <CenteredContainer>
            
            <BottomButtonContainer>
              <YesItem onClick={() => this.props.onConfirm(this.props.toDeleteName, this.props.toDeleteType, 'delete')} theme={theme}>
                Yes
              </YesItem>
              <NoItem onClick={this.props.onDeny} theme={theme}>
                No
              </NoItem>
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
}))(DeleteUserProjectFileDialog) as React.ComponentType<DeleteUserProjectFileDialogPublicProps>;