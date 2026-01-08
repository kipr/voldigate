import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reduceDocumentation } from 'ivygate/dist/state/reducer/documentation';
import * as reducer from './reducer';

const rootReducer = combineReducers({
  documentation: reduceDocumentation,
  i18n: reducer.reduceI18n,
});

export type State = ReturnType<typeof rootReducer>;

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware())
);

(store as any).__id = Math.random().toString(16).slice(2);
console.log("CREATED STORE ID:", (store as any).__id);

(window as any).__APP_STORE__ = store;

export default store;
