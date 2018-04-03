import { COMPASS, BOARD_WIDTH, BOARD_HEIGHT } from '../../../src/common';
import {
	shortestDistance,
	moveDelta,
	moveDirectionIsPossible,
	positionIsFree,
	bestStepDirection,
	alternateStepDirection,
} from '../../../src/game';
import {
	Board,
	Miller,
	Position,
} from '../../../src/models';

function findMillWithVaneAlignment(board, direction, alignment) {
	const mill = board.mills.find((m) => {
		const vaneId = m.getIn(['vaneIds', direction]);
		const vane = board.vaneById(vaneId);
		return vane.direction === alignment;
	});
	return mill;
}

describe('shortestDistance', () => {

	it('returns smaller of delta and maxDimension - delta', () => {
		expect(shortestDistance(0, 8)).toEqual(0);
		expect(shortestDistance(1, 8)).toEqual(1);
		expect(shortestDistance(2, 8)).toEqual(2);
		expect(shortestDistance(3, 8)).toEqual(3);
		expect(shortestDistance(4, 8)).toEqual(4);
		expect(shortestDistance(5, 8)).toEqual(-3);
		expect(shortestDistance(6, 8)).toEqual(-2);
		expect(shortestDistance(7, 8)).toEqual(-1);
		expect(shortestDistance(8, 8)).toEqual(-0);
	});

	it('handles -ve delta returning smaller of delta and maxDimension - delta', () => {
		expect(shortestDistance(-8, 8)).toEqual(0);
		expect(shortestDistance(-7, 8)).toEqual(1);
		expect(shortestDistance(-6, 8)).toEqual(2);
		expect(shortestDistance(-5, 8)).toEqual(3);
		expect(shortestDistance(-4, 8)).toEqual(-4);
		expect(shortestDistance(-3, 8)).toEqual(-3);
		expect(shortestDistance(-2, 8)).toEqual(-2);
		expect(shortestDistance(-1, 8)).toEqual(-1);
		expect(shortestDistance(-0, 8)).toEqual(-0);
	});

});

describe('moveDelta', () => {

	it('returns the shortest distance in x and y from one position to another', () => {
		for (let x = 0; x < 7; x++) {
			for (let y = 0; y < 7; y++) {
				const from = new Position(0, 0);
				const to = new Position(x, y);
				const deltaX = (x > 4 ? (-1 * (8 - x)) : x);
				const deltaY = (y > 4 ? (-1 * (8 - y)) : y);
				expect(moveDelta(from, to)).toEqual({ deltaX, deltaY });
			}
		}
	});

});

describe('moveDirectionIsPossible', () => {

	let board;
	let fromPosition;

	beforeEach(() => {
		const boardConfig = {
			id: 1,
			width: BOARD_WIDTH,
			height: BOARD_HEIGHT,
			portWidth: BOARD_WIDTH,
			portHeight: BOARD_HEIGHT,
		};

		board = new Board(boardConfig);
		fromPosition = new Position(1, 1);
	});

	it('returns true when direction is cardinal', () => {
		expect(moveDirectionIsPossible(board, fromPosition, COMPASS.NORTH)).toBeTruthy();
		expect(moveDirectionIsPossible(board, fromPosition, COMPASS.EAST)).toBeTruthy();
		expect(moveDirectionIsPossible(board, fromPosition, COMPASS.SOUTH)).toBeTruthy();
		expect(moveDirectionIsPossible(board, fromPosition, COMPASS.WEST)).toBeTruthy();
	});

	it('returns true when direction is a quarter and the vane is appropriately aligned, false otherwise', () => {
		COMPASS.quarters.forEach((q) => {
			let mill = findMillWithVaneAlignment(board, q, COMPASS.after2(q));
			expect(moveDirectionIsPossible(board, mill.position, q)).toBeTruthy();

			mill = findMillWithVaneAlignment(board, q, COMPASS.before2(q));
			expect(moveDirectionIsPossible(board, mill.position, q)).toBeTruthy();

			mill = findMillWithVaneAlignment(board, q, q);
			expect(moveDirectionIsPossible(board, mill.position, q)).toBeFalsy();

			mill = findMillWithVaneAlignment(board, q, COMPASS.opposite(q));
			expect(moveDirectionIsPossible(board, mill.position, q)).toBeFalsy();
		});
	});

});

