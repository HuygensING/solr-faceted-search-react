import React from "react";

const resultCountLabels = {
	pl: "Found % results",
	sg: "Found % result",
	none: "No results"
};

class Result extends React.Component {
	render() {
		const { numFound } = this.props;
		const resultLabel = numFound > 1 ? resultCountLabels.pl :
			numFound === 1 ? resultCountLabels.sg :
			resultCountLabels.none;

		return (
			<label>
				{resultLabel.replace("%", numFound)}
			</label>
		);
	}
}

Result.propTypes = {
	numFound: React.PropTypes.number.isRequired
};

export default Result;