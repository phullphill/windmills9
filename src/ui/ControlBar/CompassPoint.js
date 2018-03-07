import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SQUARE_SIZE, COMPASS } from 'common';

export class CompassPoint extends PureComponent {

	static propTypes = {
		direction: PropTypes.symbol.isRequired,
		size: PropTypes.number.isRequired,
		isEnabled: PropTypes.bool.isRequired,
		onSelect: PropTypes.func.isRequired,
	}

	handleClick = (e) => {
		const { direction, isEnabled, onSelect } = this.props;
		if (isEnabled) {
			onSelect(direction);
		}
	}

	render() {
		const { isEnabled, direction, size } = this.props;
		const fillColour = isEnabled ? 'black' : 'grey';
		const angleMap = {
			[COMPASS.NORTH]: 180,
			[COMPASS.NORTHEAST]: 180,
			[COMPASS.EAST]: -90,
			[COMPASS.SOUTHEAST]: -90,
			[COMPASS.SOUTH]: 0,
			[COMPASS.SOUTHWEST]: 0,
			[COMPASS.WEST]: 90,
			[COMPASS.NORTHWEST]: 90,
		};
		const angle = angleMap[direction];
		return (
			<g transform={`rotate(${angle} 0 0)`} onClick={this.handleClick} style={{ cursor: 'pointer' }}>
				<polygon points={`0,0 10,10 0,${size}`} style={{ fill: fillColour }} />
				<polygon points={`0,0 -10,10 0,${size}`} style={{ fill: 'white', stroke: fillColour, strokeWidth: '1' }} />
			</g>
		);
	}
}
