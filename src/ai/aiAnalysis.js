import { gameSelectors } from 'game';
import { COMPASS, SPIN } from 'common';

export function rotateDistance(spin, quarter, vaneDirection) {
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
	const desiredDirection = desiredDirections[spin][vaneDirection];
	if (vaneDirection === desiredDirection) {
		return 0;
	} else if (vaneDirection === COMPASS.opposite(desiredDirection)) {
		return 2;
	}
	return 1;
}

export function analyseMillSpins(state) {
	const analysis = {
		[SPIN.CLOCKWISE]: {
			millScores: {},
			bestMillScore: 99,
			bestMill: null,
		},
		[SPIN.ANTICLOCKWISE]: {
			millScores: {},
			bestMillScore: 99,
			bestMillId: null,
		},
	};
	const mills = gameSelectors.mills.all(state);
	mills.forEach((mill) => {
		let millScore = 0;
		const millSpin = mill.spin;
		const millVanes = gameSelectors.mill.vanes(state, mill.id);
		[SPIN.CLOCKWISE, SPIN.ANTICLOCKWISE].forEach((spin) => {
			COMPASS.quarters.forEach((quarter) => {
				if (millSpin === SPIN.NOSPIN) {
					millScore += rotateDistance(spin, quarter, millVanes[quarter].direction);
				}
			});
			analysis[spin].millScores[mill.id] = millScore;
			if (millScore < analysis[spin].bestMillScore) {
				analysis[spin].bestMillScore = millScore;
				analysis[spin].bestMillId = mill.id;
			}
		});
	});
	return analysis;
}

export function findBestMill(state) {
	let bestMillScore = 99;
	let bestMillId = null;

	const millAnalysis = analyseMillSpins(state);
	[SPIN.CLOCKWISE, SPIN.ANTICLOCKWISE].forEach((spin) => {
		if (millAnalysis[spin].bestMillScore < bestMillScore) {
			bestMillScore = millAnalysis[spin].bestMillScore;
			bestMillId = millAnalysis[spin].bestMillId;
		}
	});
	return bestMillId;
}

export function nearestBestMillAndMiller(state) {
	const bestMillerId = 'B-0';
	const bestMillId = findBestMill(state);
	return { bestMillId, bestMillerId };
}
