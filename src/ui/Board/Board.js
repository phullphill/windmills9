import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { range } from 'common';
import { Row } from './Row';

import './board.less';

export class Board extends PureComponent {

	static propTypes = { board: PropTypes.shape({}).isRequired };

	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error, info) {
		// Display fallback UI
		this.setState({ hasError: true });
		// You can also log the error to an error reporting service
		console.log(error, info);
	}

	renderBoardStyle = () => ({
		position: 'absolute',
		height: 'inherit',
		width: 'inherit',
		overflow: 'hidden',
	});

	renderRows = () => {
		const { board } = this.props;
		const height = board.portHeight;
		return range(0, height - 1).map((rowIndex) => (
			<Row
				key={rowIndex}
				board={board}
				rowIndex={rowIndex}
			/>
		));
	}

	render() {
		const { hasError } = this.state;
		if (hasError) {
			return <span>Something went wrong</span>;
		}

		return (
			<div className="board" style={this.renderBoardStyle()}>
				{this.renderRows()}
			</div>
		);

	}

}
