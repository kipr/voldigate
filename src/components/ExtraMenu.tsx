import * as React from 'react';
import { styled } from 'styletron-react';
import { StyleProps } from '../style';
import { Fa } from './Fa';
import { ThemeProps } from './theme';
import { faBook, faQuestion } from '@fortawesome/free-solid-svg-icons';
import tr from '@i18n';
import { connect } from 'react-redux';
import { State as ReduxState } from '../state';
import LocalizedString from '../util/LocalizedString';

export interface ExtraMenuPublicProps extends StyleProps, ThemeProps {

  onDocumentationClick: (event: React.MouseEvent) => void;
  onAboutClick: (event: React.MouseEvent) => void;
}

interface ExtraMenuPrivateProps {
  locale: LocalizedString.Language;
}

interface ExtraMenuState {
  
}

type Props = ExtraMenuPublicProps & ExtraMenuPrivateProps;
type State = ExtraMenuState;

const Container = styled('div', (props: ThemeProps) => ({
  position: 'absolute',
  right: `${(window.innerWidth * 0.04)}px`,
  width: '240px',
  
  backgroundColor: props.theme.titleBarBackground,
  color: props.theme.color,
  display: 'flex',
  flexDirection: 'row',
  borderBottomLeftRadius: `${props.theme.borderRadius}px`,
  borderBottomRightRadius: `${props.theme.borderRadius}px`,
  borderRight: `1px solid ${props.theme.borderColor}`,
  borderLeft: `1px solid ${props.theme.borderColor}`,
  borderBottom: `1px solid ${props.theme.borderColor}`
}));

interface ClickProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
}

const Item = styled('div', (props: ThemeProps & ClickProps) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  padding: '10px',
  borderBottom: `1px solid ${props.theme.borderColor}`,
  backgroundColor: `${props.theme.iconColor}`,
  ':last-child': {
    borderBottom: 'none'
  },
  opacity: props.disabled ? '0.5' : '1.0',
  fontWeight: 400,
  ':hover': !props.disabled && props.onClick ? {
    cursor: 'pointer',
    backgroundColor: props.theme.hoverOptionBackground  
  } : {
    cursor: 'auto',
  },
  userSelect: 'none',
  transition: 'background-color 0.2s, opacity 0.2s'
}));


const ItemIcon = styled(Fa, {
  width: '20px',
  minWidth: '20px',
  maxWidth: '20px',
  textAlign: 'center',
  marginRight: '10px'
});

class ExtraMenu extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }


  render() {
    const { props } = this;
    const {
      className,
      style,
      theme,
      onAboutClick,
      onDocumentationClick,

      locale,
    } = props;
    console.log("ExtraMenu theme: ", theme);
    return (
      <Container theme={theme} style={style} className={className}>
        <Item theme={theme} onClick={onDocumentationClick}><ItemIcon icon={faBook} /> {LocalizedString.lookup(tr('Documentation'), locale)}</Item>
         <Item theme={theme} onClick={onAboutClick}><ItemIcon icon={faQuestion} /> {LocalizedString.lookup(tr('About'), locale)}</Item>
       
      </Container>
    );
  }
}

export default connect((state: ReduxState) => ({
  locale: state.i18n.locale
}))(ExtraMenu) as React.ComponentType<ExtraMenuPublicProps>;