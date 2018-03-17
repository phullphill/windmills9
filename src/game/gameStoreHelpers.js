import { COMPASS, SPIN } from 'common';
import { gameSelectors } from './gameSelectors';

/**
 * Checks each vane of the mill at the toPosition to see if the vane is rotateable.
 * If a vane has a miller at each corner of the black/white triangle then return that vane.
 * Otherwise return null.
 * @param {object} state
 * @param {string} playerId
 * @param {string} vaneId
 * @return {string} vaneId or null
 */
export function vaneHasMillerTrio(state, playerId, vaneId) {
	const apexPositions = gameSelectors.vane.apexPositions(state, playerId, vaneId);
	const millers = gameSelectors.player.millers(state, playerId);
	return apexPositions.every((p) => millers.some((m) => m.isAt(p)));
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
export function rotateVaneFollowUp(state, playerId, vaneId, oldApexPositions, spinDirection) {
	const player = gameSelectors.player.byId({ game: state }, playerId);
	const vane = gameSelectors.vane.byId({ game: state }, vaneId);

	// move the millers at vane corners
	const apexMillers = oldApexPositions.map((p) => player.millerAt(p));
	const newApexPositions = gameSelectors.vane.apexPositions({ game: state }, playerId, vaneId);
	apexMillers.forEach((miller, index) => {
		state = state.setIn(['players', playerId, 'millers', miller.id, 'position'], newApexPositions[index]);
	});

	// check spin state of mills at the corners of the rotated vane
	const millIds = COMPASS.quarters.map((k) => vane.millIds[k]);
	millIds.forEach((id) => {
		const millVanes = gameSelectors.mill.vanes({ game: state }, id);
		const spin = determineMillSpin(millVanes);
		state = state.setIn(['board', 'mills', id, 'spin'], spin);
	});

	return state.game;
}
