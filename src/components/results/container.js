import React from "react";
import cx from "classnames";

class ResultContainer extends React.Component {

	render() {
		const { bootstrapCss } = this.props;
		return (
			<div className={cx("solr-search-results", {"col-md-9": bootstrapCss})}>
				<div className={cx({"panel": bootstrapCss, "panel-default": bootstrapCss})}>
					{this.props.children}
				</div>
			</div>
		);
	}
}

ResultContainer.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	children: React.PropTypes.array
};

export default ResultContainer;