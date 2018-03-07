
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { COMPASS, SQUARE_SIZE } from 'common';
import { boardActions, boardSelectors } from 'board';

function mapStateToProps(state) {
	return {
		activeVaneId: boardSelectors.activeVaneId(state),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: {
			selectVane: (vaneId) => dispatch(boardActions.selectVane(vaneId)),
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
		activeVaneId: PropTypes.string,
		actions: PropTypes.shape({}).isRequired,
	}

	canBeRotated = () => true

	handleClick = () => {
		const { vane, actions } = this.props;
		console.log('handleClick on vane ', vane.id);
		actions.selectVane(vane.id);
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
				onClick={this.handleClick}
				onKeyPress={this.handleClick}
			>
				<div className={this.renderVaneClasses()} />
			</div>
		);
	}

});
