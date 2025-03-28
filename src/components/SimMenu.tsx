import * as React from 'react';

import { styled, withStyleDeep } from 'styletron-react';
import { StyleProps } from '../style';
import { Spacer } from './common';
import { Fa } from './Fa';
import { Layout, LayoutPicker } from './Layout';
import { SimulatorState } from './SimulatorState';
import { GREEN, RED, ThemeProps } from './theme';

import tr from '@i18n';

import { connect } from 'react-redux';

import { State as ReduxState } from '../state';
import { JSX } from 'react';
import KIPR_LOGO_BLACK from '../assets/KIPR-Logo-Black-Text-Clear-Large.png';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import { faBars,faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

import ExtraMenu from './ExtraMenu';
import LocalizedString from '../util/LocalizedString';

namespace SubMenu {
  export enum Type {
    None,
    LayoutPicker,
    SceneMenu,
    ExtraMenu,
  }

  export interface None {
    type: Type.None;
  }

  export const NONE: None = { type: Type.None };

  export interface LayoutPicker {
    type: Type.LayoutPicker;
  }

  export const LAYOUT_PICKER: LayoutPicker = { type: Type.LayoutPicker };

  export interface SceneMenu {
    type: Type.SceneMenu;
  }

  export const SCENE_MENU: SceneMenu = { type: Type.SceneMenu };

  export interface ExtraMenu {
    type: Type.ExtraMenu;
  }

  export const EXTRA_MENU: ExtraMenu = { type: Type.ExtraMenu };
}

type SubMenu =
  | SubMenu.None
  | SubMenu.LayoutPicker
  | SubMenu.SceneMenu
  | SubMenu.ExtraMenu;

export interface MenuPublicProps extends StyleProps, ThemeProps {
  layout: Layout;
  onLayoutChange: (layout: Layout) => void;

  onSettingsSceneClick?: (event: React.MouseEvent) => void;

  onShowAll: () => void;
  onHideAll: () => void;

  onRunClick: () => void;
  onStopClick: () => void;

  onSettingsClick: () => void;
  onAboutClick: () => void;
  onDocumentationClick: () => void;
  onDashboardClick: () => void;

  onFeedbackClick: () => void;

  simulatorState: SimulatorState;
}

interface MenuPrivateProps {
  locale: LocalizedString.Language;
}

interface MenuState {
  subMenu: SubMenu;
}

type Props = MenuPublicProps & MenuPrivateProps;
type State = MenuState;




const Container = styled('div', (props: ThemeProps) => ({
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
  height: '48px',
  lineHeight: '28px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  borderBottom: `1px solid ${props.theme.borderColor}`,
  zIndex: 12,
}));

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const Logo = styled('img', (props: ThemeProps & ClickProps) => ({
  width: '36px',
  height: '36px',
  marginLeft: '20px',
  marginRight: '20px',
  opacity: props.disabled ? '0.5' : '1.0',
  ':last-child': {
    borderRight: 'none',
  },
  fontWeight: 400,
  ':hover':
    props.onClick && !props.disabled
      ? {
        cursor: 'pointer',
        backgroundColor: `rgba(255, 255, 255, 0.1)`,
      }
      : {},
  userSelect: 'none',
  transition: 'background-color 0.2s, opacity 0.2s',
}));

const Item = styled('div', (props: ThemeProps & ClickProps) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  borderRight: `1px solid ${props.theme.borderColor}`,
  paddingLeft: '30px',
  paddingRight: '30px',
  height: '100%',
  opacity: props.disabled ? '0.5' : '1.0',
  ':last-child': {
    borderRight: 'none',
  },
  fontWeight: 400,
  ':hover':
    props.onClick && !props.disabled
      ? {
        cursor: 'pointer',
        backgroundColor: `rgba(255, 255, 255, 0.1)`,
      }
      : {},
  userSelect: 'none',
  transition: 'background-color 0.2s, opacity 0.2s',
}));

const RunItem = withStyleDeep(Item, (props: ClickProps) => ({
  backgroundColor: props.disabled ? GREEN.disabled : GREEN.standard,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: GREEN.hover,
      }
      : {},
}));

const StopItem = withStyleDeep(Item, (props: ClickProps) => ({
  backgroundColor: props.disabled ? RED.disabled : RED.standard,
  ':hover':
    props.onClick && !props.disabled
      ? {
        backgroundColor: RED.hover,
      }
      : {},
}));

