import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { repos } from './reducers';
import thunk from 'redux-thunk';

const INITIAL = {};

const appState = combineReducers({
	repos
});

const devTools =
	typeof window !== 'undefined' && window.devToolsExtension
		? window.devToolsExtension()
		: f => f;

export default createStore(
	appState,
	INITIAL,
	compose(applyMiddleware(thunk), devTools)
	// window.devToolsExtension && window.devToolsExtension()
);