describe('positionIsFree', () => {

	let board;
	let position;
	let millers;

	beforeEach(() => {
		const boardConfig = {
			id: 1,
			width: BOARD_WIDTH,
			height: BOARD_HEIGHT,
			portWidth: BOARD_WIDTH,
			portHeight: BOARD_HEIGHT,
		};

		board = new Board(boardConfig);
		position = new Position(1, 1);
	});

	it('returns true if no miller is at the given position', () => {
		const millerConfig = {
			id: 'A-1',
			playerId: 'A',
			position: new Position(2, 2),
			points: 0,
		};
		millers = [new Miller(millerConfig)];
		expect(positionIsFree(position, millers)).toBeTruthy();
	});

	it('returns false if a miller is at the given position', () => {
		const millerConfig = {
			id: 'A-1',
			playerId: 'A',
			position: new Position(1, 1),
			points: 0,
		};
		millers = [new Miller(millerConfig)];
		expect(positionIsFree(position, millers)).toBeFalsy();
	});

});

describe('bestStepDirection', () => {

	it('returns a direction depending upon the signs of the direction deltas', () => {
		expect(bestStepDirection(-2, -2)).toEqual(COMPASS.NORTHWEST);
		expect(bestStepDirection(-2, 0)).toEqual(COMPASS.WEST);
		expect(bestStepDirection(-2, 2)).toEqual(COMPASS.SOUTHWEST);
		expect(bestStepDirection(0, -2)).toEqual(COMPASS.NORTH);
		expect(bestStepDirection(0, 2)).toEqual(COMPASS.SOUTH);
		expect(bestStepDirection(2, -2)).toEqual(COMPASS.NORTHEAST);
		expect(bestStepDirection(2, 0)).toEqual(COMPASS.EAST);
		expect(bestStepDirection(2, 2)).toEqual(COMPASS.SOUTHEAST);
	});

	it('returns null if both deltas are 0', () => {
		expect(bestStepDirection(0, 0)).toEqual(null);
	});

});

describe('alternateStepDirection', () => {

	it('first alternate is one clockwise from ideal when delta x < delta Y', () => {
		COMPASS.keys.forEach((d) => {
			const tried = [d];
			expect(alternateStepDirection(2, 3, d, tried)).toEqual(COMPASS.after(d));
		});
	});

	it('first alternate is one anticlockwise from ideal when delta x > delta Y', () => {
		COMPASS.keys.forEach((d) => {
			const tried = [d];
			expect(alternateStepDirection(3, 2, d, tried)).toEqual(COMPASS.before(d));
		});
	});

	it('second alternate is one anticlockwise from ideal when delta x < delta Y', () => {
		COMPASS.keys.forEach((d) => {
			const tried = [d, COMPASS.before(d)];
			expect(alternateStepDirection(-2, 3, d, tried)).toEqual(COMPASS.before(d));
		});
	});

	it('second alternate is one clockwise from ideal when delta x > delta Y', () => {
		COMPASS.keys.forEach((d) => {
			const tried = [d, COMPASS.after(d)];
			expect(alternateStepDirection(3, 2, d, tried)).toEqual(COMPASS.after(d));
		});
	});

	it('third alternate is one clockwise from first alternate when delta x < delta Y', () => {
		COMPASS.keys.forEach((d) => {
			const tried = [d, COMPASS.before(d), COMPASS.after(d)];
			expect(alternateStepDirection(2, 3, d, tried)).toEqual(COMPASS.after(tried[1]));
		});
	});

	it('third alternate is one anticlockwise from first alternate when delta x > delta Y', () => {
		COMPASS.keys.forEach((d) => {
			const tried = [d, COMPASS.after(d), COMPASS.before(d)];
			expect(alternateStepDirection(3, 2, d, tried)).toEqual(COMPASS.before(tried[1]));
		});
	});

	it('returns null if already tried all 8 possible directions', () => {
		const d = COMPASS.NORTH;
		const tried = COMPASS.keys;
		expect(alternateStepDirection(3, 2, d, tried)).toEqual(null);

	});

});
