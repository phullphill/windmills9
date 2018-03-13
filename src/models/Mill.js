import Immutable from 'immutable';
import { SPIN } from 'common';

export const MillRecord = Immutable.Record({
	id: '',
	position: null,
	vaneIds: {},
	spin: null,
});

export class Mill extends MillRecord {

	constructor({ id, position, vaneIds, spin }) {
		super({ id, position, vaneIds, spin });
	}

	isClockWise() {
		return this.spin === SPIN.CLOCKWISE;
	}

	isCounterClockWise() {
		return this.spin === SPIN.ANTICLOCKWISE;
	}

	isSpinning() {
		return this.spin !== SPIN.NOSPIN;
	}

}
