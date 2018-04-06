import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { COMPASS, SPIN } from 'common';
import { gameActions, gameSelectors } from 'game';
import { nextPositionFrom } from 'models';

import { WindStatus } from './WindStatus';
import { PlayerScores } from './PlayerScores';
import { CompassRose } from './CompassRose';
import { RotateButton } from './RotateButton';

import './ControlBarStyle.less';

function mapStateToProps(state) {
	const activePlayer = gameSelectors.players.active(state);
	return {
		board: gameSelectors.board.board(state),
		players: gameSelectors.players.all(state),
		activePlayerId: gameSelectors.players.activeId(state),
		activePlayerColour: activePlayer ? activePlayer.colour : '',
		activeMiller: gameSelectors.player.activeMiller(state, gameSelectors.players.activeId(state)),
		activeVane: gameSelectors.player.activeVane(state, gameSelectors.players.activeId(state)),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			moveMiller: (playerId, millerId, toPosition) => dispatch(gameActions.moveMiller({ playerId, millerId, toPosition })),
			rotateVane: (playerId, vaneId, spinDirection) => dispatch(gameActions.rotateVane({ playerId, vaneId, spinDirection })),
			nextPlayer: () => dispatch(gameActions.nextPlayer.request()),
		},
	};
}

export const ControlBar = connect(mapStateToProps, mapDispatchToProps)(class ControlBar extends PureComponent {

	static defaultProps = {
		activeMiller: null,
		activeVane: null,
	};

	static propTypes = {
		board: PropTypes.shape({}).isRequired,
		players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
		activePlayerId: PropTypes.string.isRequired,
		activePlayerColour: PropTypes.string.isRequired,
		activeMiller: PropTypes.shape({}),
		activeVane: PropTypes.shape({}),
		actions: PropTypes.shape({}).isRequired,
	}

	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch = (error, info) => {
		// Display fallback UI
		this.setState({ hasError: true });
		// You can also log the error to an error reporting service
		console.log(error, info);
	}

	destinationIsEmpty = (position, direction) => {
		const { players } = this.props;
		const destination = nextPositionFrom(position, direction);
		const isEmpty = !players.some((player) => player.millerAt(destination) !== undefined);
		return isEmpty;
	}

	diagonalMoveIsPossible = (position, direction) => {
		const { board } = this.props;
		const mill = board.millAt(position);
		const vaneId = mill.getIn(['vaneIds', direction]);
		const vane = board.vaneById(vaneId);
		if (vane.direction === direction || vane.direction === COMPASS.opposite(direction)) {
			return false;
		}
		return true;
	}

	determineDisabledDirections = () => {
		const { activeMiller } = this.props;
		const disabledDirections = [];
		if (!activeMiller) {
			return disabledDirections;
		}
		const activePosition = activeMiller.position;
		COMPASS.cardinals.forEach((direction) => {
			if (!this.destinationIsEmpty(activePosition, direction)) {
				disabledDirections.push(direction);
			}
		});
		COMPASS.quarters.forEach((direction) => {
			if (!this.destinationIsEmpty(activePosition, direction) ||
				!this.diagonalMoveIsPossible(activePosition, direction)) {
				disabledDirections.push(direction);
			}
		});
		return disabledDirections;
	}

	handleSelectDirection = (direction) => {
		const { activePlayerId, activeMiller, actions } = this.props;
		const toPosition = nextPositionFrom(activeMiller.position, direction);
		actions.moveMiller(activePlayerId, activeMiller.id, toPosition);
		actions.nextPlayer();
	}

	handleRotate = (spin) => {
		const { activePlayerId, actions, activeVane } = this.props;
		actions.rotateVane(activePlayerId, activeVane.id, spin);
		actions.nextPlayer();
	}

	renderBarClass = () => classNames('control-bar');

	render() {
		const { players, activePlayerId, activePlayerColour, activeVane } = this.props;
		const { hasError } = this.state;
		if (hasError) {
			return <span>Something went wrong</span>;
		}

		const disabledDirections = this.determineDisabledDirections();
		return (
			<div className={this.renderBarClass()} >
				<WindStatus />
				<div className="separator" />
				<PlayerScores players={players} activePlayerId={activePlayerId} />
				<div className="separator" />
				<CompassRose disabledDirections={disabledDirections} onSelect={this.handleSelectDirection} />
				<div className="rotate-buttons" >
					<RotateButton spin={SPIN.CLOCKWISE} onSelect={this.handleRotate} activePlayerColour={activePlayerColour} activeVane={activeVane} />
					<RotateButton spin={SPIN.ANTICLOCKWISE} onSelect={this.handleRotate} activePlayerColour={activePlayerColour} activeVane={activeVane} />
				</div>
			</div>
		);
	}

});
