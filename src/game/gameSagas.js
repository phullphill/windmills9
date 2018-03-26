import { select, put, call, all } from 'redux-saga/effects';
import { registerTakeEverySaga } from 'common';
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

}
registerTakeEverySaga(gameActions.nextPlayer, nextPlayerHandler);
