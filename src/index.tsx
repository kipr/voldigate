import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { ProgramRunProvider } from './ProgramRunContext';
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import { BrowserRouter } from 'react-router-dom';
import store from 'ivygate/src/state';
import { createRoot } from 'react-dom/client';

const reactRoot = document.getElementById('reactRoot');

const engine = new Styletron({ prefix: 'style' });

const debug = process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();


import history from './state/history';
import App from './App';
if (reactRoot) {
  createRoot(reactRoot).render(
    <StyletronProvider value={engine} debug={debug} debugAfterHydration>
      <ReduxProvider store={store}>
        <ProgramRunProvider>
          <App />
        </ProgramRunProvider>
      </ReduxProvider>
    </StyletronProvider>
  );
}
