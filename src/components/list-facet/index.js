import React from "react";
import cx from "classnames";

import CheckedIcon from "../icons/checked";
import UncheckedIcon from "../icons/unchecked";

class ListFacet extends React.Component {


	handleClick(value) {
		const foundIdx = this.props.value.indexOf(value);
		if (foundIdx < 0) {
			this.props.onChange(this.props.field, this.props.value.concat(value));
		} else {
			this.props.onChange(this.props.field, this.props.value.filter((v, i) => i !== foundIdx));
		}
	}


	render() {
		const { label, facets, field, value, bootstrapCss } = this.props;

		const facetCounts = facets.filter((facet, i) => i % 2 === 1);
		const facetValues = facets.filter((facet, i) => i % 2 === 0);

		return (
			<li className={cx("list-facet", {"list-group-item": bootstrapCss})} id={`solr-list-facet-${field}`}>
				<header>
					<h3>
						{label}
						<button className={cx({"btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, "pull-right": bootstrapCss})}
							onClick={() => this.props.onChange(field, [])}>
							&#x274c;
						</button>
					</h3>
				</header>
				<ul className={cx({"list-group": bootstrapCss})} style={{overflowY: "auto", maxHeight: "200px"}}>
					{facetValues.map((facetValue, i) => (
						<li className={cx({"list-group-item": bootstrapCss})} key={i} onClick={() => this.handleClick(facetValue)} style={{cursor: "pointer"}}>
							{value.indexOf(facetValue) > -1 ? <CheckedIcon /> : <UncheckedIcon />} {facetValue} ({facetCounts[i]})
						</li>
					))}
				</ul>
			</li>
		);
	}
}

ListFacet.defaultProps = {
	value: []
};

ListFacet.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	facets: React.PropTypes.array.isRequired,
	field: React.PropTypes.string.isRequired,
	label: React.PropTypes.string,
	onChange: React.PropTypes.func,
	value: React.PropTypes.array
};

export default ListFacet;