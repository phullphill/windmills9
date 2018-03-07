import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { SQUARE_SIZE, COMPASS, SPIN } from 'common';

import { Icon } from '../Common';

export class RotateButton extends PureComponent {

	static defaultProps = { activeVane: null };

	static propTypes = {
		spin: PropTypes.symbol.isRequired,
		onSelect: PropTypes.func.isRequired,
		activePlayerColour: PropTypes.string.isRequired,
		activeVane: PropTypes.shape({}),
	}

	handleClick = () => {
		this.props.onSelect(this.props.spin);
	}

	renderIcon = () => {
		const { spin, activeVane } = this.props;
		const id = spin === SPIN.CLOCKWISE ? 'btn-cw' : 'btn-acw';
		const name = spin === SPIN.CLOCKWISE ? 'fa-redo-alt' : 'fa-undo-alt';
		const iconSize = SQUARE_SIZE * 0.75;
		return (
			<Icon
				id={id}
				name={name}
				width={iconSize}
				height={iconSize}
				isDisabled={activeVane === null}
			/>
		);
	}

	renderMiniVane = (direction, colour) => {
		const size = SQUARE_SIZE * 0.2;
		return (
			<polygon points={`0,0 0,${size} ${size},0`} fill={colour} />
		);
	}

	renderTellTale = () => {
		const { spin, activePlayerColour, activeVane } = this.props;
		if (!activeVane) {
			return null;
		}
		let directionNow = activeVane.direction;
		if (activePlayerColour === 'white') {
			directionNow = COMPASS.opposite(directionNow);
		}
		const directionAfterRotate = spin === SPIN.CLOCKWISE ? COMPASS.after(directionNow) : COMPASS.before(directionNow);
		return (
			<svg width="30" height="10" viewBox="0,0 30,10" >
				{this.renderMiniVane(directionNow, activePlayerColour)}
				{this.renderMiniVane(directionAfterRotate, activePlayerColour)}
			</svg>
		);
	}

	render() {
		return (
			<div
				className="rotate-button"
				onClick={this.handleClick}
				onKeyPress={this.handleClick}
			>
				{this.renderIcon()}
				{this.renderTellTale()}
			</div>
		);
	}
}
