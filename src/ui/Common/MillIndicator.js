import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { COMPASS, SPIN, SQUARE_SIZE } from 'common';
import { VaneIndicator } from './VaneIndicator';

export class MillIndicator extends PureComponent {

	static defaultProps = {
		className: '',
		size: SQUARE_SIZE,
		colour: 'black',
		spin: SPIN.CLOCKWISE,
		style: {},
	}

	static propTypes = {
		className: PropTypes.string,
		size: PropTypes.number,
		colour: PropTypes.string,
		spin: PropTypes.string,
		style: PropTypes.shape({}),
	}

	render() {
		const { className, size, colour, spin, style } = this.props;
		const millSize = size * 2;
		return (
			<svg
				className={className}
				style={style}
				width={millSize}
				height={millSize}
				viewBox={`-${size},-${size} ${millSize},${millSize}`}
			>
				{COMPASS.quarters.map((q, index) => (
					<VaneIndicator
						key={q}
						size={size}
						colour={colour}
						direction={spin === SPIN.CLOCKWISE ? COMPASS.SOUTHWEST : COMPASS.NORTHEAST}
						transform={`rotate(${index * 90} 0 0)`}
					/>
				))}
			</svg>
		);
	}

}
