import { createStoreAction, createSagaActions } from 'common';

export const gameActions = {

	/**
	 * Next active players
	 */
	nextPlayer: createSagaActions('NEXT_PLAYER'),

	/**
	 * Set active player
	 * @param {object} payload
	 * @param {object} payload.playerId - player whose turn it is next
	 */
	setActivePlayer: createStoreAction('SET_ACTIVE_PLAYER'),

	/**
	 * Set the active miller for a player
	 * @param {object} payload
	 * @param {object} payload.playerId - player doing the selecting
	 * @param {object} payload.millerId - miller being selected
	 */
	setActiveMiller: createStoreAction('SET_ACTIVE_MILLER'),

	/**
	 * Move a miller to a new position
	 * @param {object} payload
	 * @param {string} payload.playerId - player whose miller we want to move
	 * @param {string} payload.millerId - miller we want to move
	 * @param {position} payload.toPosition - position to move the active miller to
	 */
	moveMiller: createStoreAction('MOVE_MILLER'),

	/**
	 * Set the active vane for a player
	 * @param {object} payload
	 * @param {object} payload.playerId - player doing the selecting
	 * @param {object} payload.vaneId - vane being selected
	 */
	setActiveVane: createStoreAction('SET_ACTIVE_VANE'),

	/**
	 * Rotate a vane one step clockwise or anti-cockwise.
	 * Must have a miller at each corner, and each miller moves also.
	 * @param {object} payload
	 * @param {object} payload.vaneId - vane being rotated
	 * @param {spinDirection} payload.spin - direction to rotate - clockwise or anti-clockwise
	 */
	rotateVane: createStoreAction('ROTATE_VANE'),

	/**
	 * Adds some point to a miller.
	 * @param {object} payload
	 * @param {object} payload.playerId - id of player
	 * @param {object} payload.millerId - id of miller gaining points
	 * @param {object} payload.points - points to add
	 */
	addPoints: createStoreAction('ADD_POINTS'),

	/**
	 * Change the wind randomly
	 */
	randomWindChange: createStoreAction('RANDOM_WIND_CHANGE'),

};
