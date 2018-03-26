export const aiSelectors = {

	millScores: (state) => state.ai.millScores,

	best: {
		millAnalysis: (state) => aiSelectors.millScores(state)[0],
		millId: (state) => aiSelectors.best.millAnalysis(state).millId,
		millSpin: (state) => aiSelectors.best.millAnalysis(state).millSpin,
		millerAnalysis: (state) => aiSelectors.best.millAnalysis(state).millerScores[0],
		millerId: (state) => aiSelectors.best.millerAnalysis(state).millerId,
	},

};
