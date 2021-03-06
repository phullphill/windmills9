
import Immutable from 'immutable';
import { COMPASS, registerReducers, range, randomIntInclusive, BOARD_WIDTH, BOARD_HEIGHT } from 'common';
import { Board, createPlayers, Wind } from 'models';
import { gameActions } from './gameActions';
import { rotateVaneHelper } from './gameStoreHelpers';

export const gameConfig = {
	board: {
		width: BOARD_WIDTH,
		height: BOARD_HEIGHT,
		portWidth: BOARD_WIDTH,
		portHeight: BOARD_HEIGHT,
	},
	players: {
		players: [
			{ id: 'A', name: 'Phill', colour: 'black', millerColour: 'blue', isAI: false },
			{ id: 'B', name: 'AI', colour: 'white', millerColour: 'green', isAI: true },
		],
		nMillersPerPlayer: 3,
	},
	wind: {
		minForce: 0,
		maxForce: 10,
	},
};

function initialState() {
	return Immutable.Record({
		board: new Board(gameConfig.board),
		players: createPlayers(gameConfig.players.players, gameConfig.players.nMillersPerPlayer),
		activePlayerId: gameConfig.players.players[0].id,
		wind: new Wind(COMPASS.random(), randomIntInclusive(gameConfig.wind.minForce, gameConfig.wind.maxForce)),
	})();
}

function rotateVane(state, playerId, vaneId, spinDirection) {
	return state.withMutations((mutatableState) => {
		mutatableState = rotateVaneHelper(mutatableState, playerId, vaneId, spinDirection);
	});
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

function setActiveVane(state, { playerId, vaneId }) {
	const activeVaneId = state.getIn(['players', playerId, 'activeVaneId']);
	// if (vaneId === activeVaneId || !vaneIsRotateable({ game: state }, playerId, vaneId)) {
	if (vaneId === activeVaneId) {
		return state;
	}
	return state.setIn(['players', playerId, 'activeVaneId'], vaneId);
}

function addPoints(state, { playerId, millerId, points }) {
	if (points === 0) {
		return state;
	}
	const oldPoints = state.getIn(['players', playerId, 'millers', millerId, 'points']);
	return state.setIn(['players', playerId, 'millers', millerId, 'points'], oldPoints + points);
}

function randomWindChange(state) {
	const oldWind = state.get('wind');
	let newDirection = oldWind.direction;
	let newForce = oldWind.force;

	const swing = randomIntInclusive(-2, 2);
	if (swing !== 0) {
		range(1, Math.abs(swing)).forEach(() => {
			if (swing > 0) {
				newDirection = COMPASS.after(newDirection);
			} else {
				newDirection = COMPASS.before(newDirection);
			}
		});
	}

	const forceChange = randomIntInclusive(-2, 2);
	newForce += forceChange;
	newForce = (newForce < gameConfig.wind.minForce ? gameConfig.wind.minForce : newForce);
	newForce = (newForce > gameConfig.wind.maxForce ? gameConfig.wind.maxForce : newForce);

	if (newDirection === oldWind.direction && newForce === oldWind.force) {
		return state;
	}

	const newWind = new Wind(newDirection, newForce);
	return state.set('wind', newWind);
}

export const gameStore = (state = initialState(), action = {}) => {
	const { payload } = action;
	switch (action.type) {

		case gameActions.rotateVane.type:
			return rotateVane(state, payload.playerId, payload.vaneId, payload.spinDirection);

		case gameActions.setActivePlayer.type:
			return setActivePlayer(state, payload);

		case gameActions.setActiveVane.type:
			return setActiveVane(state, payload);

		case gameActions.setActiveMiller.type:
			return setActiveMiller(state, payload);

		case gameActions.moveMiller.type:
			return moveMiller(state, payload);

		case gameActions.addPoints.type:
			return addPoints(state, payload);

		case gameActions.randomWindChange.type:
			return randomWindChange(state, payload);

		default:
			return state;

	}
};

registerReducers({ game: gameStore });
