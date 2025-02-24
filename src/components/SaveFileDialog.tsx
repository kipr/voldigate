import * as React from 'react';
import KIPR_LOGO_BLACK from '../assets/KIPR-Logo-Black-Text-Clear-Large.png';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Dialog } from './Dialog';
import { ThemeProps, LIGHT, LIGHTMODE_YES, LIGHTMODE_NO } from './theme';
import { connect } from 'react-redux';
import { State as ReduxState } from '../state';

export interface SaveFileDialogPublicProps extends ThemeProps, StyleProps {
  toSaveName: string;
  toSaveType: string;
  onClose: () => void;
  onConfirm: (confirmSaveName: string, confirmSaveType: string, action: string) => void;
  onDenySave: (denyType: string) => void;
}

interface SaveFileDialogPrivateProps {
  locale: LocalizedString.Language;
}

type Props = SaveFileDialogPublicProps & SaveFileDialogPrivateProps;

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const Logo = styled('img', {
  width: '150px',
  height: 'auto',
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

// Styled component button for the "No, don't save and continue" button
const NoContinueItem = styled(Button, (props: ThemeProps & ClickProps) => ({
  backgroundColor: props.theme.noButtonColor.standard,
  border: `1px solid ${props.theme.noButtonColor.border}`,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: props.theme.noButtonColor.hover,
      }
      : {},
  color: props.theme.noButtonColor.textColor,
  textShadow: props.theme.noButtonColor.textShadow,
  boxShadow: '2px 2px 4px rgba(0,0,0,0.9)',
  ':active': props.onClick && !props.disabled
    ? {
      boxShadow: '1px 1px 2px rgba(0,0,0,0.7)',
      transform: 'translateY(1px, 1px)',
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
      boxShadow: '1px 1px 2px rgba(0,0,0,0.7)', 
      transform: 'translateY(1px, 1px)', 
    }
    : {},
}));

class SaveFileDialog extends React.PureComponent<Props> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    const { props } = this;
    const { onClose, locale, theme } = props;

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