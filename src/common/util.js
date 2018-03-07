import { COMPASS, SPIN } from './enums';

export function randomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

export function determineMillSpin(vaneIds, vanes) {
	if (vanes.get(vaneIds[COMPASS.NORTHWEST]).direction === COMPASS.NORTHEAST &&
		vanes.get(vaneIds[COMPASS.NORTHEAST]).direction === COMPASS.SOUTHEAST &&
		vanes.get(vaneIds[COMPASS.SOUTHEAST]).direction === COMPASS.SOUTHWEST &&
		vanes.get(vaneIds[COMPASS.SOUTHWEST]).direction === COMPASS.NORTHWEST) {
		return SPIN.CLOCKWISE;
	} else if (vanes.get(vaneIds[COMPASS.NORTHWEST]).direction === COMPASS.SOUTHWEST &&
		vanes.get(vaneIds[COMPASS.NORTHEAST]).direction === COMPASS.NORTHWEST &&
		vanes.get(vaneIds[COMPASS.SOUTHEAST]).direction === COMPASS.NORTHEAST &&
		vanes.get(vaneIds[COMPASS.SOUTHWEST]).direction === COMPASS.SOUTHEAST) {
		return SPIN.ANTICLOCKWISE;
	}
	return SPIN.NOSPIN;
}

export function range(start, end) {
	return [...Array((1 + end) - start).keys()].map((v) => start + v);
}
