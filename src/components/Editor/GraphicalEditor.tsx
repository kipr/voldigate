import { ThemeProps, GRAPHICAL_DARK, GRAPHICAL_LIGHT, DARK, LIGHT } from '../theme';
import { Vector2 } from '../../math';
import * as React from 'react';
import { styled } from 'styletron-react';


import resizeListener, { ResizeListener } from '../ResizeListener';

export interface GraphicalEditorProps extends ThemeProps {
  code: string;
  onCodeChange: (code: string) => void;

  toolboxHidden?: boolean;
}

interface GraphicalEditorState {
  size: Vector2;
  blocklyOptions: {};
}

type Props = GraphicalEditorProps;
type State = GraphicalEditorState;

const OuterContainer = styled('div', (props: ThemeProps) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  zIndex: 0,
}));

const Container = styled('div', (props: ThemeProps) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: '#75ba75'
}));

class GraphicalEditor extends React.Component<Props, State> {
  private resizeListener_ = resizeListener(size => this.setState({ size }));
  private isApplyingCodeFromBlockly = false
  private lastXML: string = '';
  constructor(props: Props) {
    super(props);

    this.state = {
      size: Vector2.ZERO,
      blocklyOptions: {
        comments: true,
        disable: false,
        collapse: false,
        media: '../media/',
        readOnly: false,
        rtl: false,
        scrollbars: true,
        toolbox: undefined,
        toolboxPosition: 'start',
        verticalLayout: 'right',
        trashcan: false,
        sounds: false,
        zoom: {
          controls: false,
          wheel: true,
          startScale: 0.75,
          maxScale: 4,
          minScale: 0.25,
          scaleSpeed: 1.1
        },

        colours: this.props.theme === DARK ? {
          flyout: GRAPHICAL_DARK.flyout,
          toolbox: GRAPHICAL_DARK.toolbox,
          toolboxSelected: GRAPHICAL_DARK.toolboxSelected,
          toolboxText: GRAPHICAL_DARK.toolboxText,
          toolbBoxHover: GRAPHICAL_DARK.toolbBoxHover,
          workspace: GRAPHICAL_DARK.workspace,
          text: '#FFFFFF',
        } :
          {
            flyout: GRAPHICAL_LIGHT.flyout,
            toolbox: GRAPHICAL_LIGHT.toolbox,
            toolboxSelected: GRAPHICAL_LIGHT.toolboxSelected,
            toolboxText: GRAPHICAL_LIGHT.toolboxText,
            toolbBoxHover: GRAPHICAL_LIGHT.toolboxHover,
            workspace: GRAPHICAL_LIGHT.workspace,
            text: '#000000',
          },
 
      }
    };
  }

  private debounce_: boolean;
  componentDidUpdate(prevProps: Readonly<GraphicalEditorProps>, prevState: Readonly<GraphicalEditorState>) {
    const { props: nextProps, state: nextState } = this;

    console.log("GraphicalEditor compDidUpdate workspace options: ", this.state.blocklyOptions);

    if (prevProps.theme !== nextProps.theme) {
      console.log("GraphicalEditor compDidUpdate theme changed from: ", prevProps.theme, " to: ", nextProps.theme);

      if (nextProps.theme === DARK) {
        this.setState({
          blocklyOptions: {
            ...this.state.blocklyOptions,
            colours: {
              flyout: GRAPHICAL_DARK.flyout,
              toolbox: GRAPHICAL_DARK.toolbox,
              toolboxSelected: GRAPHICAL_DARK.toolboxSelected,
              toolboxText: GRAPHICAL_DARK.toolboxText,
              toolboxHover: GRAPHICAL_DARK.toolbBoxHover,
              workspace: GRAPHICAL_DARK.workspace,
              text: '#FFFFFF',
            }
          }

        }, () => {
          this.injectBlockly_();
        })
      }
      else if (nextProps.theme === LIGHT) {
        this.setState({
          blocklyOptions: {
            ...this.state.blocklyOptions,
            
            colours: {
              flyout: GRAPHICAL_LIGHT.flyout,
              toolbox: GRAPHICAL_LIGHT.toolbox,
              toolboxSelected: GRAPHICAL_LIGHT.toolboxSelected,
              toolboxText: GRAPHICAL_LIGHT.toolboxText,
              toolboxHover: GRAPHICAL_LIGHT.toolboxHover,
              workspace: GRAPHICAL_LIGHT.workspace,
              text: '#000000',
            }
          }
        }, () => {
          this.injectBlockly_();
        })
      }



    }
    if (this.workspace_) {

      if (prevState.size !== nextState.size) {
        Blockly.svgResize(this.workspace_);
      }

      if (prevProps.code !== nextProps.code && nextProps.code !== this.lastXML) {

        this.workspace_.clear();
        

        if (nextProps.code !== '') {
          try {
            Blockly.Xml.domToWorkspace(
              Blockly.Xml.textToDom(nextProps.code),
              this.workspace_
            );
          } catch (e) {
            console.error("Failed to parse Blockly XML:", e);
          }
        }


      }
    
    }

  }

  componentDidMount(): void {
    console.log("GRAPHICAL EDITOR MOUNTED");

    console.log("GRAPHICAL EDITOR PROPS: ", this.props);
    console.log("GRAPHICAL EDITOR STATE: ", this.state);
  }
  componentWillUnmount() {
    console.log("GRAPHICAL EDITOR UNMOUNTED");
    this.workspace_.removeChangeListener(this.onChange_);
    this.resizeListener_.disconnect();
  }

  private outerContainerRef_: HTMLDivElement | null = null;
  private bindOuterContainerRef_ = (ref: HTMLDivElement) => {
    if (this.outerContainerRef_) this.resizeListener_.unobserve(this.outerContainerRef_);


    this.outerContainerRef_ = ref;

    if (this.outerContainerRef_) this.resizeListener_.observe(this.outerContainerRef_);

  };

  private containerRef_: HTMLDivElement | null = null;



  private bindContainerRef_ = (ref: HTMLDivElement) => {
    if (this.containerRef_) {
      // cleanup blockly
    }

    this.containerRef_ = ref;



    if (this.containerRef_) {
      this.injectBlockly_();
    }
  };

  private workspace_: Blockly.Workspace;
  private injectBlockly_ = () => {


    this.workspace_ = Blockly.inject(this.containerRef_, this.state.blocklyOptions);

    if (this.props.code.length > 0) {
      try {
        Blockly.Xml.domToWorkspace(
          Blockly.Xml.textToDom(this.props.code),
          this.workspace_
        );
      } catch (e) {
        console.error(e);
        this.workspace_.clear();
        this.props.onCodeChange('');

      }
    }

    this.workspace_.addChangeListener(this.onChange_);
  };

  private onChange_ = async () => {

    const xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(this.workspace_));
    if(xml === this.lastXML) return;
    this.isApplyingCodeFromBlockly = true;
    this.lastXML = xml;
    this.props.onCodeChange(xml);
    this.isApplyingCodeFromBlockly = false;

  
  
    this.debounce_ = false;
  };

  render() {
    const { props, state } = this;
    const { theme } = props;
    const { size } = state;

    const containerStyle: React.CSSProperties = {
      width: `${size.x}px`,
      height: `${size.y}px`,
    };

    return (
      <OuterContainer theme={theme} ref={this.bindOuterContainerRef_}>
        <Container style={containerStyle} theme={theme} ref={this.bindContainerRef_} />
      </OuterContainer>
    );
  }
}

export default GraphicalEditor;