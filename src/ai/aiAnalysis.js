import { gameSelectors } from 'game';

export function analyseMills(state) {
	const analysis = {};
	const board = gameSelectors.board.board(state);
	return analysis;
}

export function findBestMill(state) {
	const bestMillId = '1.1';
	const millAnalysis = analyseMills(state);
	return bestMillId;
}

export function nearestBestMillAndMiller(state) {
	const bestMillId = '1.1';
	const bestMillerId = 'B-0';
	const millAnalysis = analyseMills(state);
	return { bestMillId, bestMillerId };
}
