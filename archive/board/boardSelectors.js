
const boardSelector = (state) => state.board.board;
const activeVaneIdSelector = (state) => state.board.activeVaneId;

export const gameSelectors = {

	board: boardSelector,

	activeVaneId: activeVaneIdSelector,

	activeVane: (state) => boardSelector(state).vaneById(activeVaneIdSelector(state)),

};
