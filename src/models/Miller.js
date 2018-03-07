import Immutable from 'immutable';

export const MillerRecord = Immutable.Record({
	playerId: null,
	id: null,
	position: null,
	points: 0,
});

export class Miller extends MillerRecord {

	constructor({ id, playerId, position, points }) {
		super({ id, playerId, position, points });
	}

	isAt(position) {
		return this.position.isAt(position);
	}

}
