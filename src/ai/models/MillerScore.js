import Immutable from 'immutable';

export const MillerScoreRecord = Immutable.Record({
	millerId: null,
	millerDistance: null,
});

export class MillerScore extends MillerScoreRecord {

	constructor(millerId, millerDistance) {
		super({ millerId, millerDistance });
	}

}
