import { Message } from "ivygate";
import ProgrammingLanguage from '../../ProgrammingLanguage';
import { Settings } from "../../Settings";
import { StyleProps } from "../../style";
import { StyledText } from "../../util";
import { Editor } from "../Editor";
import { ThemeProps } from "../theme";


export namespace LayoutEditorTarget {
  export enum Type {
    Robot = 'robot',
  }

  export interface Robot {
    type: Type.Robot;
    language: ProgrammingLanguage;
    onLanguageChange: (language: ProgrammingLanguage) => void;
    code: string;
    onCodeChange: (code: string) => void;
  }
}

export type LayoutEditorTarget = LayoutEditorTarget.Robot;

export interface LayoutProps extends StyleProps, ThemeProps {

  editorTarget: LayoutEditorTarget;
  editorConsole: StyledText;
  messages: Message[];
  settings: Settings;
  onClearConsole: () => void;
  onIndentCode: () => void;
  onDownloadCode: () => void;
  editorRef: React.MutableRefObject<Editor>;

  onDocumentationGoToFuzzy?: (query: string, language: 'c' | 'python') => void;
}

export enum Layout {
  Overlay,
  Side,
  Bottom
}

