import Immutable from 'immutable';
import { COMPASS, SPIN, BOARD_WIDTH, BOARD_HEIGHT, randomIntInclusive } from 'common';
import { Mill } from './Mill';
import { Position } from './Position';
import { Vane } from './Vane';

function generateId(position) {
	return `${position.x}.${position.y}`;
}

function wrapCoordinates(x, y) {
	return [
		(x + BOARD_WIDTH) % BOARD_WIDTH,
		(y + BOARD_HEIGHT) % BOARD_HEIGHT,
	];
}

function vaneMillIds(vanePosition) {
	const { x, y } = vanePosition;
	const millIds = {
		[COMPASS.NORTHWEST]: generateId(new Position(...wrapCoordinates(x, y))),
		[COMPASS.NORTHEAST]: generateId(new Position(...wrapCoordinates(x + 1, y))),
		[COMPASS.SOUTHEAST]: generateId(new Position(...wrapCoordinates(x + 1, y + 1))),
		[COMPASS.SOUTHWEST]: generateId(new Position(...wrapCoordinates(x, y + 1))),
	};
	return Immutable.Map(millIds);
}

function millVaneIds(millPosition) {
	const { x, y } = millPosition;
	const vaneIds = {
		[COMPASS.NORTHWEST]: generateId(new Position(...wrapCoordinates(x - 1, y - 1))),
		[COMPASS.NORTHEAST]: generateId(new Position(...wrapCoordinates(x, y - 1))),
		[COMPASS.SOUTHEAST]: generateId(new Position(...wrapCoordinates(x, y))),
		[COMPASS.SOUTHWEST]: generateId(new Position(...wrapCoordinates(x - 1, y))),
	};
	return Immutable.Map(vaneIds);

}

function createVanes() {
	const vanes = {};
	for (let y = 0; y < BOARD_HEIGHT; y++) {
		for (let x = 0; x < BOARD_WIDTH; x++) {
			const position = new Position(x, y);
			const id = generateId(position);
			const direction = COMPASS.randomQuarter();
			const millIds = vaneMillIds(position);
			vanes[id] = new Vane({ id, position, direction, millIds });
		}
	}
	return Immutable.Map(vanes);
}

/**
 * Determine if the vanes are aligned so the mill is spinning
 * @param {array} vanes
 * @return {enum} spin status of mill
 */
function determineMillSpin(vanes) {
	let spin = SPIN.NOSPIN;
	if (vanes[COMPASS.NORTHWEST].direction === COMPASS.NORTHEAST &&
		vanes[COMPASS.NORTHEAST].direction === COMPASS.SOUTHEAST &&
		vanes[COMPASS.SOUTHEAST].direction === COMPASS.SOUTHWEST &&
		vanes[COMPASS.SOUTHWEST].direction === COMPASS.NORTHWEST) {
		spin = SPIN.CLOCKWISE;
	} else if (vanes[COMPASS.NORTHWEST].direction === COMPASS.SOUTHWEST &&
		vanes[COMPASS.NORTHEAST].direction === COMPASS.NORTHWEST &&
		vanes[COMPASS.SOUTHEAST].direction === COMPASS.NORTHEAST &&
		vanes[COMPASS.SOUTHWEST].direction === COMPASS.SOUTHEAST) {
		spin = SPIN.ANTICLOCKWISE;
	}
	return spin;
}

function createMills(vanes) {
	const mills = {};
	for (let y = 0; y < BOARD_HEIGHT; y++) {
		for (let x = 0; x < BOARD_WIDTH; x++) {
			const position = new Position(x, y);
			const id = generateId(position);
			const vaneIds = millVaneIds(position);

			const millVanes = {};
			COMPASS.quarters.forEach((q) => {
				millVanes[q] = vanes.get(vaneIds.get(q));
			});
			const spin = determineMillSpin(millVanes);

			mills[id] = new Mill({ id, position, vaneIds, spin });
		}
	}
	const millsMap = Immutable.Map(mills);
	return millsMap;
}

function positionFrom(position, toDirection) {
	const increments = {
		[COMPASS.NORTH]: { x: 0, y: -1 },
		[COMPASS.NORTHEAST]: { x: 1, y: -1 },
		[COMPASS.EAST]: { x: 1, y: 0 },
		[COMPASS.SOUTHEAST]: { x: 1, y: 1 },
		[COMPASS.SOUTH]: { x: 0, y: 1 },
		[COMPASS.SOUTHWEST]: { x: -1, y: 1 },
		[COMPASS.WEST]: { x: -1, y: 0 },
		[COMPASS.NORTHWEST]: { x: -1, y: -1 },
	};
	const inc = increments[toDirection];
	const newCoords = wrapCoordinates(position.x + inc.x, position.y + inc.y);
	return new Position(...newCoords);
}

export const BoardRecord = Immutable.Record({
	id: '',
	width: 0,
	height: 0,
	portWidth: 0,
	portHeight: 0,
	vanes: {},
	mills: {},
});

export class Board extends BoardRecord {

	constructor({ id, portWidth, portHeight }) {
		const vanes = createVanes();
		const mills = createMills(vanes);
		super({ id, width: BOARD_WIDTH, height: BOARD_HEIGHT, portWidth, portHeight, vanes, mills });
	}

	static nextPositionFrom(position, toDirection) {
		return positionFrom(position, toDirection);
	}

	static randomBoardPosition() {
		return new Position(randomIntInclusive(0, BOARD_WIDTH - 1), randomIntInclusive(0, BOARD_HEIGHT - 1));
	}

	vaneById(vaneId) {
		return this.vanes.get(vaneId);
	}

	vaneAt(position) {
		return this.vaneById(generateId(position));
	}

	millById(millId) {
		return this.mills.get(millId);
	}

	millAt(position) {
		return this.millById(generateId(position));
	}

	spinningMillCount() {
		return this.spinningMills().length;
	}

	spinningMills() {
		const spinningMills = [];
		this.mills.keySeq().toArray().forEach((millId) => {
			const mill = this.mills.get(millId);
			if (mill.isSpinning()) {
				spinningMills.push(mill);
			}
		});
		return spinningMills;
	}
}
