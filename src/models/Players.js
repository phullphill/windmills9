import Immutable from 'immutable';
import { range } from 'common';
import { Player } from './Player';
import { Miller } from './Miller';
import { Board } from './Board';

function uniquePositions(nGroups, nPerGroup) {
	let allPositions = [];
	const groups = [];
	const positionNotUnique = (positions, position) => positions.some((p) => p.isAt(position));
	range(0, nGroups - 1).forEach(() => {
		const groupPositions = [];
		range(0, nPerGroup - 1).forEach(() => {
			let position = null;
			do {
				position = Board.randomBoardPosition();
			} while (positionNotUnique(allPositions, position));
			allPositions.push(position);
			groupPositions.push(position);
		});
		groups.push(groupPositions);
	});
	allPositions = [];
	return groups;
}

function createMillers(playerId, millerPositions) {
	const millers = {};
	const points = 0;
	millerPositions.forEach((position, index) => {
		const id = `${playerId}-${index}`;
		millers[id] = new Miller({ playerId, id, position, points });
	});
	return Immutable.Map(millers);
}

export function createPlayers(playerConfigs, nMillersPerPlayer) {
	const millerPositions = uniquePositions(playerConfigs.length, nMillersPerPlayer);

	const players = {};
	playerConfigs.forEach((config, index) => {
		const playerId = config.id;
		const millers = createMillers(playerId, millerPositions[index]);
		players[playerId] = new Player({
			...config,
			millers,
		});
	});
	return Immutable.Map(players);
}
