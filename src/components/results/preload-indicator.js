import React from "react";
import ReactDOM from "react-dom";
import cx from "classnames";

class PreloadIndicator extends React.Component {
	constructor(props) {
		super(props);

		this.scrollListener = this.onWindowScroll.bind(this);
	}

	componentDidMount() {
		window.addEventListener("scroll", this.scrollListener);
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.scrollListener);
	}

	onWindowScroll() {
		const { pageStrategy } = this.props.query;
		const { pending } = this.props.results;

		if (pageStrategy !== "cursor" || pending) { return; }

		const domNode = ReactDOM.findDOMNode(this);
		if (!domNode) { return; }

		const { top } = domNode.getBoundingClientRect();

		if (top < window.innerHeight) {
			this.props.onNextCursorQuery();
		}
	}

	render() {
		const { bootstrapCss } = this.props;
		return (
			<li className={cx("fetch-by-cursor", {"list-group-item": bootstrapCss})}>
				Loading more...
			</li>
		);
	}
}

PreloadIndicator.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	onNextCursorQuery: React.PropTypes.func,
	query: React.PropTypes.object,
	results: React.PropTypes.object
};

export default PreloadIndicator;