import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SQUARE_SIZE, COMPASS } from 'common';
import { CompassPoint } from './CompassPoint';

export class CompassRose extends PureComponent {

	static propTypes = {
		disabledDirections: PropTypes.arrayOf(PropTypes.string).isRequired,
		onSelect: PropTypes.func.isRequired,
	}

	renderCompassPoints = (points, size) => {
		const { onSelect, disabledDirections } = this.props;
		return points.map((direction) => {
			const isEnabled = !disabledDirections.some((d) => d === direction);
			return (
				<CompassPoint
					key={COMPASS.keyOf(direction)}
					direction={direction}
					size={size}
					isEnabled={isEnabled}
					onSelect={onSelect}
				/>
			);
		});
	}

	renderQuarterPoints = () => {
		const quarters = [COMPASS.NORTHWEST, COMPASS.NORTHEAST, COMPASS.SOUTHEAST, COMPASS.SOUTHWEST];
		return this.renderCompassPoints(quarters, 45);
	}

	renderCardinalPoints = () => {
		const cardinals = [COMPASS.NORTH, COMPASS.EAST, COMPASS.SOUTH, COMPASS.WEST];
		return this.renderCompassPoints(cardinals, 50);
	}

	render() {
		return (
			<div className="compass-rose" >
				<svg width="100" height="100" viewBox="-50 -50 100 100" >
					<g transform="rotate(45 0 0)">
						{this.renderQuarterPoints()}
					</g>
					<g>
						{this.renderCardinalPoints()}
					</g>
				</svg>
			</div>
		);
	}
}
