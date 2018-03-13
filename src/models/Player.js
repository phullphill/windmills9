import Immutable from 'immutable';

export const PlayerRecord = Immutable.Record({
	id: 0,
	name: '',
	colour: '',
	millerColour: '',
	millers: null,
	millCount: 0,
	activeMillerId: null,
	activeVaneId: null,
	isAI: false,
});

export class Player extends PlayerRecord {

	constructor({ id, name, colour, millerColour, millers, isAI }) {
		super({ id, name, colour, millerColour, millers, isAI, activeMillerId: null, activeVaneId: null });
	}

	get points() {
		return this.millers.reduce((sum, miller) => sum + miller.points, 0);
	}

	millerById(millerId) {
		return this.millers.get(millerId);
	}

	millerAt(position) {
		return this.millers.find((miller) => miller.isAt(position));
	}

}
