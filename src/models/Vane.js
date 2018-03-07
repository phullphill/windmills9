import Immutable from 'immutable';
import { COMPASS } from 'common';

export const VaneRecord = Immutable.Record({
	id: '',
	position: null,
	direction: null,
	millIds: [],
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

	isOpenTo(direction) {
		switch (direction) {
			case COMPASS.NORTH:
				return this.direction === COMPASS.SOUTHEAST || this.direction === COMPASS.SOUTHWEST;
			case COMPASS.EAST:
				return this.direction === COMPASS.SOUTHWEST || this.direction === COMPASS.NORTHWEST;
			case COMPASS.SOUTH:
				return this.direction === COMPASS.NORTHWEST || this.direction === COMPASS.NORTHEAST;
			case COMPASS.WEST:
				return this.direction === COMPASS.NORTHEAST || this.direction === COMPASS.SOUTHEAST;
			default:
				return false;
		}
	}

	pointsTo(direction) {
		switch (direction) {
			case COMPASS.NORTH:
				return this.direction === COMPASS.NORTHEAST || this.direction === COMPASS.NORTHWEST;
			case COMPASS.EAST:
				return this.direction === COMPASS.SOUTHEAST || this.direction === COMPASS.NORTHEAST;
			case COMPASS.SOUTH:
				return this.direction === COMPASS.SOUTHWEST || this.direction === COMPASS.SOUTHEAST;
			case COMPASS.WEST:
				return this.direction === COMPASS.NORTHWEST || this.direction === COMPASS.SOUTHWEST;
			default:
				return false;
		}
	}

	isInOperatingMill(mills) {
		const millIds = COMPASS.symbols.map((k) => this.millIds[k]);
		const someMillIsOperating = millIds.some((id) => mills.get(id).isSpinning());
		return someMillIsOperating;
	}

}
