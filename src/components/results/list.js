import PropTypes from 'prop-types';
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
	bootstrapCss: PropTypes.bool,
	children: PropTypes.array
};

export default ResultList;