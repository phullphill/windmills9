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
		const iconSize = SQUARE_SIZE * 0.6;
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

	renderMiniVane = (size, direction, colour, transform) => {
		const pointsMap = {
			[COMPASS.NORTHWEST]: `0,0 ${size},0 0,${size}`,
			[COMPASS.NORTHEAST]: `${size},0 ${size},${size} 0,0`,
			[COMPASS.SOUTHEAST]: `${size},${size} 0,${size} ${size},0`,
			[COMPASS.SOUTHWEST]: `0,${size} 0,0 ${size},${size}`,
		};
		const points = pointsMap[direction];
		return (
			<polygon points={points} fill={colour} transform={transform} />
		);
	}

	renderRightArrow = (transform) => {
		const size = SQUARE_SIZE * 0.2;
		return (
			<path
				d={`M${size * 0.1} ${size * 0.5} h${size * 0.8} l${size * -0.25} ${size * -0.25} m${size * 0.25} ${size * 0.25} l${size * -0.25} ${size * 0.25} `}
				fill="transparent"
				stroke="black"
				transform={transform}
			/>
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
		const directionAfterRotate = spin === SPIN.CLOCKWISE ? COMPASS.after2(directionNow) : COMPASS.before2(directionNow);
		const size = SQUARE_SIZE * 0.2;
		return (
			<svg width={`${size * 3}`} height={`${size}`} viewBox={`0,0 ${size * 3},${size}`} >
				{this.renderMiniVane(size, directionNow, activePlayerColour)}
				{this.renderRightArrow(`translate(${size * 1},0)`)}
				{this.renderMiniVane(size, directionAfterRotate, activePlayerColour, `translate(${size * 2},0)`)}
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
