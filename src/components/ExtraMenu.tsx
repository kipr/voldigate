import * as React from 'react';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Fa } from './Fa';
import { ThemeProps } from './theme';
import { faBook, faQuestion, faBars } from '@fortawesome/free-solid-svg-icons';
import tr from '@i18n';
import { connect } from 'react-redux';
import { State as ReduxState } from '../state';
import LocalizedString from '../util/LocalizedString';

export interface ExtraMenuPublicProps extends StyleProps, ThemeProps {

  onDocumentationClick: (event: React.MouseEvent) => void;
  onCommonDocumentationClick: (event: React.MouseEvent) => void;
  onAboutClick: (event: React.MouseEvent) => void;
}

interface ExtraMenuPrivateProps {
  locale: LocalizedString.Language;
}

interface ExtraMenuState {
  screenWidth: number;
  isMobile: boolean;
  showMobileView: boolean;
}

type Props = ExtraMenuPublicProps & ExtraMenuPrivateProps;
type State = ExtraMenuState;
const MobileContainer = styled('div', (props: ThemeProps) => ({
  position: 'absolute',
  top: '100%',
  right: `0px`,
   backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
  display: 'flex',
  flexDirection: 'column',
  borderBottomLeftRadius: `${props.theme.borderRadius}px`,
  borderBottomRightRadius: `${props.theme.borderRadius}px`,
  borderRight: `2px solid ${props.theme.borderColor}`,
  borderLeft: `2px solid ${props.theme.borderColor}`,
  borderBottom: `2px solid ${props.theme.borderColor}`
}));

const DefaultContainer = styled('div', (props: ThemeProps) => ({
  backgroundColor: props.theme.backgroundColor,
  color: props.theme.color,
  display: 'flex',
  flexDirection: 'row',
  borderBottomLeftRadius: `${props.theme.borderRadius}px`,
  borderBottomRightRadius: `${props.theme.borderRadius}px`,
  borderRight: `2px solid ${props.theme.borderColor}`,
  borderLeft: `2px solid ${props.theme.borderColor}`,
}));


const Container = styled('div', (props: ThemeProps ) => ({
  position: 'absolute',
  backgroundColor: props.theme.titleBarBackground,
  alignContent: 'center',
  maxWidth: '75vw',
  color: props.theme.color,
  display: 'flex',
  flexDirection: 'row',
  borderBottomLeftRadius: `${props.theme.borderRadius}px`,
  borderBottomRightRadius: `${props.theme.borderRadius}px`,
  borderRight: `1px solid ${props.theme.borderColor}`,
  borderLeft: `1px solid ${props.theme.borderColor}`,
  borderBottom: `1px solid ${props.theme.borderColor}`,
  maxHeight: '100%',
}));

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const MobileItem = styled('div', (props: ThemeProps & ClickProps) => ({
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  padding: '0.5em 0.75em',
  borderBottomLeftRadius: `${props.theme.borderRadius}px`,
  borderBottomRightRadius: `${props.theme.borderRadius}px`,
  opacity: props.disabled ? '0.5' : '1.0',
  fontWeight: 400,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  ':hover': !props.disabled && props.onClick ? {
    cursor: 'pointer',
    backgroundColor: props.theme.hoverOptionBackground,
    borderBottomLeftRadius: `${props.theme.borderRadius}px`,
    borderBottomRightRadius: `${props.theme.borderRadius}px`,
  } : {
    cursor: 'auto',
  },
  userSelect: 'none',
  transition: 'background-color 0.2s, opacity 0.2s',
    width: '100%',
}));

const Item = styled('div', (props: ThemeProps & ClickProps) => ({
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  padding: '0.4rem 0.75em',
  fontSize: 'clamp(1.4rem, 1.5vw, 3rem)',
  borderBottomLeftRadius: `${props.theme.borderRadius}px`,
  borderBottomRightRadius: `${props.theme.borderRadius}px`,
  opacity: props.disabled ? '0.5' : '1.0',
  fontWeight: 400,
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  ':hover': !props.disabled && props.onClick ? {
    cursor: 'pointer',
    backgroundColor: props.theme.hoverOptionBackground,
    borderBottomLeftRadius: `${props.theme.borderRadius}px`,
    borderBottomRightRadius: `${props.theme.borderRadius}px`,
  } : {
    cursor: 'auto',
  },
  userSelect: 'none',
  transition: 'background-color 0.2s, opacity 0.2s',

    width: '100%',
}));

