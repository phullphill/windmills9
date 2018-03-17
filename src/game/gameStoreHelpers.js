import { COMPASS, SPIN, randomBoardPosition } from 'common';
import { Miller } from 'models';
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
export function vaneIsRotateable(state, playerId, vaneId) {

	// check this player has a miller at each corner of the vane
	const apexPositions = gameSelectors.vane.apexPositions(state, playerId, vaneId);
	const millers = gameSelectors.player.millers(state, playerId);
	if (!apexPositions.every((p) => millers.some((m) => m.isAt(p)))) {
		return false;
	}

	// check no player has a miller at the opposite corner
	const oppositeApexPosition = gameSelectors.vane.oppositeApexPosition(state, playerId, vaneId);
	const allPlayers = gameSelectors.players.all(state);
	return allPlayers.every((p) => !p.millers.some((m) => m.isAt(oppositeApexPosition)));
}

/**
 * Determine if the vanes are aligned so the mill is spinning
 * @param {array} vanes
 * @return {enum} spin status of mill
 */
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
export function rotateVaneHelper(state, playerId, vaneId, spinDirection) {
	const player = gameSelectors.player.byId({ game: state }, playerId);
	const vane = gameSelectors.vane.byId({ game: state }, vaneId);
	const currentDirection = vane.direction;
	const nextDirection = spinDirection === SPIN.CLOCKWISE ? COMPASS.after2(currentDirection) : COMPASS.before2(currentDirection);
	const oldApexPositions = gameSelectors.vane.apexPositions({ game: state }, playerId, vaneId);
	const oldSpinningMillCount = gameSelectors.player.spinningMillCount({ game: state }, playerId);

	// rotate the vane
	state.setIn(['board', 'vanes', vane.id, 'direction'], nextDirection);

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

	// count occupied spinning mills for each player
	const players = gameSelectors.players.all({ game: state });
	players.forEach((p) => {
		state = state.setIn(['players', p.id, 'millCount'], gameSelectors.player.spinningMillCount({ game: state }, p.id));
	});

	// give the player a new miller if they've got more spinning mills after the rotate than before
	if (gameSelectors.player.spinningMillCount({ game: state }, playerId) > oldSpinningMillCount) {
		const nMillers = player.millers.size;
		const id = `${playerId}-${nMillers}`;

		const allMillers = players.reduce((all, p) => all.concat(p.millers.toArray()), []);
		const allPositions = allMillers.map((m) => m.position);
		const positionNotUnique = (positions, position) => positions.some((p) => p.isAt(position));
		let position;
		do {
			position = randomBoardPosition();
		} while (positionNotUnique(allPositions, position));

		const points = 0;
		const newMiller = new Miller({ playerId, id, position, points });
		state = state.setIn(['players', playerId, 'millers', id], newMiller);
	}

	return state.game;
}
