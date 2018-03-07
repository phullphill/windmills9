import createCachedSelector from 're-reselect';

const boardSelector = (state) => state.board.board;
const activeVaneIdSelector = (state) => state.board.activeVaneId;

export const boardSelectors = {

	board: boardSelector,

	activeVaneId: activeVaneIdSelector,

	activeVane: createCachedSelector(
		boardSelector,
		activeVaneIdSelector,
		(board, activeVaneId) => {
			if (!activeVaneId) {
				return null;
			}
			return board.vaneById(activeVaneId);
		},
	)((state, activeVaneId) => activeVaneId),

};
