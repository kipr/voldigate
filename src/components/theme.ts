
import {styled} from 'styletron-react';

const ShakeAnimation = styled('div', {
  '@keyframes shake': {
    '0%': { transform: 'translateX(0)' },
    '25%': { transform: 'translateX(-5px)' },
    '50%': { transform: 'translateX(5px)' },
    '75%': { transform: 'translateX(-5px)' },
    '100%': { transform: 'translateX(0)' },
  },
  animation: 'shake 1s ease-in-out',
});

export interface ButtonColor {
  disabled: string;
  standard: string;
  hover: string;
  border?: string;
  textColor?: string;
  textShadow?: string;
}

export const GREEN: ButtonColor = Object.freeze({
  disabled: '#507255',
  standard: '#488b49',
  hover: '#4aad52'
});

export const LIGHTMODE_GREEN: ButtonColor = Object.freeze({
  disabled: '#507255',
  standard: '#89c28a',
  hover: '#4aad52'
});

export const RED: ButtonColor = Object.freeze({
  disabled: '#735350',
  standard: '#8C494C',
  hover: '#AD4C4B'
});

export const BLUE: ButtonColor = Object.freeze({
  disabled: '#4f5673',
  standard: '#495d8c',
  hover: '#4b64ad'
});

export const BROWN: ButtonColor = Object.freeze({
  disabled: '#72674f',
  standard: '#8a7547',
  hover: '#ab8c49',
});

export const LIGHTMODE_YES: ButtonColor = Object.freeze({
  disabled: '#808080',
  border: '#800000',
  standard: "#2AA298",
  hover: "#34cbbe",
  textColor: 'white',
  textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
});

export const LIGHTMODE_NO: ButtonColor = Object.freeze({
  disabled: '#507255',
  border: '#800000',
  standard: "#cc0000",
  hover: "#ff1a1a",
  textColor: 'white',
  textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
});

export interface Theme {
  foreground: 'white' | 'black';
  tester: string;
  backgroundColor: string;
  transparentBackgroundColor: (a: number) => string;
  titleBarBackground: string;
  fileContainerBackground: string;
  leftBarContainerBackground: string;
  editorPageBackground: string;
  editorConsoleBackground: string;
  editorBackground: string;
  homeStartContainerBackground: string;
  selectedUserBackground: string;
  selectedProjectBackground: string;
  selectedFileBackground: string;
  hoverFileBackground: string;
  hoverOptionBackground: string;
  whiteText: string;
  dialogBoxTitleBackground: string;



  yesButtonColor: ButtonColor;
  color: string;
  borderColor: string;
  borderRadius: number;
  widget: {
    padding: number;
  };
  itemPadding: number;
  switch: {
    on: {
      primary: string;
      secondary: string;
    };
    off: {
      primary: string;
      secondary: string;
    }
  };

  iconColor: string;
  lighten: (frac: number) => string;
  darken: (frac: number) => string;
}

export const COMMON: Theme = {
  foreground: undefined,
  backgroundColor: undefined,
  transparentBackgroundColor: undefined,
  color: undefined,
  titleBarBackground: undefined,
  homeStartContainerBackground: undefined,
  selectedUserBackground: undefined,
  selectedProjectBackground: undefined,
  selectedFileBackground: undefined,
  hoverFileBackground: undefined,
  fileContainerBackground: undefined,
  leftBarContainerBackground: undefined,
  editorPageBackground: undefined,
  editorConsoleBackground: undefined,
  tester: undefined,
  editorBackground: undefined,
  yesButtonColor: undefined,
  hoverOptionBackground: undefined,
  dialogBoxTitleBackground: undefined,
  whiteText: undefined,

  borderColor: undefined,
  borderRadius: 10,
  widget: {
    padding: 10
  },
  itemPadding: 5,
  switch: {
    on: {
      primary: 'rgb(255, 255, 255)',
      secondary: 'rgba(255, 255, 255, 0.2)'
    },
    off: {
      primary: 'rgb(127, 127, 127)',
      secondary: 'rgba(255, 255, 255, 0.1)'
    }
  },
  lighten: undefined,
  darken: undefined,

  iconColor: undefined
};

export const LIGHT: Theme = {
  ...COMMON,
  foreground: 'white',

  color: '#403f53',
  backgroundColor: '#fff',
  titleBarBackground: '#f4ecec',
  fileContainerBackground: '#f4ecec',
  leftBarContainerBackground: '#f4ecec',
  homeStartContainerBackground: '#f4ebec',
  selectedUserBackground: '#dadada',
  selectedProjectBackground: '#dadada',
  selectedFileBackground: '#d3e8f9',
  hoverFileBackground: '#e4f1fb',
  hoverOptionBackground: '#e4f1fb',
  yesButtonColor: LIGHTMODE_YES,
  dialogBoxTitleBackground: '#e3cece',
  whiteText: 'white',

  borderColor: '#ede0e0',
  iconColor: '#f5ebeb',
  editorPageBackground: '#FBFBFB',
  editorConsoleBackground: '#fff6f7',
  editorBackground: '#fbfbfb',
  tester: '#ff0000',




  transparentBackgroundColor: (a) => `rgba(255, 255, 255, ${a})`,
  switch: {
    on: {
      primary: 'rgb(0, 0, 0)',
      secondary: 'rgb(72, 139, 73)',
    },
    off: {
      primary: 'rgb(127, 127, 127)',
      secondary: 'rgba(0, 0, 0, 0.1)',
    },
  },
  lighten: (frac) => `rgba(0, 0, 0, ${frac})`,
  darken: (frac) => `rgba(255, 255, 255, ${frac})`,
};

export const DARK: Theme = {
  ...COMMON,
  foreground: 'black',
  color: '#fff',
  backgroundColor: '#212121',
  transparentBackgroundColor: (a) => `rgba(${0x21}, ${0x21}, ${0x21}, ${a})`,
  borderColor: '#323232',


  switch: {
    on: {
      primary: 'rgb(255, 255, 255)',
      secondary: 'rgb(72, 139, 73)',
    },
    off: {
      primary: 'rgb(127, 127, 127)',
      secondary: 'rgba(255, 255, 255, 0.1)',
    },
  },
  lighten: (frac) => `rgba(255, 255, 255, ${frac})`,
  darken: (frac) => `rgba(0, 0, 0, ${frac})`,
};

export interface ThemeProps {
  theme: Theme;
}