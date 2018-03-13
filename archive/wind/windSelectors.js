
export const gameSelectors = {

	wind: (state) => state.wind.wind,
	direction: (state) => state.wind.getIn(['wind', 'direction']),
	magnitude: (state) => state.wind.getIn(['wind', 'magnitude']),

};
