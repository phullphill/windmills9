import Immutable from 'immutable';

export const AnalysisRecord = Immutable.Record({
	millScores: null,
	bestMill: null,
	bestMiller: null,
});

export class Analysis extends AnalysisRecord {

	constructor(millScores, bestMill, bestMiller) {
		super({ millScores, bestMill, bestMiller });
	}

}
