import * as React from 'react';
import { styled } from 'styletron-react';
import { StyleProps } from '../../style';
import { StyledText } from '../../util';
import ScrollArea from '../ScrollArea';
import { Text } from '../Text';
import { RED, Theme, ThemeProps } from '../theme';
import { Fa } from '../Fa';
import { Button } from '../Button';
import { BarComponent } from '../Widget';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import LocalizedString from '../../util/LocalizedString';
import tr from '@i18n';
export const createConsoleBarComponents = (
  theme: Theme,
  onClearConsole: () => void,
  locale: LocalizedString.Language,
  compileStatus?: 'idle' | 'compiling' | 'success' | 'warning' | 'error',
) => {
  const consoleBar: BarComponent<object>[] = [];

  console.log("createConsoleBarComponents compileStatus:", compileStatus);
  consoleBar.push(
    BarComponent.create(
      Button,
      {
        theme,
        onClick: onClearConsole,
        children: (
          <>
            <Fa icon={faFile} />{' '}
            {LocalizedString.lookup(tr('Clear'), locale)}
          </>
        ),
      },
      { chromeBackgroundColor: compileStatus === 'idle' ? `rgba(0, 0, 0, 0.1)` : compileStatus === 'compiling' ?  `rgba(0, 0, 0, 0.1)`: compileStatus === 'success' ? theme.compileSuccessColor : compileStatus === 'warning' ? theme.compileWarningColor : theme.compileFailedColor } // Green for success, yellow for warning, red for error
    )
  );
//
  return consoleBar;
};
export interface ConsoleProps extends StyleProps, ThemeProps {
  text: StyledText;
}

interface ConsoleState {}

type Props = ConsoleProps;
type State = ConsoleState;

const ConsoleText = styled(Text, (props: ThemeProps) => ({
  fontFamily: `'Roboto Mono', monospace`,
  fontSize: '0.9em',
  padding: `${props.theme.itemPadding * 2}px`,
  wordWrap: 'break-word',
  display: 'block',
}));

export class Console extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentDidUpdate(prevProps: Props) {
    console.log("Console compDidUpdate prevProps:", prevProps);
    console.log("Console compDidUpdate this.props:", this.props);
    if(prevProps.theme !== this.props.theme){
      this.setState({
               theme: this.props.theme,
      })
    }
  }
  render() {
    const { style, className, theme, text } = this.props;
    return (
      <ScrollArea style={style} className={className} theme={theme} autoscroll>
        <ConsoleText theme={theme} text={text} />
      </ScrollArea>
    );
  }
}

export default Console;