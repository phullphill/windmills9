import { COMPASS, SPIN } from 'common';
import { gameSelectors } from './gameSelectors';

/**
 * Checks each vane of the mill at the toPosition to see if the vane is rotateable.
 * If a vane has a miller at each corner of the black/white triangle then return that vane.
 * Otherwise return null.
 * @param {object} state
 * @param {string} playerId
 * @param {string} millerId
 * @param {object} toPosition
 * @return {string} vaneId or null
 */
export function analyseMillerTrioPositions(state, playerId, millerId, toPosition) {
	let rotateableVaneId = null;

	const player = gameSelectors.player.byId(state, playerId);
	const millers = gameSelectors.player.millers(state, playerId);
	const mill = gameSelectors.mill.at(state, toPosition);
	const millVanes = gameSelectors.mill.vanes(state, mill.id);
	COMPASS.quarters.forEach((quarter) => {
		const vane = millVanes[quarter];
		const vaneMills = gameSelectors.vane.mills(state, vane.id);
		const vanePointDirections = COMPASS.quarters.filter((q) => q !== (player.colour === 'black' ? COMPASS.opposite(vane.direction) : vane.direction));
		const vanePoints = vanePointDirections.map((d) => vaneMills[d].position);
		if (vanePoints.every((p) => millers.some((m) => m.isAt(p)))) {
			rotateableVaneId = vane.id;
		}
	});

	return rotateableVaneId;
}

export function determineMillSpin(vanes) {
	if (vanes[COMPASS.NORTHWEST].direction === COMPASS.NORTHEAST &&
		vanes[COMPASS.NORTHEAST].direction === COMPASS.SOUTHEAST &&
		vanes[COMPASS.SOUTHEAST].direction === COMPASS.SOUTHWEST &&
		vanes[COMPASS.SOUTHWEST].direction === COMPASS.NORTHWEST) {
		return SPIN.CLOCKWISE;
	} else if (vanes[COMPASS.NORTHWEST].direction === COMPASS.SOUTHWEST &&
		vanes[COMPASS.NORTHEAST].direction === COMPASS.NORTHWEST &&
		vanes[COMPASS.SOUTHEAST].direction === COMPASS.NORTHEAST &&
		vanes[COMPASS.SOUTHWEST].direction === COMPASS.SOUTHEAST) {
		return SPIN.ANTICLOCKWISE;
	}
	return SPIN.NOSPIN;
}

/**
 * Follows up after vane rotation.
 * Moves the millers who rotated the vane, and checks spin state of mills which contain the vane.
 * @param {object} state
 * @param {string} playerId
 * @param {string} vaneId
 * @return {object} mutated state
 */
export function rotateVaneFollowUp(state, playerId, vaneId) {
	const player = gameSelectors.player.byId(state, playerId);
	const vane = gameSelectors.vane.byId(state, vaneId);

	// move the millers at vane corners


	// check spin state of any nearby mills
	const millIds = COMPASS.quarters.map((k) => vane.millIds[k]);
	millIds.forEach((id) => {
		const millVanes = gameSelectors.mill.vanes(state, id);
		const spin = determineMillSpin(millVanes);
		state = state.setIn(['board', 'mills', id, 'spin'], spin);
	});

	return state;
}
