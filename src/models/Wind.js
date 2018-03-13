import Immutable from 'immutable';

export const WindRecord = Immutable.Record({
	direction: null,
	force: null,
});

export class Wind extends WindRecord {

	constructor(direction, force) {
		super({ direction, force });
	}

	isBlowingTo(direction) {
		return this.direction === direction;
	}

}
