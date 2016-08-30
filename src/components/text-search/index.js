import React from "react";
import cx from "classnames";
import SearchIcon from "../icons/search";


class TextSearch extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: "",
			expanded: props.collapse ? false : true
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
		this.setState({expanded: !this.state.expanded});
	}

	render() {
		const { label, bootstrapCss } = this.props;

		return (
			<li className={cx({"list-group-item": bootstrapCss})}>
				<header onClick={this.toggleExpand.bind(this)}>
					<h5>
						{bootstrapCss ? (<span>
							<span className={cx("glyphicon", {
								"glyphicon-collapse-down": this.state.expanded,
								"glyphicon-collapse-up": !this.state.expanded
							})} />{" "}
						</span>) : null }
						{label}
					</h5>
				</header>
				<div style={{display: this.state.expanded ? "block" : "none"}}>
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
	bootstrapCss: React.PropTypes.bool,
	field: React.PropTypes.string.isRequired,
	label: React.PropTypes.string,
	onChange: React.PropTypes.func
};

export default TextSearch;