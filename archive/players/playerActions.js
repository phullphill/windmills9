import { createStoreAction, createSagaActions } from 'common';

export const playerActions = {

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

};
