import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";

import store from './state';
import { db, userDB } from './database_js/Database';

import DatabaseService from './database_js/DatabaseService';

// Use them somewhere in your code

const dbService = new DatabaseService();

const reactRoot = document.getElementById('reactRoot');

const engine = new Styletron({ prefix: 'style' });

const debug = process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();

import { ConnectedRouter } from 'connected-react-router';
import history from './state/history';
import App from './App';

ReactDom.render(
  <StyletronProvider value={engine} debug={debug} debugAfterHydration>
    <ReduxProvider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </ReduxProvider>
  </StyletronProvider>,
  reactRoot
);