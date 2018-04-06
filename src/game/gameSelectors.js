import { transformObject, COMPASS } from 'common';
import { nextPositionFrom } from 'models';

export const gameSelectors = {

	board: {
		board: (state) => state.game.board,
	},

	vanes: {
	},

	vane: {
		byId: (state, vaneId) => gameSelectors.board.board(state).vanes.get(vaneId),
		millIds: (state, vaneId) => gameSelectors.vane.byId(state, vaneId).millIds,
		mills: (state, vaneId) => {
			const millIds = gameSelectors.vane.millIds(state, vaneId).toJS();
			return transformObject(millIds, COMPASS.quarters, (millId) => gameSelectors.mill.byId(state, millId));
		},
		vertices: (state, playerId, vaneId) => {
			const player = gameSelectors.player.byId(state, playerId);
			const vane = gameSelectors.vane.byId(state, vaneId);
			const vaneMills = gameSelectors.vane.mills(state, vaneId);
			const vanePointDirections = COMPASS.quarters.filter((q) => q !== (player.colour === 'black' ? COMPASS.opposite(vane.direction) : vane.direction));
			return vanePointDirections.map((d) => vaneMills[d].position);
		},
		apexPosition: (state, playerId, vaneId) => {
			const player = gameSelectors.player.byId(state, playerId);
			const vane = gameSelectors.vane.byId(state, vaneId);
			const vaneMills = gameSelectors.vane.mills(state, vaneId);
			const apexDirection = (player.colour === 'black' ? vane.direction : COMPASS.opposite(vane.direction));
			return vaneMills[apexDirection].position;
		},
		oppositeApexPosition: (state, playerId, vaneId) => {
			const player = gameSelectors.player.byId(state, playerId);
			const vane = gameSelectors.vane.byId(state, vaneId);
			const vaneMills = gameSelectors.vane.mills(state, vaneId);
			const oppositeApexDirection = (player.colour === 'black' ? COMPASS.opposite(vane.direction) : vane.direction);
			return vaneMills[oppositeApexDirection].position;
		},
		isInSpinningMill: (state, vaneId) => {
			const vaneMills = gameSelectors.vane.mills(state, vaneId);
			return COMPASS.quarters.some((q) => vaneMills[q].isSpinning());
		},
	},

	mills: {
		all: (state) => gameSelectors.board.board(state).mills.toArray(),
	},

	mill: {
		byId: (state, millId) => gameSelectors.board.board(state).getIn(['mills', millId]),
		at: (state, position) => gameSelectors.board.board(state).millAt(position),
		vaneIds: (state, millId) => gameSelectors.mill.byId(state, millId).get('vaneIds').toJS(),
		vanes: (state, millId) => {
			const vaneIds = gameSelectors.mill.vaneIds(state, millId);
			const res = transformObject(vaneIds, COMPASS.quarters, (vaneId) => gameSelectors.vane.byId(state, vaneId));
			return res;
		},
	},

	players: {
		all: (state) => state.game.players.toArray(),
		activeId: (state) => state.game.activePlayerId,
		active: (state) => gameSelectors.player.byId(state, gameSelectors.players.activeId(state)),
	},

	player: {
		byId: (state, playerId) => state.game.players.get(playerId),
		millers: (state, playerId) => {
			const player = gameSelectors.player.byId(state, playerId);
			return player.millers;
		},
		freeMillers: (state, playerId) => gameSelectors.player.millers(state, playerId).filter((miller) => !(gameSelectors.mill.at(state, miller.position).isSpinning())),
		activeMillerId: (state, playerId) => gameSelectors.player.byId(state, playerId).activeMillerId,
		activeMiller: (state, playerId) => {
			const activeMillerId = gameSelectors.player.activeMillerId(state, playerId);
			return activeMillerId ? gameSelectors.miller.byId(state, playerId, activeMillerId) : null;
		},
		activeVaneId: (state, playerId) => gameSelectors.player.byId(state, playerId).activeVaneId,
		activeVane: (state, playerId) => {
			const activeVaneId = gameSelectors.player.activeVaneId(state, playerId);
			return activeVaneId ? gameSelectors.vane.byId(state, activeVaneId) : null;
		},
		spinningMillCount(state, playerId) {
			const millers = gameSelectors.player.millers(state, playerId);
			return millers.reduce((count, miller) => {
				const mill = gameSelectors.mill.at(state, miller.position);
				return count + (mill.isSpinning() ? 1 : 0);
			}, 0);
		},

		points: (state, playerId) => gameSelectors.player.byId(state, playerId).points,
	},

	miller: {
		byId: (state, playerId, millerId) => state.game.players.getIn([playerId, 'millers', millerId]),
		atPosition: (state, playerId, position) => {
			const player = gameSelectors.player.byId(state, playerId);
			return player.millerAt(position);
		},
		position: (state, playerId, millerId) => gameSelectors.miller.byId(state, playerId, millerId).position,
		nextPosition: (state, playerId, millerId, toDirection) => {
			const currentPosition = gameSelectors.miller.position(state, playerId, millerId);
			return nextPositionFrom(currentPosition, toDirection);
		},
	},

	wind: {
		direction: (state) => state.game.wind.direction,
		force: (state) => state.game.wind.force,
	},

};
