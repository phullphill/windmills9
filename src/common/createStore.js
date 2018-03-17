import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { call, fork, put, all, takeEvery } from 'redux-saga/effects';
import createSagaMiddleware, { END } from 'redux-saga';
import Immutable from 'immutable';
import { ignoreActions } from './middleware';

const DEFAULT_IGNORABLE_ACTIONS = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED'];

/**
 * This defines the initial (or default) store config
 * which is used when createStoreAndMiddleware is called.
 * It defines sets of reducers, sagas and middleware
 * and other useful configuration.
 * */
export const registeredConfig = {
	reducers: {},
	sagas: [],
	middleware: [],
	ignorableActions: DEFAULT_IGNORABLE_ACTIONS,
};

/**
 * Registers a set of reducers for inclusion in root store
 * @param {Object} reducers reducers to register
 * @returns {void}
 */
export function registerReducers(reducers) {
	registeredConfig.reducers = { ...registeredConfig.reducers, ...reducers };
}

/**
 * Registers a set of sagas for inclusion in root saga
 * @param {Array} sagas sagas to register
 * @returns {void}
 */
export function registerSagas(sagas) {
	registeredConfig.sagas.push(...sagas);
}

/**
 * DO NOT USE. This function is exported solely for testing purposes.
 * @private
 * */
export function* takeEverySagaHandler(sagaAction, handler, action) {
	try {
		const response = yield call(handler, action);

		if (response instanceof Error) {
			yield put(sagaAction.failure(response, action.payload.request, action.meta));
			return;
		}

		if (response && response.error) {
			yield put(sagaAction.failure(response.error, action.payload.request, action.meta));
			return;
		}

		yield put(sagaAction.success(response, action.payload.request, action.meta));
	} catch (error) {
		yield put(sagaAction.failure(error, action.payload.request, action.meta));
	}
}

/**
 * @typedef {function} SagaActionHandler
 * A function that will process a reduxx action that has been fired
 * @param {object} action
 * @public
 */

/**
 * Registers a handler for processing an action.
 * This is achieved by creating a redux saga that wraps the handler in a takeEvery for the '.request' of the sagaAction you supply
 * This saga will automatically try {} catch {} the handler, and fire a '.success' or '.failure' (as approriate) once the handler is complete
 * @param {SagaAction} sagaAction The action whose '.request' you want to respond to and whose '.success' or '.failure' you want to issue
 * @param {SagaActionHandler} handler The handler to run process the action with
 * @returns {Saga} The saga that was registered
 */
export function registerTakeEverySaga(sagaAction, handler) {
	function* saga() {
		yield takeEvery(sagaAction.request.type, takeEverySagaHandler, sagaAction, handler);
	}
	registerSagas([saga]);

	return saga;
}

/**
 * Registers a set of actions which are to be ignored by the root store, and logging.
 * @param {Array} ignorableActions action types to register
 * @returns {void}
 */
export function registerIgnorableActions(ignorableActions) {
	registeredConfig.ignorableActions.push(...ignorableActions);
}

/**
 * Set up logger middleware
 * @returns {function} logger middleware function
 */
function createLoggerMiddleware() {
	return createLogger({
		collapsed: true,
		predicate: (action) => (!registeredConfig.ignorableActions.includes(action.type)),
		stateTransformer: (state) => {
			const newState = {};
			for (const i of Object.keys(state)) {
				if (Immutable.Iterable.isIterable(state[i])) {
					newState[i] = state[i].toJS();
				} else {
					newState[i] = state[i];
				}
			}
			return newState;
		},
	});
}

const sagaMiddleware = createSagaMiddleware();

function registerMiddleware(...middlewares) {
	registeredConfig.middleware.push(...middlewares);
}

function registerStandardMiddleware(env) {
	registerMiddleware(
		thunk,
		sagaMiddleware,
		(env === 'production' ? null : createLoggerMiddleware()),
		ignoreActions(registeredConfig.ignorableActions),
	);
}

/**
 * Composes registered sagas into root saga.
 * @param {array} sagas registered sagas to compose
 * @return {array} of forked sagas
 */
function* composeRootSaga(sagas) {
	yield all(sagas.map((saga) => fork(saga)));
}

/**
 * This function provides a means by which the root store and middleware
 * are created and set up for Edge.
 * When createStoreAndMiddleware() is called all registered reducers
 * are combined into one root store. Also all registered sagas are composed
 * into one root saga. And various middleware components are configured.
 * @param {string} env indicates if in 'development' or 'production' environment
 * @return {object} redux store
 */
export function createStoreAndMiddleware(env) {
	const rootStore = combineReducers(registeredConfig.reducers);

	// If no middleware has been provided, assume we wan't the default set
	if (registeredConfig.middleware.length === 0) {
		registerStandardMiddleware(env);
	}

	const appliedMiddleware = compose(applyMiddleware(...registeredConfig.middleware));
	const store = createStore(rootStore, appliedMiddleware);

	sagaMiddleware.run(composeRootSaga, registeredConfig.sagas);

	store.close = () => store.dispatch(END);
	return store;
}
