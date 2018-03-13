import { select, put } from 'redux-saga/effects';
import { registerTakeEverySaga, COMPASS } from 'common';
import { gameActions } from './gameActions';
import { gameSelectors } from './gameSelectors';

export function* nextPlayerHandler(action) {
	const state = yield select();
	const allPlayers = gameSelectors.players.all(state);
	const activePlayer = gameSelectors.players.active(state);

	const activePlayerIndex = allPlayers.findIndex((player) => player.id === activePlayer.id);
	const nextPlayerIndex = (activePlayerIndex + 1) % allPlayers.length;
	const nextPlayer = allPlayers[nextPlayerIndex];
	yield put(gameActions.setActivePlayer(nextPlayer.id));

	if (!nextPlayer.isAI) {
		return;
	}

	// determine strategy - which mill to target

	// figure out which miller to move
	let activeMiller = gameSelectors.player.activeMiller(state, nextPlayer.id);
	if (!activeMiller) {
		const allMillers = gameSelectors.player.millers(state, nextPlayer.id);
		activeMiller = allMillers.first();
	}

	// set it active
	yield put(gameActions.setActiveMiller({ playerId: nextPlayer.id, millerId: activeMiller.id }));

	// decide where to move it to
	const board = gameSelectors.board.board(state);
	const toDirection = COMPASS.NORTH;
	const toPosition = board.nextPositionFrom(activeMiller.position, toDirection);

	// move it
	yield put(gameActions.moveMiller({ playerId: nextPlayer.id, millerId: activeMiller.id, toPosition }));

	// next player
	yield put(gameActions.nextPlayer.request());
}
registerTakeEverySaga(gameActions.nextPlayer, nextPlayerHandler);