const ItemIcon = styled(Fa, {
  paddingRight: '10px',
});

class SimMenu extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      subMenu: SubMenu.NONE,
    };
  }

  private onLayoutClick_ = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const currentType = this.state.subMenu.type;
    this.setState(
      {
        subMenu:
          currentType === SubMenu.Type.LayoutPicker
            ? SubMenu.NONE
            : SubMenu.LAYOUT_PICKER,
      },
      () => {
        if (currentType !== SubMenu.Type.LayoutPicker) {
          window.addEventListener('click', this.onClickOutside_);
        } else {
          window.removeEventListener('click', this.onClickOutside_);
        }
      }
    );

    event.stopPropagation();
  };

  private onSceneClick_ = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const currentType = this.state.subMenu.type;
    this.setState(
      {
        subMenu:
          currentType === SubMenu.Type.SceneMenu
            ? SubMenu.NONE
            : SubMenu.SCENE_MENU,
      },
      () => {
        if (currentType !== SubMenu.Type.SceneMenu) {
          window.addEventListener('click', this.onClickOutside_);
        } else {
          window.removeEventListener('click', this.onClickOutside_);
        }
      }
    );

    event.stopPropagation();
  };

  private onExtraClick_ = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const currentType = this.state.subMenu.type;
    this.setState(
      {
        subMenu:
          currentType === SubMenu.Type.ExtraMenu
            ? SubMenu.NONE
            : SubMenu.EXTRA_MENU,
      },
      () => {
        if (currentType !== SubMenu.Type.ExtraMenu) {
          window.addEventListener('click', this.onClickOutside_);
        } else {
          window.removeEventListener('click', this.onClickOutside_);
        }
      }
    );

    event.stopPropagation();
  };

  private onClickOutside_ = (event: MouseEvent) => {
    this.setState({ subMenu: SubMenu.NONE });
    window.removeEventListener('click', this.onClickOutside_);
  };

  render() {
    const { props, state } = this;
    const {
      theme,
      layout,
      onHideAll,
      onShowAll,
      onLayoutChange,
      onSettingsClick,
      onAboutClick,
      onRunClick,
      onStopClick,
      onDocumentationClick,
      onDashboardClick,
      onFeedbackClick,
      onSettingsSceneClick,
      simulatorState,
      locale

    } = props;

    const { subMenu } = state;

    const runOrStopItem: JSX.Element = SimulatorState.isRunning(simulatorState)
      ? (
        <StopItem
          theme={theme}
          onClick={onStopClick}
          disabled={false}
        >
          <ItemIcon icon={faStop} />
          {LocalizedString.lookup(tr('Stop', 'Terminate program execution'), locale)}
        </StopItem>
      ) : (
        <RunItem
          theme={theme}
          onClick={SimulatorState.isStopped(simulatorState) ? onRunClick : undefined}
          disabled={!SimulatorState.isStopped(simulatorState)}
          style={{ borderLeft: `1px solid ${theme.borderColor}` }}
        >
          <ItemIcon icon={faPlay} />
          {LocalizedString.lookup(tr('Run', 'Begin program execution'), locale)}
        </RunItem>
      );

    return (
      <>
        <Container theme={theme}>
          <Logo
            theme={theme}
            onClick={onDashboardClick}
            src={
              theme.foreground === 'white'
                ? (KIPR_LOGO_BLACK as string)
                : (KIPR_LOGO_WHITE as string)
            }
          />

          {runOrStopItem}


          <Spacer style={{ borderRight: `1px solid ${theme.borderColor}` }} />

     

          <Item
            theme={theme}
            onClick={this.onExtraClick_}
            style={{ position: 'relative' }}
          >
            <ItemIcon icon={faBars} style={{ padding: 0 }} />
            {subMenu.type === SubMenu.Type.ExtraMenu ? (
              <ExtraMenu
                style={{ zIndex: 9 }}
                theme={theme}
                onDocumentationClick={onDocumentationClick}
                onAboutClick={onAboutClick}
      
              />
            ) : undefined}
          </Item>
        </Container>
      </>
    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale,
}))(SimMenu) as React.ComponentType<MenuPublicProps>;
