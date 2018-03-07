import Immutable from 'immutable';

export const PositionRecord = Immutable.Record({
	x: 0,
	y: 0,
});

export class Position extends PositionRecord {

	constructor(x, y) {
		super({ x, y });
	}

	isAt(other) {
		return this.x === other.x && this.y === other.y;
	}

	toString() {
		return `(${this.x},${this.y})`;
	}
}
