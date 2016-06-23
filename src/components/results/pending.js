import React from "react";

class Pending extends React.Component {

	render() {
		return <span>Waiting for results</span>;
	}
}

Pending.propTypes = {
	bootstrapCss: React.PropTypes.bool
};

export default Pending;