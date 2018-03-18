
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { SQUARE_SIZE, SPIN } from 'common';
import { Position } from 'models';
import { gameActions, gameSelectors } from 'game';
import { MillIndicator } from 'ui';

function mapStateToProps(state, ownProps) {
	return {
		mill: gameSelectors.mill.at(state, ownProps.miller.position),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			setActiveMiller: (playerId, millerId) => dispatch(gameActions.setActiveMiller({ playerId, millerId })),
		},
	};
}

export const Miller = connect(mapStateToProps, mapDispatchToProps)(class Miller extends PureComponent {

	static propTypes = {
		board: PropTypes.shape({}).isRequired,
		player: PropTypes.shape({}).isRequired,
		isActivePlayer: PropTypes.bool.isRequired,
		miller: PropTypes.shape({}).isRequired,
		mill: PropTypes.shape({}).isRequired,
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

	renderMillerClasses = () => {
		const { player, isActivePlayer, miller, mill } = this.props;
		const isSelected = (miller.id === player.activeMillerId);
		return classNames(
			'miller-marker',
			{
				'is-active-player': isActivePlayer,
				'is-selected': isSelected,
				'is-milling': mill.isSpinning(),
			}
		);
	}

	renderMillerStyle = (position) => {
		const { player, mill } = this.props;
		const { x, y } = position;
		const size = SQUARE_SIZE * 0.3;
		return {
			backgroundColor: player.millerColour,
			left: `${((x * SQUARE_SIZE) - (size / 2))}px`,
			top: `${((y * SQUARE_SIZE) - (size / 2))}px`,
		};
	}

	renderSpinVane = (quarter) => (
		<path />
	);

	renderMillingIndicator = () => {
		const { player, mill } = this.props;
		if (!mill.isSpinning()) {
			return null;
		}
		const { x, y } = mill.position;
		const size = SQUARE_SIZE;
		let { spin } = mill;
		if (player.colour === 'white') {
			spin = (spin === SPIN.CLOCKWISE ? SPIN.ANTICLOCKWISE : SPIN.CLOCKWISE);
		}
		const className = classNames(
			'mill-indicator',
			{
				clockwise: spin === SPIN.CLOCKWISE,
				anticlockwise: spin === SPIN.ANTICLOCKWISE,
			}
		);
		const style = {
			position: 'absolute',
			left: `${(x - 1) * size}px`,
			top: `${(y - 1) * size}px`,
		};
		return (
			<MillIndicator
				className={className}
				style={style}
				size={SQUARE_SIZE}
				spin={spin}
				colour={player.colour}
			/>
		);
	}

	render() {
		const { miller } = this.props;
		return (
			<div id={miller.id} className="miller" >
				{this.wrapPositionAtEdges(miller.position).map((position) => (
					<div
						key={`${miller.id}-${position}`}
						className={this.renderMillerClasses()}
						style={this.renderMillerStyle(position)}
						onClick={this.handleSelectMiller}
						onKeyPress={this.handleKeyPress}
					/>
				))}
				{this.renderMillingIndicator()}
			</div>
		);
	}

});
