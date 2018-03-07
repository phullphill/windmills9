import { select, put } from 'redux-saga/effects';
import { registerTakeEverySaga, COMPASS } from 'common';
import { boardSelectors } from 'board';
import { playerActions } from './playerActions';
import { playerSelectors } from './playerSelectors';

export function* nextPlayerHandler(action) {

	const state = yield select();
	const allPlayers = playerSelectors.players.all(state);
	const activePlayer = playerSelectors.players.active(state);

	const activePlayerIndex = allPlayers.findIndex((player) => player.id === activePlayer.id);
	const nextPlayerIndex = (activePlayerIndex + 1) % allPlayers.length;
	const nextPlayer = allPlayers[nextPlayerIndex];
	yield put(playerActions.setActivePlayer(nextPlayer.id));

	if (!nextPlayer.isAI) {
		return;
	}

	// determine strategy - which mill to target

	// figure out which miller to move
	let activeMiller = playerSelectors.player.activeMiller(state, nextPlayer.id);
	if (!activeMiller) {
		const allMillers = playerSelectors.player.millers(state, nextPlayer.id);
		activeMiller = allMillers.first();
	}

	// set it active
	yield put(playerActions.setActiveMiller({ playerId: nextPlayer.id, millerId: activeMiller.id }));

	// decide where to move it to
	const board = boardSelectors.board(state);
	const toDirection = COMPASS.NORTH;
	const toPosition = board.nextPositionFrom(activeMiller.position, toDirection);

	// move it
	yield put(playerActions.moveMiller({ playerId: nextPlayer.id, millerId: activeMiller.id, toPosition }));

	// next player
	yield put(playerActions.nextPlayer.request());
}
registerTakeEverySaga(playerActions.nextPlayer, nextPlayerHandler);
