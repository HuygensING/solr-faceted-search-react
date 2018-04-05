import PropTypes from 'prop-types';
import React from "react";
import cx from "classnames";
import SearchIcon from "../icons/search";


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

	toggleExpand() {
		this.props.onSetCollapse(this.props.field, !(this.props.collapse || false));
	}

	render() {
		const { label, bootstrapCss, collapse } = this.props;

		return (
			<li className={cx({"list-group-item": bootstrapCss})}>
				<header onClick={this.toggleExpand.bind(this)}>
					<h5>
						{bootstrapCss ? (<span>
							<span className={cx("glyphicon", {
								"glyphicon-collapse-down": !collapse,
								"glyphicon-collapse-up": collapse
							})} />{" "}
						</span>) : null }
						{label}
					</h5>
				</header>
				<div style={{display: collapse ? "none" : "block"}}>
					<input
						onChange={this.handleInputChange.bind(this)}
						onKeyDown={this.handleInputKeyDown.bind(this)}
						value={this.state.value || ""} />
					&nbsp;
					<button className={cx({"btn": bootstrapCss, "btn-default": bootstrapCss, "btn-sm": bootstrapCss})} onClick={this.handleSubmit.bind(this)}>
						<SearchIcon />
					</button>
				</div>
			</li>
		);
	}
}

TextSearch.defaultProps = {
	field: null
};

TextSearch.propTypes = {
	bootstrapCss: PropTypes.bool,
	collapse: PropTypes.bool,
	field: PropTypes.string.isRequired,
	label: PropTypes.string,
	onChange: PropTypes.func,
	onSetCollapse: PropTypes.func
};

export default TextSearch;