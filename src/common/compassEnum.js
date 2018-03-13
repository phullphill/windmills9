import { CircularEnum } from './enum';

export class CompassEnum extends CircularEnum {
	constructor() {
		super('NORTH', 'NORTHEAST', 'EAST', 'SOUTHEAST', 'SOUTH', 'SOUTHWEST', 'WEST', 'NORTHWEST');
	}
	get cardinals() { return [this.NORTH, this.EAST, this.SOUTH, this.WEST]; }
	get quarters() { return [this.NORTHWEST, this.NORTHEAST, this.SOUTHEAST, this.SOUTHWEST]; }

	before2(sym) { return this.before(this.before(sym)); }

	after2(sym) { return this.after(this.after(sym)); }

	randomCardinal() {
		const randomIndex = Math.floor(Math.random() * this.cardinals.length);
		return this.cardinals[randomIndex];
	}
	randomQuarter() {
		const randomIndex = Math.floor(Math.random() * this.quarters.length);
		return this.quarters[randomIndex];
	}
}
