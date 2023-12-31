import * as React from 'react';
import { connect } from 'react-redux';

import { styled } from 'styletron-react';

import { Button } from '../Button';

import { Console, createConsoleBarComponents } from '../Console';
import { Editor, createEditorBarComponents, EditorBarTarget } from '../Editor';
import World, { createWorldBarComponents } from '../World';
import Dashboard from 'pages/Dashboard';
import { Info } from '../Info';
import { LayoutEditorTarget, LayoutProps } from './Layout';
import SimulatorArea from '../SimulatorArea';
import { TabBar } from '../TabBar';
import Widget, { BarComponent, Mode, Size } from '../Widget';
import { Slider } from '../Slider';

import { State as ReduxState } from '../../state';
import Node from '../../state/State/Scene/Node';
import Dict from '../../Dict';
import Scene from '../../state/State/Scene';
import { faCode, faFlagCheckered, faGlobeAmericas, faRobot } from '@fortawesome/free-solid-svg-icons';
import Async from '../../state/State/Async';
import { EMPTY_OBJECT } from '../../util';
import Challenge from '../Challenge';
import { ReferenceFrame } from '../../unit-math';

import tr from '@i18n';
import LocalizedString from '../../util/LocalizedString';
import { ThemeProps } from 'components/theme';



// 3 panes:
// Editor / console
// Robot Info
// World



const sizeDict = (sizes: Size[]) => {
  const forward: { [type: number]: number } = {};

  for (let i = 0; i < sizes.length; ++i) {
    const size = sizes[i];
    forward[size.type] = i;
  }

  return forward;
};
const SIDEBAR_SIZES: Size[] = [Size.MINIMIZED, Size.PARTIAL_RIGHT, Size.MAXIMIZED];
const SIDEBAR_SIZE = sizeDict(SIDEBAR_SIZES);

export interface SideLayoutProps extends LayoutProps {
}

interface ReduxSideLayoutProps {
  robots: Dict<Node.Robot>;
  locale: LocalizedString.Language;
}

interface SideLayoutState {
  activePanel: number;
  sidePanelSize: Size.Type;
  workingScriptCode?: string;
}

type Props = SideLayoutProps;
type State = SideLayoutState;


const Container = styled('div', {
  display: 'flex',
  flex: '1 1',
  position: 'relative',
  width: '100%'
});

const SidePanelContainer = styled('div', {
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
});

const SideBar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  flex: '1 1 auto',
  width: '100%',
});

const SimulatorAreaContainer = styled('div', {
  display: 'flex',
  flex: '1 1',
});
const SimultorWidgetContainer = styled('div', {
  display: 'flex',
  flex: '1 0 0',
  height: '100%',
  width: '100%',
  overflow: 'hidden'
  
});
const SimulatorWidget = styled(Widget, {
  display: 'flex',
  flex: '1 1 0',
  height: '100%',
  width: '100%',
});
const TestBoxContainer = styled('div', (props: ThemeProps) => ({
  width: '800px',
  height: `100px`, // fix for mobile, see https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html
  display: 'flex',
  flexDirection: 'row',
  marginTop: '45px',
  justifyContent: 'flex-start',
  backgroundColor: 'green'

}));

const FlexConsole = styled(Console, {
  flex: '1 1',
});

const SideBarMinimizedTab = -1;

export class SideLayout extends React.PureComponent<Props & ReduxSideLayoutProps, State> {
  constructor(props: Props & ReduxSideLayoutProps) {
    super(props);

    this.state = {
      sidePanelSize: Size.Type.Maximized,
      activePanel: 0,
    };

    // TODO: this isn't working yet. Needs more tinkering
    // on an orientation change, trigger a rerender
    // this is deprecated, but supported in safari iOS
    // screen.orientation.onchange = () => {
    //   console.log('orientation change')
    //   this.render();
    // };
    // // this is not deprecated, but not supported in safari iOS
    // window.addEventListener('orientationchange', () => { console.log('deprecated orientation change'); this.render(); });
  }
  private onSideBarSizeChange_ = (index: number) => {
    if (SIDEBAR_SIZES[index].type === Size.Type.Minimized) {
      // unset active tab if minimizing
      this.setState({ activePanel: SideBarMinimizedTab });
    }
    this.setState({
      sidePanelSize: SIDEBAR_SIZES[index].type,
    });
  };
  private onTabBarIndexChange_ = (index: number) => {
    if (index === this.state.activePanel) {
      // collapse instead
      this.onSideBarSizeChange_(SIDEBAR_SIZE[Size.Type.Minimized]);
    } else {
      this.setState({ activePanel: index });
    }
  };
  private onTabBarExpand_ = (index: number) => {
    this.onSideBarSizeChange_(Size.Type.Miniature);
    this.setState({ activePanel: index });
  };

