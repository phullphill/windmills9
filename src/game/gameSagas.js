import { select, put, call, all } from 'redux-saga/effects';
import { registerTakeEverySaga, COMPASS } from 'common';
import { nearestBestMillAndMiller } from 'ai';
import { gameActions } from './gameActions';
import { gameSelectors } from './gameSelectors';

export function* accumulatePoints(state, allPlayers) {
	const windForce = gameSelectors.wind.force(state);
	if (windForce === 0) {
		return;
	}
	const pointsActions = [];
	allPlayers.forEach((player) => {
		const millers = gameSelectors.player.millers(state, player.id);
		millers.forEach((miller) => {
			const mill = gameSelectors.mill.at(state, miller.position);
			if (mill.isSpinning()) {
				pointsActions.push(put(gameActions.addPoints({ playerId: player.id, millerId: miller.id, points: windForce })));
			}
		});
	});
	if (pointsActions.length > 0) {
		yield all(pointsActions);
	}
}

export function* aiPlayerActions(state, player) {

	const playerId = player.id;

	// determine which mill to target
	const { bestMillId, bestMillerId } = nearestBestMillAndMiller(state, playerId);

	// activate the best miller
	let millerId = gameSelectors.player.activeMiller(state, playerId);
	if (!millerId || millerId !== bestMillerId) {
		millerId = bestMillerId;
		yield put(gameActions.setActiveMiller({ playerId, millerId }));
	}

	// decide where to move it to
	const activeMiller = gameSelectors.miller.byId(state, playerId, millerId);
	const fromPosition = activeMiller.position;
	const board = gameSelectors.board.board(state);
	const toDirection = COMPASS.random();
	const toPosition = board.nextPositionFrom(fromPosition, toDirection);

	// move it
	yield put(gameActions.moveMiller({ playerId, millerId, toPosition }));

}

export function* nextPlayerHandler(action) {
	const state = yield select();
	const allPlayers = gameSelectors.players.all(state);
	const activePlayer = gameSelectors.players.active(state);

	// everyone gets points and the wind changes
	yield call(accumulatePoints, state, allPlayers);
	yield put(gameActions.randomWindChange());

	// who's next
	const activePlayerIndex = allPlayers.findIndex((player) => player.id === activePlayer.id);
	const nextPlayerIndex = (activePlayerIndex + 1) % allPlayers.length;
	const nextPlayer = allPlayers[nextPlayerIndex];
	yield put(gameActions.setActivePlayer(nextPlayer.id));

	// allow ai to play too
	if (nextPlayer.isAI) {
		yield call(aiPlayerActions, state, nextPlayer);
		yield put(gameActions.nextPlayer.request());
	}

}
registerTakeEverySaga(gameActions.nextPlayer, nextPlayerHandler);
