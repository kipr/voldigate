import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as React from 'react';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Fa } from './Fa';
import { ThemeProps } from './theme';
import SettingsDialog from './SettingsDialog';
import { DEFAULT_SETTINGS, Settings } from '../Settings';
import { faCog, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { State as ReduxState } from '../state';

export interface TabProps extends ThemeProps, StyleProps {
  description: TabBar.TabDescription;
  selected?: boolean;
  vertical?: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const TabContainer = styled('div', (props: ThemeProps & { selected: boolean, $vertical: boolean }) => ({
  flex: '1 1',
  borderRight: `1px solid ${props.theme.borderColor}`,
  borderBottom: props.$vertical ? `1px solid ${props.theme.borderColor}` : null,
  backgroundColor: props.selected ? `rgba(255, 255, 255, 0.1)` : `rgba(0, 0, 0, 0.1)`,
  opacity: props.selected ? 1 : 0.2,
  transition: 'background-color 0.2s, opacity 0.2s',
  padding: `calc(${props.theme.itemPadding * 2}px + 0.5em)`,
  ':last-child': {
    borderRight: 'none',
    borderBottom: 'none'
  },
  textAlign: 'center',
  userSelect: 'none',
  cursor: props.selected ? 'auto' : 'pointer',
  position: 'relative',
  minWidth: '45px',
  height: '6%'
}));

const TabIcon = styled(Fa, {
  paddingRight: '5px'
});

const TabText = styled('div', (props: { $vertical: boolean } & ThemeProps) => ({
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
  width: '48px',
  height: '5%',
  lineHeight: '28px',
  display: 'flex',
  alignContent: 'center',

  flexDirection: 'column',
  borderRight: `1px solid ${props.theme.borderColor}`,
  zIndex: 4,
}));

export class Tab extends React.PureComponent<TabProps> {
  render() {
    const { props } = this;
    const { description, theme, onClick, selected, vertical } = props;
    return (
      <TabContainer theme={theme} onClick={onClick} selected={selected} $vertical={vertical}>
        <TabText $vertical={vertical} theme={theme}>
          {description.icon ? <TabIcon icon={description.icon} /> : undefined}
          {description.name}
        </TabText>
      </TabContainer>
    );
  }
}

export interface TabBarProps extends ThemeProps, StyleProps {
  tabs: TabBar.TabDescription[];
  index: number;
  modal: Modal;
  settings: Settings;
  isVertical?: boolean;
  onIndexChange: (index: number, event: React.MouseEvent<HTMLDivElement>) => void;
}
interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}
interface TabBarState {
  modal: Modal;
  settings: Settings;
 }

type Props = TabBarProps;
type State = TabBarState;

const TabBarContainer = styled('div', (props: ThemeProps & { $vertical: boolean }) => ({
  display: 'flex',
  flexDirection: (props.$vertical) ? 'column' : 'row',
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
  height: '96%'

}));
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

const ItemIcon = styled(Fa, {
  paddingLeft: '24px',
  alignItems: 'center',
  height: '30px'
});

export class TabBar extends React.Component<Props, State> {
  private onClick_ = (index: number) => (event: React.MouseEvent<HTMLDivElement>) => {
    this.props.onIndexChange(index, event);
  };
  onSettingsChange_: (settings: Partial<Settings>) => void;
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: Modal.NONE,
      settings: DEFAULT_SETTINGS,


    }
  }
  private onModalClick_ = (modal: Modal) => () => this.setState({ modal });
  private onModalClose_ = () => this.setState({ modal: Modal.NONE });

  render() {
    const { props } = this;
    const { tabs, index, theme, style, className, isVertical } = props;
    const {
      settings,
      modal
    } = this.state;
    return (
      <>
        <TabBarContainer theme={theme} style={style} className={className} $vertical={isVertical}>
          {tabs.map((tab, i) => (
            <Tab key={i} selected={i === index} theme={theme} description={tab} onClick={this.onClick_(i)} vertical={!isVertical} />
          ))}
          <Item style={{ marginBottom: '10px' }} theme={theme} onClick={this.onModalClick_(Modal.SETTINGS)}><ItemIcon icon={faUserCircle} /> </Item>
          <Item style={{ marginBottom: '10px' }} theme={theme} onClick={this.onModalClick_(Modal.SETTINGS)}><ItemIcon icon={faCog} /> </Item>
          
        </TabBarContainer>
          
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

export namespace TabBar {
  export interface TabDescription {
    name: string;
    icon?: IconProp;
  }
}
