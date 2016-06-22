import React from "react";
import cx from "classnames";

class ResultList extends React.Component {

	render() {
		const { bootstrapCss } = this.props;
		return (
			<ul className={cx({"list-group": bootstrapCss})}>
				{this.props.children}
			</ul>
		);
	}
}

ResultList.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	children: React.PropTypes.array
};

export default ResultList;