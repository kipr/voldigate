import * as React from 'react';
import { StyleProps } from '../style';
import { ThemeProps, Theme } from './theme';
import LocalizedString from 'util/LocalizedString';
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { styled } from 'styletron-react';
import ScrollArea from './ScrollArea';


export interface TerminalViewPublicProps extends StyleProps, ThemeProps {
  theme: Theme;
}

interface TerminalPrivateProps {
  locale: LocalizedString.Language;
}

interface TerminalState {

}

type Props = TerminalViewPublicProps & TerminalPrivateProps;
type State = TerminalState;

const StyledScrollArea = styled(ScrollArea, ({ theme }: ThemeProps) => ({
  flex: 1,
}));

const TerminalViewContainer = styled('div', (props: ThemeProps) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',

}));
const TerminalWrapper = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});




export function XTerminal({ theme }: { theme: Theme }) {
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const term = React.useRef<Terminal | null>(null);
  const socketRef = React.useRef<WebSocket | null>(null);
  //console.log("Rendering XTerminal theme: ", this.props.theme),
  React.useEffect(() => {
    const existing = document.getElementById('xterm-scrollbar-styles');
    if (existing) existing.remove();
    const styleElement = document.createElement('style');
    styleElement.id = 'xterm-scrollbar-styles';

    styleElement.innerHTML = `
    .xterm .xterm-viewport {
      scrollbar-width: 750px;
      scrollbar-color: rgba(121, 121, 121, 0.4) ${theme.backgroundColor};
    }
    .xterm .xterm-viewport::-webkit-scrollbar {
      width: 750px;
      height: 74px;
    }
    .xterm .xterm-viewport::-webkit-scrollbar-thumb {
      background-color: ${theme.backgroundColor};
      border-radius: 0 !important;
      
        box-shadow: none !important;
    }
    .xterm .xterm-viewport::-webkit-scrollbar-thumb:hover {
      background-color: rgba(121, 121, 121, 0.7);
    }
    .xterm .xterm-viewport::-webkit-scrollbar-track {
      background-color: ${theme.backgroundColor};
      border-radius: 0 !important;
    }
  `;//

    document.head.appendChild(styleElement);

    return () => {
      const existing = document.getElementById('xterm-scrollbar-styles');
      if (existing) existing.remove();
    };
  }, [theme]);
  React.useEffect(() => {
    if (terminalRef.current && !term.current) {
      term.current = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        theme: { 
          background: theme.backgroundColor,
           foreground: theme.color,
       },
      });

      const resizeTerminal = () => {
        if (terminalRef.current && term.current) {
          const fontSize = 14;
          const lineHeight = fontSize * 1.2;
          const containerHeight = terminalRef.current.clientHeight;
          const containerWidth = terminalRef.current.clientWidth;

          const rows = Math.floor(containerHeight / lineHeight);
          const cols = Math.floor(containerWidth / (fontSize * 0.6));

          term.current.resize(cols, rows);
        }
      };
      term.current.options.theme={
        background: theme.backgroundColor,
        foreground: theme.color,
   
      }
      term.current.open(terminalRef.current);
      resizeTerminal();
      term.current.focus();

      window.addEventListener('resize', resizeTerminal);
      // Create WebSocket connection
       const socket = new WebSocket('ws://192.168.125.1:8888/ws/terminal');
     //const socket = new WebSocket('ws://localhost:8888/ws/terminal');
      socketRef.current = socket;

      // Terminal -> Server
      term.current.onData(data => {
        socket.send(data);
      });

      // Server -> Terminal
      socket.onmessage = (event) => {
        term.current?.write(event.data);
      };

      socket.onopen = () => {
        console.log('Terminal WebSocket connection opened');
        term.current?.writeln('\x1b[32mConnected to Wombat Terminal\x1b[0m\n');
      };

      socket.onerror = () => {
        term.current?.writeln('\x1b[31mWebSocket error\x1b[0m\n');
      };

      socket.onclose = () => {
        term.current?.writeln('\x1b[31mConnection closed\x1b[0m\n');
      };
    }

    return () => {
      //window.removeEventListener('resize', resizeTerminal);
      term.current?.dispose();
      socketRef.current?.close();
    };
  }, []);
React.useEffect(() => {
  if (term.current) {

    term.current.options.theme={
      background: theme.backgroundColor,
      foreground: theme.color,
      cursor: theme.cursorColor,

    }


  }
}, [theme]);

  return (


    <TerminalWrapper ref={terminalRef} />
  );
}


class TerminalView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }


  render() {
    const { locale, theme } = this.props;
    return (
      <div style={{ height: '900px', display: 'flex', flexDirection: 'column' }}>
        <TerminalViewContainer theme={theme} className="terminal-view">
          <h2 style={{ marginLeft: '6px', fontSize: '1.728em' }}>Terminal</h2>
          <XTerminal theme={theme} />
        </TerminalViewContainer>
      </div>
    );
  }
}


export default TerminalView;