import PropTypes from 'prop-types';
import React from "react";
import cx from "classnames";

class ResultHeader extends React.Component {

	render() {
		const { bootstrapCss } = this.props;
		return (
			<div className={cx({"panel-heading": bootstrapCss})}>
				{this.props.children}
			</div>
		);
	}
}

ResultHeader.propTypes = {
	bootstrapCss: PropTypes.bool,
	children: PropTypes.array
};

export default ResultHeader;