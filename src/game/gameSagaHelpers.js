import { put, all, call, select } from 'redux-saga/effects';
import { BOARD_WIDTH, BOARD_HEIGHT, COMPASS, isEven } from 'common';
import { nextPositionFrom } from 'models';
import { gameActions } from './gameActions';
import { gameSelectors } from './gameSelectors';

export function shortestDistance(delta, maxDimension) {
	const abs = Math.abs(delta);
	return abs <= (maxDimension / 2) ? delta : (maxDimension - abs) * Math.sign(-1 * delta);
}

export function moveDelta(fromPosition, toPosition) {
	const deltaX = shortestDistance(toPosition.x - fromPosition.x, BOARD_WIDTH);
	const deltaY = shortestDistance(toPosition.y - fromPosition.y, BOARD_HEIGHT);
	return { deltaX, deltaY };
}

export function moveDirectionIsPossible(board, fromPosition, moveDirection) {
	if (COMPASS.cardinals.some((c) => c === moveDirection)) {
		return true;
	}
	const mill = board.millAt(fromPosition);
	const vaneId = mill.getIn(['vaneIds', moveDirection]);
	const vane = board.vaneById(vaneId);
	const vaneDirection = vane.direction;
	return moveDirection === COMPASS.after2(vaneDirection) || moveDirection === COMPASS.before2(vaneDirection);
}

export function positionIsFree(position, allMillers) {
	return !allMillers.some((m) => m.isAt(position));
}

export function bestStepDirection(deltaX, deltaY) {
	const signDeltaX = Math.sign(deltaX);
	const signDeltaY = Math.sign(deltaY);
	const directionMap = {
		'-1': {
			'-1': COMPASS.NORTHWEST,
			'0': COMPASS.WEST,
			'1': COMPASS.SOUTHWEST,
		},
		'0': {
			'-1': COMPASS.NORTH,
			'0': null,
			'1': COMPASS.SOUTH,
		},
		'1': {
			'-1': COMPASS.NORTHEAST,
			'0': COMPASS.EAST,
			'1': COMPASS.SOUTHEAST,
		},
	};
	return directionMap[signDeltaX][signDeltaY];
}

export function alternateStepDirection(deltaX, deltaY, idealDirection, triedDirections) {
	const absDeltaX = Math.abs(deltaX);
	const absDeltaY = Math.abs(deltaY);
	const countTried = triedDirections.length;
	if (countTried === 8) {
		return null;
	}
	const prevTried = countTried <= 2 ? triedDirections[0] : triedDirections[countTried - 2];
	if (absDeltaX > absDeltaY) {
		return isEven(countTried) ? COMPASS.after(prevTried) : COMPASS.before(prevTried);
	} else {
		return isEven(countTried) ? COMPASS.before(prevTried) : COMPASS.after(prevTried);
	}
}

export function bestNextPosition(board, fromPosition, toPosition, allMillers) {
	const { deltaX, deltaY } = moveDelta(fromPosition, toPosition);
	const idealDirection = bestStepDirection(deltaX, deltaY);
	if (idealDirection === null) {
		throw new Error(`bestStepDirection given identical from ${fromPosition} and target ${toPosition} positions`);
	}
	let bestDirection = idealDirection;
	let nextPosition = nextPositionFrom(fromPosition, bestDirection);
	const triedDirections = [];

	// check ideal next position is possible
	while (bestDirection !== null && (!moveDirectionIsPossible(board, fromPosition, bestDirection) || !positionIsFree(nextPosition, allMillers))) {
		triedDirections.push(bestDirection);
		bestDirection = alternateStepDirection(deltaX, deltaY, idealDirection, triedDirections);
		nextPosition = bestDirection !== null ? nextPositionFrom(fromPosition, bestDirection) : null;
	}

	return nextPosition;
}

export function* takeStepTowards(playerId, millerId, apexPosition) {
	const board = yield select(gameSelectors.board.board);
	const miller = yield select(gameSelectors.miller.byId, playerId, millerId);
	const fromPosition = miller.position;
	const allMillers = yield select(gameSelectors.millers.all);
	const toPosition = bestNextPosition(board, fromPosition, apexPosition, allMillers);
	if (toPosition === null) {
		throw new Error(`takeStepTowards can't determine next position for ${millerId} at ${fromPosition} towards ${apexPosition}`);
	}
	yield put(gameActions.moveMiller({ playerId, millerId, toPosition }));
}

export function* humanMakeBestMove(playerId) {
	// get player's active vane
	const activeVaneId = yield select(gameSelectors.player.activeVaneId, playerId);

	// get apex position of the active vane
	const apexPosition = yield select(gameSelectors.vane.apexPosition, playerId, activeVaneId);

	// is there a miller at the apex
	const allMillers = yield select(gameSelectors.millers.all);
	const isApexEmpty = positionIsFree(apexPosition, allMillers);

	// if empty then move nearest miller towards it
	if (isApexEmpty) {
		const millerId = nearestMiller();
		yield call(takeStepTowards, playerId, millerId, apexPosition);
	}
}

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
