
/**
 * This middleware will cause the specified actions to be ignored.
 * If a listed action is dispatched it will go no further.
 * Note that this middleware comes after the sagas in the middleware sequence.
 * Thus ignored actions are still logged and processed by the sagas, but are not passed onto the store.
 *
 * @param {array} actionTypesToIgnore Array of action types which are ignored.
 * @returns {function} a dispatch function - see http://redux.js.org/docs/advanced/Middleware.html
 */
export const ignoreActions = (actionTypesToIgnore) => (store) => (next) => (action) => {
	if (actionTypesToIgnore.includes(action.type)) {
		return null;
	}
	return next(action);
};
