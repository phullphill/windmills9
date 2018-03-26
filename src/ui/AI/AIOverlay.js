import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { SQUARE_SIZE } from 'common';
import { gameSelectors } from 'game';
import { aiSelectors } from 'ai';

// import './aiOverlay.less';

function mapStateToProps(state) {
	return {
		mills: gameSelectors.mills.all(state),
		millScores: aiSelectors.millScores(state),
	};
}

export const AIOverlay = connect(mapStateToProps)(class AIOverlay extends PureComponent {

	static defaultProps = {
		millScores: null,
	}

	static propTypes = {
		mills: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
		millScores: PropTypes.shape({}),
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

	renderMillScoreClasses = () => classNames('mill-score');

	renderMillScoreStyle = (position) => {
		const { x, y } = position;
		const size = SQUARE_SIZE * 0.3;
		return {
			left: `${((x * SQUARE_SIZE) - (size / 2))}px`,
			top: `${((y * SQUARE_SIZE) - (size / 2))}px`,
		};
	};

	renderMillScore = (mill) => {
		const { millScores } = this.props;
		return (
			<div
				key={`${mill.id}`}
				className={this.renderMillScoreClasses()}
				style={this.renderMillScoreStyle(mill.position)}
			>
				<span>{millScores[mill.id].totalScore}</span>
			</div>
		);
	}

	renderMillScores = () => {
		const { mills, millScores } = this.props;
		if (!millScores) {
			return null;
		}
		return mills.map((mill) => this.renderMillScore(mill));
	}

	render() {
		const { hasError } = this.state;
		if (hasError) {
			return <span>Something went wrong</span>;
		}

		return (
			<div className="ai-overlay" >
				{this.renderMillScores()}
			</div>
		);
	}

});
