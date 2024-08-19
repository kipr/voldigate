import * as React from 'react';
import { connect } from 'react-redux';

import { styled } from 'styletron-react';

import { Button } from './Button';

import { Console, createConsoleBarComponents } from './Console';
import { Editor, createEditorBarComponents, EditorBarTarget, createNavigationNamesBar } from './Editor';
import World, { createWorldBarComponents } from './World';
import Dashboard from 'pages/Dashboard';
import { Info } from './Info';
import { LayoutEditorTarget, LayoutProps } from './Layout/Layout';
import SimulatorArea from './SimulatorArea';
import { TabBar } from './TabBar';
import Widget, { BarComponent, Mode, Size } from './Widget';
import { Slider } from './Slider';
import CreateUserDialog from './CreateUserDialog';
import { State as ReduxState } from '../state';
import Node from '../state/State/Scene/Node';
import Dict from '../Dict';
import Scene from '../state/State/Scene';
import { faCode, faFlagCheckered, faFolderTree, faGlobeAmericas, faRobot } from '@fortawesome/free-solid-svg-icons';
import Async from '../state/State/Async';
import { EMPTY_OBJECT, StyledText } from '../util';

import { ReferenceFrame } from '../unit-math';

import tr from '@i18n';
import LocalizedString from '../util/LocalizedString';
import { ThemeProps } from 'components/theme';

import Geometry from 'state/State/Scene/Geometry';
import Script from 'state/State/Scene/Script';
import { Fa } from './Fa';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';



// 3 panes:
// Editor / editorConsole
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

export interface FileExplorerProps extends LayoutProps {
}

interface FileExplorerReduxSideLayoutProps {
    robots: Dict<Node.Robot>;
    locale: LocalizedString.Language;
}

interface FileExplorerState {
    activePanel: number;
    sidePanelSize: Size.Type;
    workingScriptCode?: string;
    userName: string;
}

type Props = FileExplorerProps;
type State = FileExplorerState;


const Container = styled('div', {
    display: 'flex',
    flex: '1 1',
    position: 'relative',
    width: '100%',
    flexDirection: 'row'
});

const SidePanelContainer = styled('div', {
    display: 'flex',
    width: '70%',
    flexDirection: 'row',
    position: 'relative'
});

const SideBar = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: '1 1 auto',
    width: '100%',
});
const EditorConsoleAreaContainer = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1',
    width: '100vw'
});
const SimulatorAreaContainer = styled('div', {
    display: 'flex',
    flex: '1 1',
});
const StyledToolIcon = styled(Fa, (props: ThemeProps & { withBorder?: boolean }) => ({
    userSelect: 'none',
    paddingLeft: !props.withBorder ? `${props.theme.itemPadding}px` : undefined,
    paddingRight: props.withBorder ? `${props.theme.itemPadding}px` : undefined,
    borderRight: props.withBorder ? `1px solid ${props.theme.borderColor}` : undefined,
}));

const SimultorWidgetContainer = styled('div', {
    display: 'flex',
    flex: '1 0 0',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    flexDirection: 'column'

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

export class FileExplorer extends React.PureComponent<Props & FileExplorerReduxSideLayoutProps, State> {
    constructor(props: Props & FileExplorerReduxSideLayoutProps) {
        super(props);

        this.state = {
            sidePanelSize: Size.Type.Miniature,
            activePanel: null,
            userName: ''
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


    render() {
        const { props } = this;
        const {
            style,
            className,
            theme,
            editorTarget,
            editorConsole,
            messages,
            settings,
            onClearConsole,
            onIndentCode,
            onDownloadCode,

            onResetCode,
            editorRef,
            robots,

            onDocumentationGoToFuzzy,
            locale
        } = props;

        const {
            activePanel,
            sidePanelSize,

        } = this.state;

        let editorBarTarget: EditorBarTarget;
        let editor: JSX.Element;
        editorBarTarget = {
            type: EditorBarTarget.Type.Robot,
            messages,
            language: editorTarget.language,
            onLanguageChange: editorTarget.onLanguageChange,
            onIndentCode,
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
                onDocumentationGoToFuzzy={onDocumentationGoToFuzzy}
            />
        );

        const editorBar = createEditorBarComponents({
            theme,
            target: editorBarTarget,
            locale
        });

        const editorConsoleBar = createConsoleBarComponents(theme, onClearConsole, locale);


        let content: JSX.Element;
        switch (activePanel) {
            case 0: {
                content = (
                    <TestBoxContainer theme={theme}>

                    </TestBoxContainer>

                );
                break;
            }


        }

        const tabs = [{
            name: LocalizedString.lookup(tr('Editor'), locale),
            icon: faFolderTree,

        }];


        const simulator = <SimulatorAreaContainer>
            <SimulatorArea
                theme={theme}
                key='simulator'
                isSensorNoiseEnabled={settings.simulationSensorNoise}
                isRealisticSensorsEnabled={settings.simulationRealisticSensors}
            />
        </SimulatorAreaContainer>;

        const editorConsoleObject = <Container>
            <EditorConsoleAreaContainer>
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
                        barComponents={editorConsoleBar}
                        mode={Mode.Sidebar}
                        hideActiveSize={true}
                    >
                        <FlexConsole theme={theme} text={editorConsole} />
                    </SimulatorWidget>
                </SimultorWidgetContainer>

            </EditorConsoleAreaContainer>

        </Container>


        return (
            <Container style={style} className={className}>
                <div>
                    {this.state.userName}
                </div>
                <SidePanelContainer>
                    <TabBar
                        theme={theme} isVertical={true} tabs={tabs} index={activePanel}
                        onIndexChange={sidePanelSize === Size.Type.Minimized
                            ? this.onTabBarExpand_
                            : this.onTabBarIndexChange_} modal={undefined} settings={undefined}                    >
                    </TabBar>
                    <SimulatorAreaContainer>
                        {content}
                        {editorConsoleObject}
                    </SimulatorAreaContainer>




                </SidePanelContainer>

            </Container>
        );
    }
}

export const FileExplorerSideLayoutRedux = connect((state: ReduxState, { }: LayoutProps) => {


    return {

        locale: state.i18n.locale,
    };
}, dispatch => ({

}), null, { forwardRef: true })(FileExplorer) as React.ComponentType<FileExplorerProps>;