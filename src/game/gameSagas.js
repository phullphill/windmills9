import { select, put } from 'redux-saga/effects';
import { registerTakeEverySaga, COMPASS } from 'common';
import { nearestBestMillAndMiller } from 'ai';
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

	// determine which mill to target
	const { bestMillId, bestMillerId } = nearestBestMillAndMiller(state);

	// figure out which miller to move
	let activeMillerId = gameSelectors.player.activeMiller(state, nextPlayer.id);
	if (!activeMillerId || activeMillerId !== bestMillerId) {
		activeMillerId = bestMillerId;

		// set it active
		yield put(gameActions.setActiveMiller({ playerId: nextPlayer.id, millerId: activeMillerId }));
	}

	// decide where to move it to
	const activeMiller = gameSelectors.miller.byId(state, nextPlayer.id, activeMillerId);
	const fromPosition = activeMiller.position;
	const board = gameSelectors.board.board(state);
	const toDirection = COMPASS.random();
	const toPosition = board.nextPositionFrom(fromPosition, toDirection);

	// move it
	yield put(gameActions.moveMiller({ playerId: nextPlayer.id, millerId: activeMillerId, toPosition }));

	// next player
	yield put(gameActions.nextPlayer.request());
}
registerTakeEverySaga(gameActions.nextPlayer, nextPlayerHandler);
