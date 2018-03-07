import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Icon component.
 *
 * A pure react component that takes an icon name and renders an <span> element with appropriate classes.
 * If 'name' property starts with 'fa-' it renders a font awesome icon, otherwise a material design icon.
 * Usage: <Icon name='fa-pin' /> or <Icon name='menu' />
 *
 * @param {string} id unique id for the icon (optional)
 * @param {string} name Icon name
 * @param {string} className extra class(es) to add to icon classes (optional)
 * @param {function} onClick to call when icon is clicked (optional)
 * @param {string} color the icon colour
 * @param {number|string} width icon width - defaults to 'auto'
 * @param {number|string} height icon height - defaults to 'auto'
 */
export class Icon extends PureComponent {

	static defaultProps = {
		id: null,
		className: '',
		onClick: null,
		color: null,
		width: 'auto',
		height: 'auto',
		isDisabled: false,
	};

	static propTypes = {
		id: PropTypes.string,
		name: PropTypes.string.isRequired,
		className: PropTypes.string,
		onClick: PropTypes.func,
		color: PropTypes.string,
		width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		isDisabled: PropTypes.bool,
	};

	hasOnClick = () => typeof this.props.onClick === 'function';

	isFontAwesomeIcon = () => this.props.name.startsWith('fa-');

	handleClick = () => {
		const { onClick, isDisabled } = this.props;
		if (!isDisabled) {
			onClick();
		}
	}

	handleKeyPress = () => { }

	renderIconClasses = () => {
		const { name, className, isDisabled } = this.props;
		const isfaIcon = this.isFontAwesomeIcon();
		return classNames(
			'icon',
			className,
			{
				[name]: isfaIcon,
				'fas': isfaIcon,
				'material-icons': !isfaIcon,
				'disabled': isDisabled,
			},
		);
	}

	renderIconStyle = () => {
		const { color, width = 'auto', height = 'auto', isDisabled } = this.props;
		const style = {
			width: typeof width === 'number' ? `${width}px` : width,
			height: typeof height === 'number' ? `${height}px` : height,
		};
		if (this.hasOnClick() && !isDisabled) {
			style.cursor = 'pointer';
		}
		if (color) {
			style.color = color;
		}
		return style;
	}

	renderIconContent = () => {
		if (this.isFontAwesomeIcon()) {
			return null;
		}
		return this.props.name;
	}

	render() {
		const { id } = this.props;
		return (
			<span
				id={id}
				className={this.renderIconClasses()}
				style={this.renderIconStyle()}
				onClick={this.handleClick}
				onKeyPress={this.handleKeyPress}
			>
				{this.renderIconContent()}
			</span>
		);
	}

}
