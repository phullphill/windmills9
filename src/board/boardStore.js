
import Immutable from 'immutable';
import { COMPASS, SPIN, determineMillSpin, registerReducers } from 'common';
import { Board } from 'models';
import { boardActions } from './boardActions';

export const boardOptions = {
	width: 8,
	height: 8,
	portWidth: 8,
	portHeight: 8,
};

function initialState() {
	return Immutable.Record({
		board: new Board(boardOptions),
		activeVaneId: null,
	})();
}

function selectVane(state, vaneId) {
	const activeVaneId = state.get('activeVaneId');
	if (vaneId === activeVaneId) {
		return state;
	}
	return state.set('activeVaneId', vaneId);
}

function rotateVane(state, vaneId, spinDirection) {
	const vane = state.getIn(['board', 'vanes', vaneId]);
	const currentDirection = vane.direction;
	const nextDirection = spinDirection === SPIN.CLOCKWISE ? COMPASS.after2(currentDirection) : COMPASS.before2(currentDirection);
	return state.setIn(['board', 'vanes', vane.id, 'direction'], nextDirection)
		.withMutations((mutatableState) => {
			const millIds = COMPASS.quarters.map((k) => vane.millIds[k]);
			millIds.forEach((id) => {
				const millVaneIds = state.getIn(['board', 'mills', id, 'vaneIds']);
				const spin = determineMillSpin(millVaneIds, state.getIn(['board', 'vanes']));
				mutatableState = mutatableState.setIn(['board', 'mills', id, 'spin'], spin);
			});
			// return mutatableState.setIn(['activePlayerId'], nextPlayer(mutatableState));
		});
}

export const boardStore = (state = initialState(), action = {}) => {
	const { payload } = action;
	switch (action.type) {

		case boardActions.selectVane.type:
			return selectVane(state, payload);

		case boardActions.rotateVane.type:
			return rotateVane(state, payload.vaneId, payload.direction);

		default:
			return state;

	}
};

registerReducers({ board: boardStore });
