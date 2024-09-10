import { applyMiddleware, combineReducers, compose, createStore,  } from 'redux';

import * as reducer from './reducer';
import { DocumentationState, I18n, Robots, Scenes } from './State';
import { connectRouter, RouterState, routerMiddleware } from 'connected-react-router';
import history from './history';
import { CHALLENGE_COLLECTION, CHALLENGE_COMPLETION_COLLECTION, SCENE_COLLECTION } from '../db/constants';
import Selector from '../db/Selector';


// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export default createStore(combineReducers<State>({
  scenes: reducer.reduceScenes,
  robots: reducer.reduceRobots,
  documentation: reducer.reduceDocumentation,
  router: connectRouter(history),
  i18n: reducer.reduceI18n,
}), composeEnhancers(
  applyMiddleware(
    routerMiddleware(history)
  )
));
/* eslint-enable @typescript-eslint/no-unsafe-call */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */

export interface State {
  scenes: Scenes;
  robots: Robots;
  documentation: DocumentationState;
  router: RouterState;
  i18n: I18n;
}
