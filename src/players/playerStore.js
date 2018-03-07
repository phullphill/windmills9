import Immutable from 'immutable';
import { registerReducers } from 'common';
import { createPlayers } from 'models';
import { playerActions } from './playerActions';

const playerConfigs = [
	{ id: 'A', name: 'Phill', colour: 'black', millerColour: 'blue', isAI: false },
	{ id: 'B', name: 'AI', colour: 'white', millerColour: 'green', isAI: true },
];
const nMillersPerPlayer = 3;

function initialState() {
	return Immutable.Record({
		players: createPlayers(playerConfigs, nMillersPerPlayer),
		activePlayerId: playerConfigs[0].id,
	})();
}

function setActivePlayer(state, playerId) {
	const activePlayerId = state.get('activePlayerId');
	if (playerId === activePlayerId) {
		return state;
	}
	return state.set('activePlayerId', playerId);
}

function setActiveMiller(state, { playerId, millerId }) {
	const activeMillerId = state.getIn(['players', playerId, 'activeMillerId']);
	if (millerId === activeMillerId) {
		return state;
	}
	return state.setIn(['players', playerId, 'activeMillerId'], millerId);
}

function moveMiller(state, { playerId, millerId, toPosition }) {
	return state.setIn(['players', playerId, 'millers', millerId, 'position'], toPosition);
}

export const playerStore = (state = initialState(), action = {}) => {
	const { payload } = action;
	switch (action.type) {

		case playerActions.setActivePlayer.type:
			return setActivePlayer(state, payload);

		case playerActions.setActiveMiller.type:
			return setActiveMiller(state, payload);

		case playerActions.moveMiller.type:
			return moveMiller(state, payload);

		default:
			return state;

	}
};

registerReducers({ players: playerStore });
