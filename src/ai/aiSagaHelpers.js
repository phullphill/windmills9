import Immutable from 'immutable';
import { gameSelectors, shortestDistance } from 'game';
import { COMPASS, SPIN } from 'common';
import { nextPositionFrom } from 'models';
import { MillScore, MillerScore, Analysis } from './models';

const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;

function rotateDistance(spin, quarter, vaneDirection) {
	const desiredDirections = {
		[SPIN.CLOCKWISE]: {
			[COMPASS.NORTHEAST]: COMPASS.SOUTHEAST,
			[COMPASS.SOUTHEAST]: COMPASS.SOUTHWEST,
			[COMPASS.SOUTHWEST]: COMPASS.NORTHWEST,
			[COMPASS.NORTHWEST]: COMPASS.NORTHEAST,
		},
		[SPIN.ANTICLOCKWISE]: {
			[COMPASS.NORTHEAST]: COMPASS.NORTHWEST,
			[COMPASS.SOUTHEAST]: COMPASS.NORTHEAST,
			[COMPASS.SOUTHWEST]: COMPASS.SOUTHEAST,
			[COMPASS.NORTHWEST]: COMPASS.SOUTHWEST,
		},
	};
	const desiredDirection = desiredDirections[spin][quarter];
	if (vaneDirection === desiredDirection) {
		return 0;
	} else if (vaneDirection === COMPASS.opposite(desiredDirection)) {
		return 2;
	}
	return 1;
}

// function shortestDistance(delta, dimension) {
// 	const abs = Math.abs(delta);
// 	return abs <= (dimension / 2) ? delta : (dimension - abs) * Math.sign(-1 * delta);
// }

function moveDelta(fromPosition, toPosition) {
	const deltaX = shortestDistance(toPosition.x - fromPosition.x, BOARD_WIDTH);
	const deltaY = shortestDistance(toPosition.y - fromPosition.y, BOARD_HEIGHT);
	return { deltaX, deltaY };
}

function moveEstimate(fromPosition, toPosition) {
	let { deltaX, deltaY } = moveDelta(fromPosition, toPosition);
	deltaX = Math.abs(deltaX);
	deltaY = Math.abs(deltaY);
	return deltaX > deltaY ? deltaY + (deltaX - deltaY) : deltaX + (deltaY - deltaX);
}

function analyseMills(state) {
	const millScores = {};
	const mills = gameSelectors.mills.all(state);
	mills.forEach((mill) => {
		const millSpin = mill.spin;
		const millVanes = gameSelectors.mill.vanes(state, mill.id);
		if (millSpin !== SPIN.NOSPIN) {
			millScores[mill.id] = new MillScore(mill.id, millSpin, 0);
		} else {
			let clockwiseScore = 0;
			COMPASS.quarters.forEach((quarter) => {
				clockwiseScore += rotateDistance(SPIN.CLOCKWISE, quarter, millVanes[quarter].direction);
			});
			if (clockwiseScore <= 4) {
				millScores[mill.id] = new MillScore(mill.id, SPIN.CLOCKWISE, clockwiseScore);
			} else {
				millScores[mill.id] = new MillScore(mill.id, SPIN.ANTICLOCKWISE, clockwiseScore);
			}
		}
	});
	return new Immutable.Map(millScores);
}

function analyseMillers(state, playerId, millScores) {
	const millers = gameSelectors.player.millers(state, playerId);
	const freeMillers = millers.filter((miller) => !(gameSelectors.mill.at(state, miller.position).isSpinning()));
	const mills = gameSelectors.mills.all(state);
	mills.forEach((mill) => {
		const millerDistances = freeMillers
			.map((miller) => new MillerScore(miller.id, moveEstimate(miller.position, mill.position)))
			.sort((a, b) => a.millerDistance - b.millerDistance);

		const relevantMillerScores = (mill.spin !== SPIN.NOSPIN ? [millerDistances[0]] : millerDistances.slice(0, 3));
		const millerScores = new Immutable.List(relevantMillerScores);
		millScores = millScores.setIn([mill.id, 'millerScores'], millerScores);
	});
	return millScores.sort((a, b) => a.totalScore - b.totalScore);
}

function nearestBestMillAndMiller(state, playerId) {
	const millScores = analyseMillers(state, playerId, analyseMills(state));
	const bestMill = millScores.first();
	const bestMiller = bestMill.millerScores.find((millerScores) => millerScores.millerDistance > 0);

	return new Analysis(millScores, bestMill, bestMiller);
}

function directionByDelta(deltaX, deltaY) {
	if (deltaX < 0) {
		return (deltaY < 0 ? COMPASS.NORTHWEST : COMPASS.SOUTHWEST);
	} else {
		return (deltaY < 0 ? COMPASS.NORTHEAST : COMPASS.SOUTHEAST);
	}
}

export function bestMove(state, playerId) {
	const { bestMill, bestMiller } = nearestBestMillAndMiller(state, playerId);

	const miller = gameSelectors.miller.byId(state, playerId, bestMiller.millerId);
	const fromPosition = miller.position;
	const mill = gameSelectors.mill.byId(state, bestMill.millId);
	const toPosition = mill.position;

	const { deltaX, deltaY } = moveDelta(fromPosition, toPosition);
	const toDirection = directionByDelta(deltaX, deltaY);
	const bestNextPosition = nextPositionFrom(fromPosition, toDirection);

	return { bestMill, bestMiller, bestNextPosition };
}
