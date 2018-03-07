import Immutable from 'immutable';

export const WindRecord = Immutable.Record({
	direction: null,
	magnitude: null,
});

export class Wind extends WindRecord {

	constructor(direction, magnitude) {
		super({ direction, magnitude });
	}

	isBlowingTo(direction) {
		return this.direction === direction;
	}

}
