import { ThemeProps, SCRATCH_DARK, SCRATCH_LIGHT, DARK, LIGHT } from '../theme';
import { Vector2 } from '../../math';
import * as React from 'react';
import { styled } from 'styletron-react';


import resizeListener, { ResizeListener } from '../ResizeListener';

export interface ScratchEditorProps extends ThemeProps {
  code: string;
  onCodeChange: (code: string) => void;

  toolboxHidden?: boolean;
}

interface ScratchEditorState {
  size: Vector2;
  blocklyOptions: {};
}

type Props = ScratchEditorProps;
type State = ScratchEditorState;

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

class ScratchEditor extends React.Component<Props, State> {
  private resizeListener_ = resizeListener(size => this.setState({ size }));
  private isApplyingCodeFromBlockly = false

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
          flyout: SCRATCH_DARK.flyout,
          toolbox: SCRATCH_DARK.toolbox,
          toolboxSelected: SCRATCH_DARK.toolboxSelected,
          toolboxText: SCRATCH_DARK.toolboxText,
          toolbBoxHover: SCRATCH_DARK.toolbBoxHover,
          workspace: SCRATCH_DARK.workspace,
          text: '#FFFFFF',
        } :
          {
            flyout: SCRATCH_LIGHT.flyout,
            toolbox: SCRATCH_LIGHT.toolbox,
            toolboxSelected: SCRATCH_LIGHT.toolboxSelected,
            toolboxText: SCRATCH_LIGHT.toolboxText,
            toolbBoxHover: SCRATCH_LIGHT.toolboxHover,
            workspace: SCRATCH_LIGHT.workspace,
            text: '#000000',
          },
 
      }
    };
  }

  private debounce_: boolean;
  componentDidUpdate(prevProps: Readonly<ScratchEditorProps>, prevState: Readonly<ScratchEditorState>) {
    const { props: nextProps, state: nextState } = this;

    if (prevProps.theme !== nextProps.theme) {
      console.log("ScratchEditor compDidUpdate theme changed from: ", prevProps.theme, " to: ", nextProps.theme);

      if (nextProps.theme === DARK) {
        this.setState({
          blocklyOptions: {
            ...this.state.blocklyOptions,
            colours: {
              flyout: SCRATCH_DARK.flyout,
              toolbox: SCRATCH_DARK.toolbox,
              toolboxSelected: SCRATCH_DARK.toolboxSelected,
              toolboxText: SCRATCH_DARK.toolboxText,
              toolboxHover: SCRATCH_DARK.toolbBoxHover,
              workspace: SCRATCH_DARK.workspace,
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
              flyout: SCRATCH_LIGHT.flyout,
              toolbox: SCRATCH_LIGHT.toolbox,
              toolboxSelected: SCRATCH_LIGHT.toolboxSelected,
              toolboxText: SCRATCH_LIGHT.toolboxText,
              toolboxHover: SCRATCH_LIGHT.toolboxHover,
              workspace: SCRATCH_LIGHT.workspace,
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

      // if (prevProps.code !== nextProps.code && !this.debounce_) {
      //   this.workspace_.clear(); // Clear before applying new XML
      //   if (this.props.code !== '') {
      //     try {
      //       Blockly.Xml.domToWorkspace(
      //         Blockly.Xml.textToDom(this.props.code),
      //         this.workspace_
      //       );
      //     } catch (e) {
      //       console.error("Failed to parse Blockly XML:", e);
      //     }
      //   }
      // }
      if (
        prevProps.code !== nextProps.code &&
        !this.isApplyingCodeFromBlockly &&
        nextProps.code !== Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(this.workspace_))
      ) {
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
  }
  componentWillUnmount() {
    console.log("SCRATCH EDITOR UNMOUNTED");
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

    this.debounce_ = true;
    try {
      const code = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(this.workspace_));

      this.props.onCodeChange(code);
      this.debounce_ = false;
    } catch (e) {
      // console.error(e);
    }
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

export default ScratchEditor;