import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SQUARE_SIZE, COMPASS } from 'common';

export class VaneIndicator extends PureComponent {

	static defaultProps = {
		size: SQUARE_SIZE,
		direction: COMPASS.NORTHEAST,
		colour: 'black',
		transform: '',
	}

	static propTypes = {
		size: PropTypes.number,
		direction: PropTypes.string,
		colour: PropTypes.string,
		transform: PropTypes.string,
	}

	render() {
		const { size, direction, colour, transform } = this.props;
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

}
