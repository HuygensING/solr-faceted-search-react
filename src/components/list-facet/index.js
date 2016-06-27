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
		const { query, label, facets, field, value, bootstrapCss, facetSort } = this.props;

		const facetCounts = facets.filter((facet, i) => i % 2 === 1);
		const facetValues = facets.filter((facet, i) => i % 2 === 0);

		const facetSortValue = facetSort ? facetSort :
			query.facetSort ? query.facetSort :
			(query.facetLimit && query.facetLimit > -1 ? "count" : "index");

		return (
			<li className={cx("list-facet", {"list-group-item": bootstrapCss})} id={`solr-list-facet-${field}`}>
				<header>
					<h3>
						{label}
						<button className={cx({"btn": bootstrapCss, "btn-primary": bootstrapCss, "btn-xs": bootstrapCss, "pull-right": bootstrapCss})}
							onClick={() => this.props.onChange(field, [])}>
							&#x274c;
						</button>
					</h3>
					<span className={cx({"btn-group": bootstrapCss})}>
						<button className={cx({"btn": bootstrapCss, "btn-primary": bootstrapCss, "btn-xs": bootstrapCss, active: facetSortValue === "index"})}
							onClick={() => this.props.onFacetSortChange(field, "index") }>
							a-z
						</button>
						<button className={cx({"btn": bootstrapCss, "btn-primary": bootstrapCss, "btn-xs": bootstrapCss, active: facetSortValue === "count"})}
							onClick={() => this.props.onFacetSortChange(field, "count")}>
							0-9
						</button>
					</span>
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
	children: React.PropTypes.array,
	facetSort: React.PropTypes.string,
	facets: React.PropTypes.array.isRequired,
	field: React.PropTypes.string.isRequired,
	label: React.PropTypes.string,
	onChange: React.PropTypes.func,
	onFacetSortChange: React.PropTypes.func,
	query: React.PropTypes.object,
	value: React.PropTypes.array
};

export default ListFacet;