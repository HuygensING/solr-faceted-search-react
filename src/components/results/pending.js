import React from "react";
import cx from "classnames";

class Pending extends React.Component {

	render() {
		const { bootstrapCss } = this.props;
		return <div className={cx({"panel-body": bootstrapCss})}>Waiting for results</div>;
	}
}

Pending.propTypes = {
	bootstrapCss: React.PropTypes.bool
};

export default Pending;