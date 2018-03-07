import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { range, SQUARE_SIZE } from 'common';
import { Position } from 'models';
import { Vane } from './Vane';

export class Row extends PureComponent {

	static propTypes = {
		board: PropTypes.shape({}).isRequired,
		rowIndex: PropTypes.number.isRequired,
	}

	renderRowStyle = () => {
		const { rowIndex } = this.props;
		return {
			position: 'absolute',
			left: '0px',
			top: `${rowIndex * SQUARE_SIZE}px`,
			transition: 'top 0.25s',
			transitionTimingFunction: 'linear',
		};
	}

	renderVanes = () => {
		const { board, rowIndex } = this.props;
		const width = board.portWidth;
		return range(0, width - 1).map((colIndex) => {
			const vanePosition = new Position(colIndex, rowIndex);
			const vane = board.vaneAt(vanePosition);
			return (
				<Vane
					key={colIndex}
					colIndex={colIndex}
					vane={vane}
				/>
			);
		});
	}

	render() {
		return (
			<div className="row" style={this.renderRowStyle()} >
				{this.renderVanes()}
			</div>
		);
	}
}
