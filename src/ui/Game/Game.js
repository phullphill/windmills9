import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { SQUARE_SIZE } from 'common';
import { gameSelectors } from 'game';

import { Board } from '../Board';
import { Millers } from '../Millers';
import { ControlBar } from '../ControlBar';
import { AIOverlay } from '../AI';

import './Game.less';

function mapStateToProps(state) {
	return {
		board: gameSelectors.board.board(state),
		players: gameSelectors.players.all(state),
		activePlayerId: gameSelectors.players.activeId(state),
	};
}

export const Game = connect(mapStateToProps)(class Game extends PureComponent {

	static propTypes = {
		board: PropTypes.shape({}).isRequired,
		players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
		activePlayerId: PropTypes.string.isRequired,
	};

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

	renderAppStyle = () => {
		const { board } = this.props;
		return {
			width: `${board.portWidth * SQUARE_SIZE}px`,
			display: 'flex',
			flexDirection: 'column',
		};
	}

	renderBoardWrapperStyle = () => {
		const { board: { portHeight, portWidth } } = this.props;
		return {
			display: 'flex',
			height: `${(portHeight * SQUARE_SIZE)}px`,
			width: `${(portWidth * SQUARE_SIZE)}px`,
			overflow: 'hidden',
		};
	}

	renderBoard = () => {
		const { board } = this.props;
		return (
			<Board board={board} />
		);
	}

	renderMillers = () => {
		const { board, players, activePlayerId } = this.props;
		return (
			<Millers
				board={board}
				players={players}
				activePlayerId={activePlayerId}
			/>
		);
	}

	renderControlBar = () => (
		<ControlBar />
	);

	renderAIOverlay = () => (
		<AIOverlay />
	);

	render() {
		const { hasError } = this.state;
		if (hasError) {
			return <span>Something went wrong</span>;
		}

		return (
			<div className="windmills-app" style={this.renderAppStyle()} >
				<div className="board-wrapper" style={this.renderBoardWrapperStyle()}>
					{this.renderBoard()}
					{this.renderMillers()}
					{this.renderAIOverlay()}
				</div>
				{this.renderControlBar()}
			</div>
		);
	}
});
