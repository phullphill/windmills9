import { gameSelectors } from 'board';

const activePlayerIdSelector = (state) => state.players.activePlayerId;
const playerByIdSelector = (state, playerId) => state.players.getIn(['players', playerId]);
const millerByIdSelector = (state, playerId, millerId) => state.players.getIn(['players', playerId, 'millers', millerId]);

export const gameSelectors = {

	players: {
		all: (state) => state.players.players.toArray(),
		activeId: (state) => activePlayerIdSelector(state),
		active: (state) => playerByIdSelector(state, activePlayerIdSelector(state)),
	},

	player: {
		byId: (state, playerId) => playerByIdSelector(state, playerId),
		millers: (state, playerId) => playerByIdSelector(state, playerId).millers,
		activeMillerId: (state, playerId) => playerByIdSelector(state, playerId).activeMillerId,
		activeMiller: (state, playerId) => {
			const activeMillerId = gameSelectors.player.activeMillerId(state, playerId);
			if (!activeMillerId) {
				return null;
			}
			return state.players.getIn(['players', playerId, 'millers', activeMillerId]);
		},
		points: (state, playerId) => playerByIdSelector(state, playerId).points,
	},

	miller: {
		byId: (state, playerId, millerId) => millerByIdSelector(state, playerId, millerId),
		position: (state, playerId, millerId) => millerByIdSelector(state, playerId, millerId).position,
		nextPosition: (state, playerId, millerId, toDirection) => {
			const board = gameSelectors.board(state);
			const currentPosition = gameSelectors.miller.position(state, playerId, millerId);
			return board.nextPositionFrom(currentPosition, toDirection);
		},
	},

};
