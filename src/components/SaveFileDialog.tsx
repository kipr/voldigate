import * as React from 'react';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Dialog } from './Dialog';
import { ThemeProps, LIGHT, LIGHTMODE_YES, LIGHTMODE_NO } from './theme';
import KIPR_LOGO_BLACK from '../assets/KIPR-Logo-Black-Text-Clear-Large.png';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import tr from '@i18n';
import { connect } from 'react-redux';
import { State as ReduxState } from '../state';
import LocalizedString from '../util/LocalizedString';

export interface SaveFileDialogPublicProps extends ThemeProps, StyleProps {
  onClose: () => void;
  onConfirm: (confirmSaveName: string, confirmSaveType: string, action: string) => void;
  onDenySave: (denyType: string) => void;
  toSaveName: string;
  toSaveType: string;
}

interface SaveFileDialogPrivateProps {
  locale: LocalizedString.Language;
}
interface SaveFileDialogState {

}

type Props = SaveFileDialogPublicProps & SaveFileDialogPrivateProps;
type State = SaveFileDialogState;

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
interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const Logo = styled('img', {
  width: '150px',
  height: 'auto',
});

const LogoContainer = styled('div', {
  flex: '1 1'
});

const Container = styled('div', (props: ThemeProps) => ({
  color: props.theme.color,
  backgroundColor: props.theme.titleBarBackground,
  padding: `${props.theme.itemPadding * 2}px`,
}));

const Bold = styled('span', {
  fontWeight: 400
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
const NoContinueItem = styled(Button, (props: ThemeProps & ClickProps) => ({
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

// Styled component button for the "No, cancel" button
const NoCancelItem = styled(Button, (props: ThemeProps & ClickProps) => ({
  
  border: `1px solid black`,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: "#ffcccc",
      }
      : {},
  color: "black",

  boxShadow: '2px 2px 4px rgba(0,0,0,0.9)',
  ':active': props.onClick && !props.disabled
    ? {
        boxShadow: '1px 1px 2px rgba(0,0,0,0.7)', // Fixed incorrect commas
        transform: 'translateY(1px, 1px)', // Adds a press-down effect
      }
    : {},
}));

class SaveFileDialog extends React.PureComponent<Props, State> {

  constructor(props: Props, state: State) {
    super(props);
    this.state = {
    }
  }

  componentDidMount(): void {
    console.log("SaveFileDialog.tsx: componentDidMount with props:", this.props);
  }
  render() {
    const { props, state } = this;
    const { onClose, locale } = props;


    let logo: JSX.Element;
    const theme = LIGHT;
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
            <Bold>{LocalizedString.lookup(tr(`There are unsaved changes in your code. Save now?`), locale)}</Bold>
          </CenteredContainer>
          <br />
          <CenteredContainer>

            <BottomButtonContainer>
              <YesItem onClick={() => this.props.onConfirm(this.props.toSaveName, this.props.toSaveType, 'save')} theme={theme}>
                Yes
              </YesItem>
              <NoContinueItem onClick={() => this.props.onDenySave('continue')} theme={theme}>
                No, don't save and continue
              </NoContinueItem>
              <NoCancelItem onClick={() => this.props.onDenySave('cancel')} theme={theme}>
                No, cancel
              </NoCancelItem>
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
}))(SaveFileDialog) as React.ComponentType<SaveFileDialogPublicProps>;