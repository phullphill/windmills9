import { select, put, call, fork } from 'redux-saga/effects';
import { registerTakeEverySaga } from 'common';
import { gameActions } from './gameActions';
import { gameSelectors } from './gameSelectors';
import { accumulatePoints, distanceBetween, takeStepTowards } from './gameSagaHelpers';

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

export function* takeVaneHandler(action) {
	const { playerId, vaneId } = action.payload;

	// set the vane as being active
	yield put(gameActions.setActiveVane(playerId, vaneId));

	// determine the free millers (those not on a spinning mill)
	const freeMillers = yield select(gameSelectors.player.freeMillers, playerId);

	// check the player has at least 1 free miller
	if (freeMillers.length === 0) {
		return;
	}

	// analyse free miller distances to the apex of the vane, and sort them
	const apexPosition = yield select(gameSelectors.vane.apexPosition, playerId, vaneId);
	const millerDistances = freeMillers
		.map((miller) => ({
			millerId: miller.id,
			distance: distanceBetween(miller.position, apexPosition),
		}))
		.sort((a, b) => a.distance - b.distance);

	// select the closest
	const best = millerDistances[0];

	// if not at apex take a step towards it
	if (best.distance > 0) {
		yield fork(takeStepTowards, playerId, best.millerId, apexPosition);
	}

	// next player
	yield put(gameActions.nextPlayer());
}
registerTakeEverySaga(gameActions.takeVane, takeVaneHandler);
