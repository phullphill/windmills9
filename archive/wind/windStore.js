
import Immutable from 'immutable';
import { randomIntInclusive, range, COMPASS, registerReducers } from 'common';
import { Wind } from 'models';
import { windActions } from './windActions';

const MIN_FORCE = 0;
const MAX_FORCE = 10;

export function initialState() {
	const randomDirection = COMPASS.random();
	const randomMagnitude = randomIntInclusive(MIN_FORCE, MAX_FORCE);
	const wind = new Wind(randomDirection, randomMagnitude);
	return Immutable.Record({ wind })();
}

function randomWindChange(state, payload) {
	const oldWind = state.get('wind');
	let newDirection = oldWind.direction;
	let newForce = oldWind.magnitude;

	const swing = randomIntInclusive(-2, 2);
	if (swing !== 0) {
		range(1, Math.abs(swing)).forEach(() => {
			if (swing > 0) {
				newDirection = newDirection.after();
			} else {
				newDirection = newDirection.before();
			}
		});
	}

	const forceChange = randomIntInclusive(-2, 2);
	newForce += forceChange;
	newForce = (newForce < MIN_FORCE ? MIN_FORCE : newForce);
	newForce = (newForce > MAX_FORCE ? MAX_FORCE : newForce);

	if (newDirection === oldWind.direction && newForce === oldWind.magnitude) {
		return state;
	}

	const newWind = new Wind(newDirection, newForce);
	return state.set('wind', newWind);
}

export const windStore = (state = initialState(), action = {}) => {
	const { type, payload } = action;
	switch (type) {

		case windActions.randomWindChange.type:
			return randomWindChange(state, payload);

		default:
			return state;

	}
};

registerReducers({ wind: windStore });
