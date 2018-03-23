import { gameSelectors } from 'game';
import { COMPASS, SPIN } from 'common';

export class Analysis {

	constructor(state, playerId) {
		this.state = state;
		this.playerId = playerId;
		this.millScores = {};
		this.millerScores = {};
	}

	rotateDistance = (spin, quarter, vaneDirection) => {
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

	moveDistance = (fromPosition, toPosition) => {
		const deltaX = Math.abs(toPosition.x - fromPosition.x);
		const deltaY = Math.abs(toPosition.y - fromPosition.y);
		return deltaX > deltaY ? deltaY + (deltaX - deltaY) : deltaX + (deltaY - deltaX);
	}

	analyseMills = () => {
		const mills = gameSelectors.mills.all(this.state);
		mills.forEach((mill) => {
			const millSpin = mill.spin;
			const millVanes = gameSelectors.mill.vanes(this.state, mill.id);
			if (millSpin !== SPIN.NOSPIN) {
				this.millScores[mill.id] = {
					spin: millSpin,
					score: 0,
				};
			} else {
				let clockwiseScore = 0;
				COMPASS.quarters.forEach((quarter) => {
					clockwiseScore += this.rotateDistance(SPIN.CLOCKWISE, quarter, millVanes[quarter].direction);
				});
				if (clockwiseScore <= 4) {
					this.millScores[mill.id] = {
						spin: SPIN.CLOCKWISE,
						score: clockwiseScore,
					};
				} else {
					this.millScores[mill.id] = {
						spin: SPIN.ANTICLOCKWISE,
						score: 8 - clockwiseScore,
					};
				}
			}
		});
	}

	analyseMillers = () => {
		const millers = gameSelectors.player.millers(this.state, this.playerId);
		const freeMillers = millers.filter((miller) => !(gameSelectors.mill.at(this.state, miller.position).isSpinning()));
		const mills = gameSelectors.mills.all(this.state);
		mills.forEach((mill) => {
			const millerMoves = 0;
			freeMillers.forEach((miller) => {
				if (miller.isat(mill.position)) {

				}
				this.millerScores[mill.id].score += this.moveDistance(miller.position, mill.position);
			});
		});
	}

	findBestMill = () => {
		let bestMillId = null;
		let bestMillScore = 99;
		let bestMillSpin = null;
		let bestMiller = null;

		this.analyseMills();
		this.analyseMillers();

		const mills = gameSelectors.mills.all(this.state);
		mills.forEach((mill) => {
			if (this.millScores[mill.id].score < bestMillScore) {
				bestMillId = mill.id;
				bestMillScore = this.millScores[mill.id].score;
				bestMillSpin = this.millScores[mill.id].spin;
			}
		});
		return { bestMillId, bestMillScore, bestMillSpin, bestMiller };
	}

	nearestBestMillAndMiller = () => {
		return this.findBestMill();
	}

}
