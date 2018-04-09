import { eventChannel, buffers } from 'redux-saga';
import { select, put, take, call, fork } from 'redux-saga/effects';
import { aiMakeBestMove } from 'ai';
import { registerTakeEverySaga, registerSagas } from 'common';
import { gameActions } from './gameActions';
import { gameSelectors } from './gameSelectors';
import { accumulatePoints, takeStepTowards, humanMakeBestMove } from './gameSagaHelpers';

// export function* nextPlayerHandler(action) {
// 	const state = yield select();
// 	const allPlayers = gameSelectors.players.all(state);
// 	const activePlayer = gameSelectors.players.active(state);

// 	// everyone gets points and the wind changes
// 	yield call(accumulatePoints, state, allPlayers);
// 	yield put(gameActions.randomWindChange());

// 	// who's next
// 	const activePlayerIndex = allPlayers.findIndex((player) => player.id === activePlayer.id);
// 	const nextPlayerIndex = (activePlayerIndex + 1) % allPlayers.length;
// 	const nextPlayer = allPlayers[nextPlayerIndex];
// 	yield put(gameActions.setActivePlayer(nextPlayer.id));

// }
// registerTakeEverySaga(gameActions.nextPlayer, nextPlayerHandler);

export function* takeVaneHandler(action) {
	const { playerId, vaneId } = action.payload.request;

	// set the vane as being active
	yield put(gameActions.setActiveVane({ playerId, vaneId }));

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
			distance: 4, // needs sorting
		}))
		.sort((a, b) => a.distance - b.distance);

	// select the closest
	const best = millerDistances[0];

	// if not at apex take a step towards it
	if (best.distance > 0) {
		yield fork(takeStepTowards, playerId, best.millerId, apexPosition);
	}

	// next player
	yield put(gameActions.nextPlayer.request());
}
registerTakeEverySaga(gameActions.takeVane, takeVaneHandler);

export function createGameClock() {
	return eventChannel((emit) => {
		let secs = 0;
		const intervalId = setInterval(() => {
			emit({ elapsedSeconds: secs++ });
		}, 1000);

		// The subscriber must return an unsubscribe function
		return () => {
			clearInterval(intervalId);
		};
	}, buffers.expanding());
}

export function* playGame(gameClock) {
	let state = yield select();
	const allPlayers = gameSelectors.players.all(state);
	const humanPlayer = allPlayers.find((player) => !player.isAi);
	const aiPlayer = allPlayers.find((player) => player.isAi);
	while (true) {
		const { elapsedSeconds } = yield take(gameClock);
		yield call(humanMakeBestMove, humanPlayer.id);
		if (elapsedSeconds % 2 === 0) {
			yield call(aiMakeBestMove, aiPlayer.id);
		}
		if (elapsedSeconds % 4 === 0) {
			state = yield select();
			yield call(accumulatePoints, state, allPlayers);
		}
		if (elapsedSeconds % 6 === 0) {
			yield put(gameActions.randomWindChange());
		}
	}
}

export function* startGame() {
	const gameClock = yield call(createGameClock);
	yield fork(playGame, gameClock);
}
registerSagas([startGame]);
