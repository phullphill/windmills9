
import Immutable from 'immutable';
import { registerReducers } from 'common';
import { aiActions } from './aiActions';

function initialState() {
	return Immutable.Record({
		millScores: null,
	})();
}

function handleSetAnalysis(state, analysis) {
	if (analysis === state.analysis) {
		return state;
	}
	return state.set('analysis', analysis);
}

export const aiStore = (state = initialState(), action = {}) => {
	const { payload } = action;
	switch (action.type) {

		case aiActions.setAnalysis.type:
			return handleSetAnalysis(state, payload);

		default:
			return state;

	}
};

registerReducers({ ai: aiStore });
