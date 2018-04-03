import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SQUARE_SIZE, COMPASS, SPIN } from 'common';
import { Icon, VaneIndicator } from '../common';

export class RotateButton extends PureComponent {

	static defaultProps = { activeVane: null };

	static propTypes = {
		spin: PropTypes.string.isRequired,
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
		// const rotation = {
		// 	[COMPASS.NORTHWEST]: -90,
		// 	[COMPASS.NORTHEAST]: 0,
		// 	[COMPASS.SOUTHEAST]: 90,
		// 	[COMPASS.SOUTHWEST]: 180,
		// };
		// transform = {`rotate(${rotation[directionNow]}, ${size * 0.5} ${size * 0.5})`
		// transform = {`translate(${size * 2},0) rotate(${rotation[directionAfterRotate]}, ${size * 0.5} ${size * 0.5})`
		return (
			<svg width={`${size * 3}`} height={`${size}`} viewBox={`0,0 ${size * 3},${size}`} >
				<VaneIndicator
					size={size}
					direction={directionNow}
					colour={activePlayerColour}
				/>
				{this.renderRightArrow(`translate(${size * 1},0)`)}
				<VaneIndicator
					size={size}
					direction={directionAfterRotate}
					colour={activePlayerColour}
					transform={`translate(${size * 2},0)`}
				/>
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
