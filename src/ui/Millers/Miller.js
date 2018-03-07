
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SQUARE_SIZE } from 'common';
import { Position } from 'models';
import { playerActions } from 'players';

function mapDispathToProps(dispatch) {
	return {
		actions: {
			setActiveMiller: (playerId, millerId) => dispatch(playerActions.setActiveMiller({ playerId, millerId })),
		},
	};
}

export const Miller = connect(null, mapDispathToProps)(class Miller extends PureComponent {

	static propTypes = {
		board: PropTypes.shape({}).isRequired,
		player: PropTypes.shape({}).isRequired,
		isActivePlayer: PropTypes.bool.isRequired,
		miller: PropTypes.shape({}).isRequired,
		actions: PropTypes.shape({}).isRequired,
	};

	handleSelectMiller = () => {
		const { player, isActivePlayer, miller, actions } = this.props;
		if (isActivePlayer) {
			actions.setActiveMiller(player.id, miller.id);
		}
	}

	handleKeyPress = () => { }

	wrapPositionAtEdges = (position) => {
		const { board } = this.props;
		const positions = [position];
		if (position.x === 0) {
			positions.push(new Position(board.width, position.y));
		}
		if (position.y === 0) {
			positions.push(new Position(position.x, board.height));
		}
		if (position.x === 0 && position.y === 0) {
			positions.push(new Position(board.width, board.height));
		}
		return positions;
	}

	renderMillerStyle = (position) => {
		const { player, isActivePlayer, miller } = this.props;
		const { x, y } = position;
		const size = SQUARE_SIZE * 0.3;
		const isSelected = (miller.id === player.activeMillerId);
		return {
			width: `${size}px`,
			height: `${size}px`,
			backgroundColor: player.millerColour,
			borderRadius: '50%',
			border: isSelected ? '2px solid red' : '0',
			cursor: isActivePlayer ? 'pointer' : 'auto',
			position: 'absolute',
			left: `${((x * SQUARE_SIZE) - (size / 2))}px`,
			top: `${((y * SQUARE_SIZE) - (size / 2))}px`,
			transition: 'all 0.25s',
			transitionTimingFunction: 'linear',
			pointerEvents: 'auto',
		};
	}

	render() {
		const { miller } = this.props;
		return (
			<div id={miller.id} className="miller" >
				{this.wrapPositionAtEdges(miller.position).map((position) => (
					<div
						key={`${miller.id}-${position}`}
						className="miller-marker"
						style={this.renderMillerStyle(position)}
						onClick={this.handleSelectMiller}
						onKeyPress={this.handleKeyPress}
					/>
				))}
			</div>
		);
	}

});
