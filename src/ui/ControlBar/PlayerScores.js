import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'ui';

export class PlayerScores extends PureComponent {

	static defaultProps = { activePlayerId: null };

	static propTypes = {
		players: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
		activePlayerId: PropTypes.string,
	};

	renderMillerColour = (player) => {
		const style = { backgroundColor: player.millerColour };
		return (
			<div className="miller" style={style} />
		);
	};

	renderMillColour = (player) => {
		const fillColour = player.colour;
		return (
			<svg width="20" height="20" viewBox="-10,-10 20,20" >
				<polygon points="0,0 0,-10 -10,-10" fill={fillColour} />
				<polygon points="0,0 10,0 10,-10" fill={fillColour} />
				<polygon points="0,0 0,10 10,10" fill={fillColour} />
				<polygon points="0,0 -10,0 -10,10" fill={fillColour} />
			</svg>
		);
	}

	renderActivePlayerIndicator = (player) => {
		const { activePlayerId } = this.props;
		if (player.id !== activePlayerId) {
			return null;
		}
		return (
			<div className="player-active-indicator" >
				<Icon
					name="fa-chevron-left"
					width={10}
					height={10}
				/>
			</div>
		);
	}

	render() {
		const { players } = this.props;
		return (
			<div className="player-scores" >
				{players.map((player) => (
					<div key={player.id} className="player-and-score" >
						<div className="player-identity-and-mills" >
							<div className="player-identity" >
								<div className="player-colour-indicator" >{this.renderMillerColour(player)}</div>
								<div className="player-name" >{player.name}</div>
								{this.renderActivePlayerIndicator(player)}
							</div>
							<div className="player-mills" >
								<div className="player-mill-colour" >{this.renderMillColour(player)}</div>
								<div className="player-mill-count" >{player.millCount}</div>
							</div>
						</div>
						<div className="player-score" >{player.points}</div>
					</div>
				))}
			</div>
		);
	}
}
