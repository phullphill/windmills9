import Immutable from 'immutable';
import { COMPASS } from 'common';

export const VaneRecord = Immutable.Record({
	id: '',
	position: null,
	direction: null,
	millIds: {},
});

export class Vane extends VaneRecord {

	constructor({ id, position, direction, millIds }) {
		super({ id, position, direction, millIds });
	}

	isAt(otherPosition) {
		return this.position.isAt(otherPosition);
	}

	isSameAs(other) {
		return this.position.isAt(other.position);
	}

	isOneOf(otherVanes) {
		return otherVanes.some((v) => this.isSameAs(v));
	}

}
