import { put, call, take, select } from 'redux-saga/effects';
import { registerSagas } from 'common';
import { gameActions, gameSelectors } from 'game';
import { bestMove } from './aiSagaHelpers';

export function* aiMakeBestMove(playerId) {

	const state = yield select();

	// determine the best miller to move
	const { bestMill, bestMiller, bestNextPosition } = bestMove(state, playerId);
	const { millerId } = bestMiller;
	console.log(`aiMakeBestMove bestMill=${bestMill.millId} bestMillerId=${millerId} bestNextPosition=${bestNextPosition.toString()} `);

	// activate the best miller
	const activeMillerId = gameSelectors.player.activeMillerId(state, playerId);
	if (!activeMillerId || activeMillerId !== millerId) {
		yield put(gameActions.setActiveMiller({ playerId, millerId }));
	}
	console.log(`aiMakeBestMove active miller now ${gameSelectors.player.activeMillerId(state, playerId)} `);

	// and move it
	yield put(gameActions.moveMiller({ playerId, millerId: bestMiller.millerId, toPosition: bestNextPosition }));

}

// export function* aiPlay() {

// 	while (true) {
// 		const action = yield take(gameActions.setActivePlayer.type);
// 		const playerId = action.payload;
// 		const player = yield select(gameSelectors.player.byId, playerId);
// 		if (player.isAI) {
// 			yield call(aiMakeBestMove, playerId);
// 			yield put(gameActions.nextPlayer.request());
// 		}
// 	}

// }
// registerSagas([aiPlay]);
