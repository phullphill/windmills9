
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Miller } from './Miller';

import './millers.less';

export class Millers extends PureComponent {

	static propTypes = {
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

	render() {
		const { hasError } = this.state;
		if (hasError) {
			return <span>Something went wrong</span>;
		}

		const { players, activePlayerId } = this.props;
		return (
			<div className="millers-wrapper" >
				{players.map((player) => {
					const millers = player.millers.toArray();
					return (millers.map((miller) => (
						<Miller
							key={`${player.id}_${miller.id}`}
							player={player}
							isActivePlayer={player.id === activePlayerId}
							miller={miller}
						/>
					)));
				})}
			</div>
		);
	}

}
