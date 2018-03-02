import PropTypes from 'prop-types';
import React from "react";

class Pending extends React.Component {

	render() {
		return <span>Waiting for results</span>;
	}
}

Pending.propTypes = {
	bootstrapCss: PropTypes.bool
};

export default Pending;