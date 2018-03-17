
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { COMPASS, SQUARE_SIZE } from 'common';
import { gameActions, gameSelectors } from 'game';

function mapStateToProps(state) {
	return {
		activePlayerId: gameSelectors.players.activeId(state),
		activeVaneId: gameSelectors.player.activeVaneId(state, gameSelectors.players.activeId(state)),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			setActiveVane: (playerId, vaneId) => dispatch(gameActions.setActiveVane({ playerId, vaneId })),
		},
	};
}

export const Vane = connect(mapStateToProps, mapDispatchToProps)(class Vane extends PureComponent {

	static defaultProps = {
		activeVaneId: null,
	};

	static propTypes = {
		vane: PropTypes.shape({}).isRequired,
		colIndex: PropTypes.number.isRequired,
		activePlayerId: PropTypes.string.isRequired,
		activeVaneId: PropTypes.string,
		actions: PropTypes.shape({}).isRequired,
	}

	canBeRotated = () => true

	handleClickVane = () => {
		const { vane, activePlayerId, activeVaneId, actions } = this.props;
		if (vane.id === activeVaneId) {
			return;
		}
		actions.setActiveVane(activePlayerId, vane.id);
	}

	renderWrapperClasses = () => {
		const { vane, activeVaneId } = this.props;
		return classNames(
			'vane-wrapper',
			{
				'is-active': vane.id === activeVaneId,
				'rotatable': this.canBeRotated(),
			}
		);
	}

	renderWrapperStyle = () => {
		const { colIndex } = this.props;
		return {
			left: `${colIndex * SQUARE_SIZE}px`,
		};
	}

	renderVaneClasses = () => {
		const { vane } = this.props;
		return classNames(
			'vane',
			{
				'north-east': (vane.direction === COMPASS.NORTHEAST),
				'south-east': (vane.direction === COMPASS.SOUTHEAST),
				'south-west': (vane.direction === COMPASS.SOUTHWEST),
				'north-west': (vane.direction === COMPASS.NORTHWEST),
			}
		);
	}

	render() {
		const { vane } = this.props;
		return (
			<div
				id={vane.id}
				className={this.renderWrapperClasses()}
				style={this.renderWrapperStyle()}
				onClick={this.handleClickVane}
				onKeyPress={this.handleClickVane}
			>
				<div className={this.renderVaneClasses()} />
			</div>
		);
	}

});
