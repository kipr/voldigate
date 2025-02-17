import * as React from 'react';

import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Spacer } from './common';
import { Fa } from './Fa';
import { DARK, ThemeProps,LIGHT } from './theme';

import { connect } from 'react-redux';

import { State as ReduxState } from '../state';

import KIPR_LOGO_BLACK from '../assets/KIPR-Logo-Black-Text-Clear-Large.png';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';

import LocalizedString from '../util/LocalizedString';
import ExtraMenu from './ExtraMenu';
import { Modal } from '../pages/Modal';

export interface MenuPublicProps extends StyleProps, ThemeProps { }

interface MenuPrivateProps {
  locale: LocalizedString.Language;
}

interface MenuState { }

type Props = MenuPublicProps & MenuPrivateProps;
type State = MenuState;

const Container = styled('div', (props: ThemeProps) => ({
  backgroundColor: props.theme.titleBarBackground,

  color: props.theme.color,
  width: '100%',
  height: '48px',
  lineHeight: '28px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  borderBottom: `1px solid ${props.theme.borderColor}`,
  zIndex: 1
}));

const Logo = styled('img', (props: ThemeProps & ClickProps) => ({
  width: '36px',
  height: '36px',
  marginLeft: '20px',
  marginRight: '20px',
  opacity: props.disabled ? '0.5' : '1.0',
  ':last-child': {
    borderRight: 'none'
  },
  fontWeight: 400,
  ':hover': props.onClick && !props.disabled ? {
    cursor: 'pointer',
    backgroundColor: `rgba(255, 255, 255, 0.1)`
  } : {},
  userSelect: 'none',
  transition: 'background-color 0.2s, opacity 0.2s'
}));

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}


const ExtraMenuContainer = styled('div', (props: ThemeProps) => ({
  backgroundColor: props.theme.titleBarBackground,
 
  color: props.theme.color,
  top: '20px',
  width: '100%',
  height: '48px',
  lineHeight: '28px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  borderBottom: `1px solid ${props.theme.borderColor}`,
  zIndex: 1
}));

export class MainMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  private onDocumentationClick_ = () => {
    window.open("https://www.kipr.org/doc/index.html");
  };


   private onModalClick_ = (modal: Modal) => () => this.setState({ modal });

  private onDashboardClick_ = (event: React.MouseEvent<HTMLDivElement>) => {
    window.location.href = '/';
  };


  render() {
    const { className, style, locale, theme } = this.props;
    return (
      <Container className={className} style={style} theme={theme}>
        <Logo theme={theme} src={theme.foreground === 'white' ? KIPR_LOGO_BLACK as string : KIPR_LOGO_WHITE as string} onClick={this.onDashboardClick_} />
        {/* <Spacer style={{ borderRight: `1px solid ${theme.borderColor}` }} /> */}
        <ExtraMenuContainer theme={theme}>
          <ExtraMenu
            style={{ zIndex: 9 }}
            theme={theme}

            onDocumentationClick={this.onDocumentationClick_}
            onAboutClick={this.onModalClick_(Modal.ABOUT)}

          />
        </ExtraMenuContainer>
    

      </Container>
    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale
}))(MainMenu) as React.ComponentType<MenuPublicProps>;