const ItemIcon = styled(Fa, {
  minWidth: '1.5em',
  minHeight: '1rem',
  fontSize: '1.3em',
  textAlign: 'center',
  marginRight: '0.5em',
  flexShrink: 0
});


const MobileItemIcon = styled(Fa, {
  // width: '1.3em',
  // height: '1.5em',
  minHeight: '1.3em',
  minWidth: '1.1em',
  fontSize: '1.5em',
  textAlign: 'center',
  flexShrink: 0
});


class ExtraMenu extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      screenWidth: window.innerWidth,
      showMobileView: false,
      isMobile: window.innerWidth < 1030,
    };
  }

  async componentDidUpdate(prevProps: Props, prevState: State) {
    console.log('ExtraMenu componentDidUpdate props: ', this.props);
    console.log('ExtraMenu componentDidUpdate state: ', this.state);
    console.log('ExtraMenu componentDidUpdate prevProps: ', prevProps);
    console.log('ExtraMenu componentDidUpdate prevState: ', prevState);

    if (this.state.screenWidth !== window.innerWidth) {
      this.setState({
        screenWidth: window.innerWidth,
        isMobile: window.innerWidth < 1030,
      }, () => {
        console.log('ExtraMenu componentDidUpdate new state: ', this.state);
      });
    }
  }
  renderMobileView = () => {
    const {
      className,
      style,
      theme,
      onAboutClick,
      onCommonDocumentationClick,
      onDocumentationClick,
      locale,
    } = this.props;
    return (
      <MobileContainer theme={theme}>
        <Item theme={theme} onClick={onCommonDocumentationClick}><ItemIcon icon={faBook} /> {LocalizedString.lookup(tr('Common Functions'), locale)}</Item>
        <Item theme={theme} onClick={onDocumentationClick}><ItemIcon icon={faBook} /> {LocalizedString.lookup(tr('Documentation'), locale)}</Item>
        <Item theme={theme} onClick={onAboutClick}><ItemIcon icon={faQuestion} /> {LocalizedString.lookup(tr('About'), locale)}</Item>
      </MobileContainer>
    )
  };

  render() {
    const { props, state } = this;
    const { showMobileView } = state;
    const {
      className,
      style,
      theme,
      onAboutClick,
      onCommonDocumentationClick,
      onDocumentationClick,
      locale,
    } = props;

    const isMobile = this.state.screenWidth < 1050;

    let mobileView: JSX.Element;
    let defaultMenu: JSX.Element;
    let content: JSX.Element;
    mobileView = (
      <MobileItem style={{justifyContent: 'center' }} theme={theme} onClick={() => this.setState({ showMobileView: !showMobileView })}>
        <MobileItemIcon style={{}} icon={faBars} />
      </MobileItem>
    );

    defaultMenu = (
      <DefaultContainer theme={theme}>
        <Item theme={theme} onClick={onCommonDocumentationClick}><ItemIcon icon={faBook} /> {LocalizedString.lookup(tr('Common Functions'), locale)}</Item>
        <Item theme={theme} onClick={onDocumentationClick}><ItemIcon icon={faBook} /> {LocalizedString.lookup(tr('Documentation'), locale)}</Item>
        <Item theme={theme} onClick={onAboutClick}><ItemIcon icon={faQuestion} /> {LocalizedString.lookup(tr('About'), locale)}</Item>
      </DefaultContainer>
    );
    if (isMobile) {
      content = mobileView;
    } else {
      content = defaultMenu;
    }

    return (
      <Container theme={theme} style={style} className={className}>

        {content}
        {showMobileView && this.renderMobileView()}
      </Container>
    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale
}))(ExtraMenu) as React.ComponentType<ExtraMenuPublicProps>;