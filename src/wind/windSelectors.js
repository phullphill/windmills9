
export const windSelectors = {

	wind: (state) => state.wind.wind,
	direction: (state) => state.wind.getIn(['wind', 'direction']),
	magnitude: (state) => state.wind.getIn(['wind', 'magnitude']),

};
