import * as React from 'react';

import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Spacer } from './common';
import { Fa } from './Fa';
import { DARK, ThemeProps } from './theme';
import { FileExplorer } from './FileExplorer';
import { faCog, faFolderTree, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import tr from '@i18n';

import { connect } from 'react-redux';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import SettingsDialog from './SettingsDialog';
import { State as ReduxState } from '../state';

import KIPR_LOGO_BLACK from '../assets/KIPR-Logo-Black-Text-Clear-Large.png';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import { signOutOfApp } from '../firebase/modules/auth';
import LocalizedString from '../util/LocalizedString';

namespace Modal {
  export enum Type {
    Settings,
    None
  }
  export interface None {
    type: Type.None;
  }

  export const NONE: None = { type: Type.None };

  export interface Settings {
    type: Type.Settings;
  }

  export const SETTINGS: Settings = { type: Type.Settings };

}
export type Modal = (
  Modal.Settings |
  Modal.None
);

export interface LeftBarPublicProps extends StyleProps, ThemeProps { }

interface LeftBarPrivateProps {
  locale: LocalizedString.Language;
}

interface LeftBarState {
  modal: Modal;
  settings: Settings;
 }

type Props = LeftBarPublicProps & LeftBarPrivateProps;
type State = LeftBarState;

const Container = styled('div', (props: ThemeProps) => ({
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
  width: '48px',
  height: '100%',
  lineHeight: '28px',
  display: 'flex',
  alignContent: 'center',

  flexDirection: 'column',
  borderRight: `1px solid ${props.theme.borderColor}`,
  zIndex: 4,


}));

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const Item = styled('div', (props: ThemeProps & ClickProps) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  borderRight: `1px solid ${props.theme.borderColor}`,

  paddingRight: '20px',
  marginBottom: '70px',
  height: '45px',
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

const ItemIcon = styled(Fa, {
  paddingLeft: '8px',
  alignItems: 'center',
  height: '30px'
});

export class LeftBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: Modal.NONE,
      settings: DEFAULT_SETTINGS,


    }
  }

  private onLogoutClick_ = (event: React.MouseEvent<HTMLDivElement>) => {
    void signOutOfApp();
  };

  private onFileExplorerClick_ = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log("onFileExplorerClick_");

  };


  private onSettingsChange_ = (changedSettings: Partial<Settings>) => {
    const nextSettings: Settings = {
      ...this.state.settings,
      ...changedSettings
    }

    this.setState({ settings: nextSettings });
  };
  
  private onModalClick_ = (modal: Modal) => () => this.setState({ modal });
  private onModalClose_ = () => this.setState({ modal: Modal.NONE });

  render() {
    const { className, style, locale } = this.props;
    const theme = DARK;
    const {
      settings,
      modal
    } = this.state;
    return (
      <>
        <Container className={className} style={style} theme={theme}>
          <Item theme={theme} onClick={this.onFileExplorerClick_}><ItemIcon icon={faFolderTree} /> </Item>

          <Spacer style={{ marginBottom: '200px', borderBottom: `1px solid ${theme.borderColor}` }} />
          <Item style={{ marginBottom: '10px' }} theme={theme} onClick={this.onModalClick_(Modal.SETTINGS)}><ItemIcon icon={faCog} /> </Item>
        </Container>
        {modal.type === Modal.Type.Settings && (
          <SettingsDialog
            theme={theme}
            settings={settings}
            onSettingsChange={this.onSettingsChange_}
            onClose={this.onModalClose_}
          />
        )}
    
      </>
    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale
}))(LeftBar) as React.ComponentType<LeftBarPublicProps>;