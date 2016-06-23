import React from "react";
import cx from "classnames";

class TextSearch extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: ""
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			value: nextProps.value
		});
	}

	handleInputChange(ev) {
		this.setState({
			value: ev.target.value
		});
	}

	handleInputKeyDown(ev) {
		if (ev.keyCode === 13) {
			this.handleSubmit();
		}
	}

	handleSubmit() {
		this.props.onChange(this.props.field, this.state.value);
	}

	render() {
		const { label, bootstrapCss } = this.props;

		return (
			<li className={cx({"list-group-item": bootstrapCss})}>
				<header><h3>{label}</h3></header>
				<input
					onChange={this.handleInputChange.bind(this)}
					onKeyDown={this.handleInputKeyDown.bind(this)}
					value={this.state.value || ""} />
				<button onClick={this.handleSubmit.bind(this)}>
					Search
				</button>
			</li>
		);
	}
}

TextSearch.defaultProps = {
	field: null
};

TextSearch.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	field: React.PropTypes.string.isRequired,
	label: React.PropTypes.string,
	onChange: React.PropTypes.func
};

export default TextSearch;