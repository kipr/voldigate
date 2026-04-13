import * as React from 'react';
import KIPR_LOGO_BLACK from '../assets/KIPR-Logo-Black-Text-Clear-Large.png';
import KIPR_LOGO_WHITE from '../assets/KIPR-Logo-White-Text-Clear-Large.png';
import LocalizedString from '../util/LocalizedString';
import ExtraMenu from './ExtraMenu';
import AboutDialog from './AboutDialog';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { ThemeProps } from './theme';
import { connect } from 'react-redux';
import { State as ReduxState } from 'ivygate/dist/src/state';
import { Modal } from '../pages/Modal';
import { DocumentationWindow } from 'ivygate';
import { DocumentationAction } from 'ivygate/dist/src/state/reducer';
import DocumentationLocation from 'ivygate/dist/src/state/State/Documentation/DocumentationLocation';
import { Size } from 'ivygate/dist/src/components/interface/Widget';
import { DocumentationState } from 'ivygate/dist/src/state/State';

export interface MenuPublicProps extends StyleProps, ThemeProps { }

interface MenuPrivateProps {
  locale: LocalizedString.Language;
  documentationCommon: DocumentationState;
  documentationDefault: DocumentationState;
}

interface MenuState {
  modal: Modal;
  documentationType: 'common' | 'default';
  screenWidth: number;
  isMobile: boolean;
}

interface ReduxProps {
  locale: LocalizedString.Language;
  documentationDefault: DocumentationState;
  documentationCommon: DocumentationState;

  setSizeDefault: (size: Size) => void;
  setSizeCommon: (size: Size) => void;
  popDefault: () => void;
  popCommon: () => void;
  pushDefault: (location: DocumentationLocation) => void;
  pushCommon: (location: DocumentationLocation) => void;
}

const mapStateToProps = (state: ReduxState) => ({
  documentationCommon: state.documentationCommon,
  documentationDefault: state.documentationDefault,
  locale: state.i18n.locale,
});

const mapDispatchToProps = (dispatch) => ({
  setSizeDefault: (size: Size) => dispatch(DocumentationAction.setSize({ size })),
  setSizeCommon: (size: Size) => dispatch(DocumentationAction.setSizeCommon({ size })),
  popDefault: () => dispatch(DocumentationAction.POP),
  popCommon: () => dispatch(DocumentationAction.POP_COMMON),
  pushDefault: (location: DocumentationLocation) => dispatch(DocumentationAction.pushLocation({ location })),
  pushCommon: (location: DocumentationLocation) => dispatch(DocumentationAction.pushLocationCommon({ location })),
});

type Props = MenuPublicProps & MenuPrivateProps & ReturnType<typeof mapDispatchToProps>;
type State = MenuState;

const Container = styled('div', (props: ThemeProps) => ({
  backgroundColor: props.theme.titleBarBackground,

  color: props.theme.color,
  justifyContent: 'space-between',
  width: '100%',
  //height: '7vh',
  lineHeight: '28px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  borderBottom: `1px solid ${props.theme.borderColor}`,
  zIndex: 1,
}));

const Logo = styled('img', (props: ThemeProps & { disabled?: boolean; onClick?: (e: React.MouseEvent) => void }) => ({
  width: '50px',
  height: '50px',
  marginLeft: '20px',
  marginRight: '20px',
  opacity: props.disabled ? '0.5' : '1.0',
  ':last-child': {
    borderRight: 'none',
  },
  fontWeight: 400,
  ':hover': props.onClick && !props.disabled ? {
    cursor: 'pointer',
    backgroundColor: `rgba(255, 255, 255, 0.1)`,
  } : {},
  userSelect: 'none',
  transition: 'background-color 0.2s, opacity 0.2s',
}));

const ExtraMenuContainer = styled('div', (props: ThemeProps) => ({
  marginRight: '5px',
  color: props.theme.color,
  top: '20px',
  width: '20%',
  //height: '7vh',
  lineHeight: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexDirection: 'row',
  zIndex: 1,

}));

class MainMenu extends React.Component<Props, MenuState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: Modal.NONE,
      documentationType: 'default',
      isMobile: window.innerWidth < 1030,
      screenWidth: window.innerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    console.log("Main Menu componentDidMount state:", this.state);
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    console.log("MainMenu handleResize called, window.innerWidth:", window.innerWidth);
    console.log("MainMenu handleResize state before update:", this.state);
    const isMobileNow = window.innerWidth < 1030;
    if (this.state.isMobile !== isMobileNow) {
      this.setState({
        isMobile: isMobileNow,
        //  sliderSizes: isMobileNow ? [10, 0] : [4, 8.3],
      });
    }
  };

  private onDocumentationClick_ = () => {
    this.setState({ documentationType: 'default' });
    this.props.setSizeDefault(Size.PARTIAL);
  };

  private onCommonDocumentationClick_ = () => {
    this.setState({ documentationType: 'common' });
    this.props.setSizeCommon(Size.PARTIAL);
  };

  private onModalClick_ = (modal: Modal) => () => this.setState({ modal });

  private onDashboardClick_ = () => {
    window.location.href = '/';
  };

  render() {
    const { theme } = this.props;
    const { modal, documentationType } = this.state;

    return (
      <Container theme={theme}>
        <Logo
          theme={theme}
          src={theme.foreground === 'white' ? KIPR_LOGO_BLACK as string : KIPR_LOGO_WHITE as string}
          onClick={this.onDashboardClick_}
        />

        <ExtraMenuContainer theme={theme}>
          <ExtraMenu
            style={{ zIndex: 9 }}
            theme={theme}
            onDocumentationClick={this.onDocumentationClick_}
            onCommonDocumentationClick={this.onCommonDocumentationClick_}
            onAboutClick={this.onModalClick_(Modal.ABOUT)}
          />
        </ExtraMenuContainer>

        {modal === Modal.ABOUT && (
          <AboutDialog theme={theme} onClose={() => this.setState({ modal: Modal.NONE })} />
        )}

        <>
          {documentationType === 'default' && (
            <DocumentationWindow
              theme={theme}
              documentationType={'default'}
            />
          )}

          {documentationType === 'common' && (
            <DocumentationWindow
              theme={theme}
              documentationType={'common'}
            />
          )}
        </>

      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);