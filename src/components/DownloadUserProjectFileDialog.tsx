import * as React from 'react';
import KIPR_LOGO_BLACK from '../assets/KIPR-Logo-Black-Text-Clear-Large.png';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Dialog } from './Dialog';
import { ThemeProps } from './theme';
import { connect } from 'react-redux';
import { State as ReduxState } from '../state';
import { JSX } from 'react';
export interface DownloadUserProjectFileDialogPublicProps extends ThemeProps, StyleProps {
  toDownloadName: string;
  toDownloadType: string;
  onClose: () => void;
  onConfirm: (confirmDownloadName: string, confirmDownloadType: string, action: string) => void;
  onDeny: () => void;
}

interface DownloadUserProjectFileDialogPrivateProps {
  locale: LocalizedString.Language;
}

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}
type Props = DownloadUserProjectFileDialogPublicProps & DownloadUserProjectFileDialogPrivateProps


const Logo = styled('img', {
  width: '150px',
  height: 'auto',
});

const Container = styled('div', (props: ThemeProps) => ({
  color: props.theme.color,
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
const NoItem = styled(Button, (props: ThemeProps & ClickProps) => ({
  backgroundColor: props.theme.noButtonColor.standard,
  border: `1px solid ${props.theme.noButtonColor.border}`,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: props.theme.noButtonColor.hover,
      }
      : {},
  color:  props.theme.noButtonColor.textColor,
  textShadow:  props.theme.noButtonColor.textShadow,
  boxShadow: '2px 2px 4px rgba(0,0,0,0.9)',
  ':active': props.onClick && !props.disabled
    ? {
        boxShadow: '1px 1px 2px rgba(0,0,0,0.7)', 
        transform: 'translateY(1px, 1px)', 
      }
    : {},
}));

class DownloadUserProjectFileDialog extends React.PureComponent<Props> {

  constructor(props: Props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { props } = this;
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
            <Bold>{LocalizedString.lookup(tr(`Are you sure you want to download ${this.props.toDownloadName}?`), locale)}</Bold>
          </CenteredContainer>
          <br />
          <CenteredContainer>

            <BottomButtonContainer>
              <YesItem onClick={() => this.props.onConfirm(this.props.toDownloadName, this.props.toDownloadType, 'download')} theme={theme}>
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
}))(DownloadUserProjectFileDialog) as React.ComponentType<DownloadUserProjectFileDialogPublicProps>;