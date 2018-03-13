import { createStoreAction } from 'common';

export const boardActions = {

	/**
	 * Select a vane
	 * Must have a miller at each corner.
	 * @param {string} vaneId - vane being selected
	 */
	selectVane: createStoreAction('SELECT_VANE'),

	/**
	 * Rotate a vane one step clockwise or anti-cockwise.
	 * Must have a miller at each corner, and each miller moves also.
	 * @param {object} payload
	 * @param {object} payload.vaneId - vane being rotated
	 * @param {spinDirection} payload.spin - direction to rotate - clockwise or anti-clockwise
	 */
	rotateVane: createStoreAction('ROTATE_VANE'),

};
