import Immutable from 'immutable';

export const MillScoreRecord = Immutable.Record({
	millId: null,
	spin: null,
	spinScore: null,
	millerScores: null,
});

export class MillScore extends MillScoreRecord {

	constructor(millId, spin, spinScore) {
		super({ millId, spin, spinScore });
	}

	get totalScore() {
		if (!this.spinScore || !this.millerScores) {
			return 9999;
		}
		return this.spinScore + this.millerScores.reduce((sum, m) => sum + m.millerDistance, 0);
	}

}
