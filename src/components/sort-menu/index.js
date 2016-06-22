import React from "react";
import ReactDOM from "react-dom";
import cx from "classnames";

class SortMenu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false
		};
		this.documentClickListener = this.handleDocumentClick.bind(this);
	}

	componentDidMount() {
		document.addEventListener("click", this.documentClickListener, false);
	}

	componentWillUnmount() {
		document.removeEventListener("click", this.documentClickListener, false);
	}

	toggleSelect() {
		if(this.state.isOpen) {
			this.setState({isOpen: false});
		} else {
			this.setState({isOpen: true});
		}
	}

	handleDocumentClick(ev) {
		const { isOpen } = this.state;
		if (isOpen && !ReactDOM.findDOMNode(this).contains(ev.target)) {
			this.setState({
				isOpen: false
			});
		}
	}

	render() {
		const { bootstrapCss, sortFields } = this.props;
		if (sortFields.length === 0) { return null; }

		return (
			<span className={cx({"dropdown": bootstrapCss, "pull-right": bootstrapCss, "open": this.state.isOpen})}>
				<button className={cx({"btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, "dropdown-toggle": bootstrapCss})}
					onClick={this.toggleSelect.bind(this)}>
					- select sort - <span className="caret"></span>
				</button>

				<ul className="dropdown-menu">
					{sortFields.map((sortField, i) => (
						<li key={i}>
							<a onClick={() => { console.log(sortField); this.toggleSelect(); }}>{sortField.label}</a>
						</li>
					))}
					{/* value ? (
						<li>
							<a onClick={() => { onClear(); this.toggleSelect();}}>
								- clear -
							</a>
						</li>
					) : null*/}
				</ul>

			</span>
		);
	}
}

SortMenu.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	sortFields: React.PropTypes.array
};

export default SortMenu;