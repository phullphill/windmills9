import { COMPASS, SPIN } from './enums';

export function randomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

export function range(start, end) {
	return [...Array((1 + end) - start).keys()].map((v) => start + v);
}

export function transformObject(obj, keys, transformer) {
	const transformed = {};
	keys.forEach((key) => {
		transformed[key] = transformer(obj[key]);
	});
	return transformed;
}
