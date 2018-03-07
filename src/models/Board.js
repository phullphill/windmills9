import Immutable from 'immutable';
import {
	COMPASS,
	determineMillSpin,
} from 'common';
import { Mill } from './Mill';
import { Position } from './Position';
import { Vane } from './Vane';

function generateId(position) {
	return `${position.x}.${position.y}`;
}

function wrapCoordinates(x, y, width, height) {
	return [
		(x + width) % width,
		(y + height) % height,
	];
}

function vaneMillIds(vanePosition, width, height) {
	const { x, y } = vanePosition;
	return {
		[COMPASS.NORTHWEST]: generateId(new Position(...wrapCoordinates(x, y, width, height))),
		[COMPASS.NORTHEAST]: generateId(new Position(...wrapCoordinates(x + 1, y, width, height))),
		[COMPASS.SOUTHEAST]: generateId(new Position(...wrapCoordinates(x + 1, y + 1, width, height))),
		[COMPASS.SOUTHWEST]: generateId(new Position(...wrapCoordinates(x, y + 1, width, height))),
	};
}

function millVaneIds(millPosition, width, height) {
	const { x, y } = millPosition;
	return {
		[COMPASS.NORTHWEST]: generateId(new Position(...wrapCoordinates(x - 1, y - 1, width, height))),
		[COMPASS.NORTHEAST]: generateId(new Position(...wrapCoordinates(x, y - 1, width, height))),
		[COMPASS.SOUTHEAST]: generateId(new Position(...wrapCoordinates(x, y, width, height))),
		[COMPASS.SOUTHWEST]: generateId(new Position(...wrapCoordinates(x - 1, y, width, height))),
	};
}

function createVanes(width, height) {
	const vanes = {};
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const position = new Position(x, y);
			const id = generateId(position);
			const direction = COMPASS.randomQuarter();
			const millIds = vaneMillIds(position, width, height);
			vanes[id] = new Vane({ id, position, direction, millIds });
		}
	}
	return Immutable.Map(vanes);
}

function createMills(width, height, vanes) {
	const mills = {};
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const position = new Position(x, y);
			const id = generateId(position);
			const vaneIds = millVaneIds(position, width, height);
			const spin = determineMillSpin(vaneIds, vanes);
			mills[id] = new Mill({ id, position, vaneIds, spin });
		}
	}
	return Immutable.Map(mills);
}

function positionFrom(position, toDirection, width, height) {
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
	const newCoords = wrapCoordinates(position.x + inc.x, position.y + inc.y, width, height);
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

	constructor({ id, width, height, portWidth, portHeight }) {
		const vanes = createVanes(width, height);
		const mills = createMills(width, height, vanes);
		super({ id, width, height, portWidth, portHeight, vanes, mills });
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

	nextPositionFrom(position, toDirection) {
		return positionFrom(position, toDirection, this.width, this.height);
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
