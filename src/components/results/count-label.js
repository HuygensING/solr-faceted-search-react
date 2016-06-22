import React from "react";
import cx from "classnames";


const resultCountLabels = {
	pl: "Found % results",
	sg: "Found % result",
	none: "No results"
};

class Result extends React.Component {
	render() {
		const { numFound, bootstrapCss } = this.props;

		const resultLabel = numFound > 1 ? resultCountLabels.pl :
			resultCountLabels.numFound === 1 ? resultCountLabels.sg :
			resultCountLabels.none;

		return (
			<div className={cx({"panel-heading": bootstrapCss})}>
				<h3>
					{resultLabel.replace("%", numFound)}
				</h3>
			</div>
		);
	}
}

Result.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	numFound: React.PropTypes.number.isRequired
};

export default Result;