  private onErrorClick_ = (event: React.MouseEvent<HTMLDivElement>) => {
    // not implemented
  };

  private onRobotOriginChange_ = (origin: ReferenceFrame) => {
    const { scene, onNodeChange } = this.props;
    
    const latestScene = Async.latestValue(scene);

    if (!latestScene) return;

    const robots = Scene.robots(latestScene);
    const robotId = Object.keys(robots)[0];
    this.props.onNodeChange(robotId, {
      ...robots[robotId],
      origin
    });
  };


  render() {
    const { props } = this;
    const {
      style,
      className,
      theme,
      editorTarget,
      console,
      messages,
      settings,
      onClearConsole,
      onIndentCode,
      onGetUser,
      onCreateUser,
      onDownloadCode,
      onResetCode,
      editorRef,
      robots,
      scene,
      onNodeAdd,
      onNodeChange,
      onNodeRemove,
      onGeometryAdd,
      onGeometryChange,
      onGeometryRemove,
      onScriptAdd,
      onScriptRemove,
      onObjectAdd,
      challengeState,
      worldCapabilities,
      onDocumentationGoToFuzzy,
      locale
    } = props;

    const {
      activePanel,
      sidePanelSize,
      
    } = this.state;

    let editorBarTarget: EditorBarTarget;
    let editor: JSX.Element;
    switch (editorTarget.type) {
      case LayoutEditorTarget.Type.Robot: {
        editorBarTarget = {
          type: EditorBarTarget.Type.Robot,
          messages,
          language: editorTarget.language,
          onLanguageChange: editorTarget.onLanguageChange,
          onIndentCode,
          onGetUser,
          onCreateUser,
          onDownloadCode,
          onResetCode,
          onErrorClick: this.onErrorClick_
        };
        editor = (
          <Editor
            theme={theme}
            ref={editorRef}
            code={editorTarget.code}
            language={editorTarget.language}
            onCodeChange={editorTarget.onCodeChange}
            messages={messages}
            autocomplete={settings.editorAutoComplete}
            onDocumentationGoToFuzzy={onDocumentationGoToFuzzy} username={''}          />
        );
        break;
      }
    }

    const editorBar = createEditorBarComponents({
      theme,
      target: editorBarTarget,
      locale
    });
    const consoleBar = createConsoleBarComponents(theme, onClearConsole, locale);

    let content: JSX.Element;
    switch (activePanel) {
      case 0: {
        content = (
          <Slider 
            isVertical={false} 
            theme={theme}
            minSizes={[10, 600]}
            sizes={[3, 1]}
            visible={[true, true]}
          >
            <SimultorWidgetContainer>
              <SimulatorWidget
                theme={theme}
                name={LocalizedString.lookup(editorTarget.type === LayoutEditorTarget.Type.Robot ? tr('Editor') : tr('Script Editor'), locale)}
                mode={Mode.Sidebar}
                barComponents={editorBar}
              >
                {editor}
              </SimulatorWidget>
            </SimultorWidgetContainer>

            <SimultorWidgetContainer>
              <SimulatorWidget
                theme={theme}
                name={LocalizedString.lookup(tr('Console'), locale)}
                barComponents={consoleBar}
                mode={Mode.Sidebar}
                hideActiveSize={true}
              >
                <FlexConsole theme={theme} text={console}/>
              </SimulatorWidget>
            </SimultorWidgetContainer>
          </Slider>

        );
        break;
      }
      
 
    }

    const tabs = [{
      name: LocalizedString.lookup(tr('Editor'), locale),
      icon: faCode,
    }, {
      name: LocalizedString.lookup(tr('Robot'), locale),
      icon: faRobot,
    }, {
      name: LocalizedString.lookup(tr('World'), locale),
      icon: faGlobeAmericas,
    }];


    const simulator = <SimulatorAreaContainer>
      <SimulatorArea
        theme={theme}
        key='simulator'
        isSensorNoiseEnabled={settings.simulationSensorNoise}
        isRealisticSensorsEnabled={settings.simulationRealisticSensors}
      />
    </SimulatorAreaContainer>;

     return <Container style={style} className={className}>
      <SidePanelContainer>
        <TabBar 
           theme={theme} isVertical={true} tabs={tabs} index={activePanel}
           onIndexChange={sidePanelSize === Size.Type.Minimized
             ? this.onTabBarExpand_
             : this.onTabBarIndexChange_} modal={undefined} settings={undefined}        >
        </TabBar>
        {content}

      </SidePanelContainer>
    </Container>;
  }
}

export const SideLayoutRedux = connect((state: ReduxState, {  }: LayoutProps) => {

  
  return {
    
    locale: state.i18n.locale,
  };
}, dispatch => ({

}), null, { forwardRef: true })(SideLayout) as React.ComponentType<SideLayoutProps>;