import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { SQUARE_SIZE, COMPASS } from 'common';
import { gameSelectors } from 'game';
import { Icon } from '../common';

function mapStateToProps(state) {
	return {
		direction: gameSelectors.wind.direction(state),
		force: gameSelectors.wind.force(state),
	};
}

export const WindStatus = connect(mapStateToProps)(class WindStatus extends PureComponent {

	static propTypes = {
		direction: PropTypes.string.isRequired,
		force: PropTypes.number.isRequired,
	};

	renderWindIcon = () => (
		<svg viewBox="0 0 54 54" version="1.1" x="0px" y="0px">
			<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g transform="translate(-421.000000, -188.000000)" fill="#000000">
					<g transform="translate(421.000000, 188.000000)">
						<path d="M42,24 C48.627417,24 54,18.627417 54,12 C54,5.372583 48.627417,0 42,0 C35.372583,0 30,5.372583 30,12 C30,13.1045695 30.8954305,14 32,14 C33.1045695,14 34,13.1045695 34,12 C34,7.581722 37.581722,4 42,4 C46.418278,4 50,7.581722 50,12 C50,16.418278 46.418278,20 42,20 L4,20 C2.8954305,20 2,20.8954305 2,22 C2,23.1045695 2.8954305,24 4,24 L42,24 Z" />
						<path d="M20,17 C23.8659932,17 27,13.8659932 27,10 C27,6.13400675 23.8659932,3 20,3 C17.168964,3 14.6499072,4.69673402 13.5586569,7.25644077 C13.1254804,8.27252733 13.5980224,9.44738717 14.6141089,9.88056365 C15.6301955,10.3137401 16.8050553,9.84119815 17.2382318,8.82511158 C17.7062738,7.72724228 18.7859743,7 20,7 C21.6568542,7 23,8.34314575 23,10 C23,11.6568542 21.6568542,13 20,13 L2,13 C0.8954305,13 0,13.8954305 0,15 C0,16.1045695 0.8954305,17 2,17 L20,17 Z" />
						<path d="M38,31 C41.3137085,31 44,33.6862915 44,37 C44,40.3137085 41.3137085,43 38,43 C34.6862915,43 32,40.3137085 32,37 C32,35.8954305 31.1045695,35 30,35 C28.8954305,35 28,35.8954305 28,37 C28,42.5228475 32.4771525,47 38,47 C43.5228475,47 48,42.5228475 48,37 C48,31.4771525 43.5228475,27 38,27 L7,27 C5.8954305,27 5,27.8954305 5,29 C5,30.1045695 5.8954305,31 7,31 L38,31 Z" />
					</g>
				</g>
			</g>
		</svg>
	);

	renderWindForce = () => {
		const { force } = this.props;
		return (force);
	}

	renderWindArrow = () => {
		const name = 'fa-arrow-up';
		const iconSize = SQUARE_SIZE * 0.5;
		return (
			<Icon
				name={name}
				width={iconSize}
				height={iconSize}
			/>
		);
	}

	renderWindNESW = () => {
		const { direction } = this.props;
		const directionAbbreviations = {
			[COMPASS.NORTH]: 'N',
			[COMPASS.NORTHEAST]: 'NE',
			[COMPASS.EAST]: 'E',
			[COMPASS.SOUTHEAST]: 'SE',
			[COMPASS.SOUTH]: 'S',
			[COMPASS.SOUTHWEST]: 'SW',
			[COMPASS.WEST]: 'W',
			[COMPASS.NORTHWEST]: 'NW',
		};
		return (
			<span>{directionAbbreviations[direction]}</span>
		);
	}

	render() {
		return (
			<div className="wind-status" >
				<div className="wind-force" >
					<div className="wind-icon" >{this.renderWindIcon()}</div>
					<div className="wind-force" >{this.renderWindForce()}</div>
				</div>
				<div className="wind-direction" >
					<div className="wind-arrow" >{this.renderWindArrow()}</div>
					<div className="wind-nesw" >{this.renderWindNESW()}</div>
				</div>
			</div>
		);
	}
});
