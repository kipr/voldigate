import { Size } from '../../components/Widget';
import LocalizedString from '../../util/LocalizedString';
import Dict from '../../Dict';
import Async from "./Async";
import Documentation from './Documentation';
import DocumentationLocation from './Documentation/DocumentationLocation';



export interface DocumentationState {
  documentation: Documentation;
  locationStack: DocumentationLocation[];
  size: Size;
  language: 'c' | 'python';
}

export namespace DocumentationState {
  export const DEFAULT: DocumentationState = {
    documentation: SIMULATOR_LIBKIPR_C_DOCUMENTATION as Documentation || Documentation.EMPTY,
    locationStack: [],
    size: Size.MINIMIZED,
    language: 'c'
  };
}

export interface I18n {
  locale: LocalizedString.Language;
}