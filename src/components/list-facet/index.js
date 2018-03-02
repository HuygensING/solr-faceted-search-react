import PropTypes from 'prop-types';
import React from "react";
import cx from "classnames";

import CheckedIcon from "../icons/checked";
import UncheckedIcon from "../icons/unchecked";

class ListFacet extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			filter: "",
			truncateFacetListsAt: props.truncateFacetListsAt
		};
	}

	handleClick(value) {
		const foundIdx = this.props.value.indexOf(value);
		if (foundIdx < 0) {
			this.props.onChange(this.props.field, this.props.value.concat(value));
		} else {
			this.props.onChange(this.props.field, this.props.value.filter((v, i) => i !== foundIdx));
		}
	}

	toggleExpand() {
		this.props.onSetCollapse(this.props.field, !(this.props.collapse || false));
	}

	render() {
		const { query, label, facets, field, value, bootstrapCss, facetSort, collapse } = this.props;
		const { truncateFacetListsAt } = this.state;

		const facetCounts = facets.filter((facet, i) => i % 2 === 1);
		const facetValues = facets.filter((facet, i) => i % 2 === 0);

		const facetSortValue = facetSort ? facetSort :
			query.facetSort ? query.facetSort :
			(query.facetLimit && query.facetLimit > -1 ? "count" : "index");

		const expanded = !(collapse || false);

		const showMoreLink = truncateFacetListsAt > -1 && truncateFacetListsAt < facetValues.length ?
			<li className={cx({"list-group-item": bootstrapCss})} onClick={() => this.setState({truncateFacetListsAt: -1})}>
				Show all ({facetValues.length})
			</li> : null;

		return (
			<li className={cx("list-facet", {"list-group-item": bootstrapCss})} id={`solr-list-facet-${field}`}>
				<header onClick={this.toggleExpand.bind(this)}>
					<h5>
						{bootstrapCss ? (<span>
							<span className={cx("glyphicon", {
								"glyphicon-collapse-down": expanded,
								"glyphicon-collapse-up": !expanded
							})} />{" "}
						</span>) : null }
						{label}
					</h5>
				</header>
				{ expanded ? (
					<div>
						<ul className={cx({"list-group": bootstrapCss})}>
							{facetValues.filter((facetValue, i) => truncateFacetListsAt < 0 || i < truncateFacetListsAt).map((facetValue, i) =>
								this.state.filter.length === 0 || facetValue.toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1 ? (
								<li className={cx(`facet-item-type-${field}`, {"list-group-item": bootstrapCss})} key={`${facetValue}_${facetCounts[i]}`} onClick={() => this.handleClick(facetValue)}>
									{value.indexOf(facetValue) > -1 ? <CheckedIcon /> : <UncheckedIcon />} {facetValue}
									<span className="facet-item-amount">{facetCounts[i]}</span>
								</li>) : null
							)}
							{showMoreLink}
						</ul>
						{ facetValues.length > 4 ? (
							<div>
								<input onChange={(ev) => this.setState({filter: ev.target.value})} placeholder="Filter... " type="text" value={this.state.filter} />&nbsp;
								<span className={cx({"btn-group": bootstrapCss})}>
									<button className={cx({"btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, active: facetSortValue === "index"})}
											onClick={() => this.props.onFacetSortChange(field, "index") }>
										a-z
									</button>
									<button className={cx({"btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss, active: facetSortValue === "count"})}
											onClick={() => this.props.onFacetSortChange(field, "count")}>
										0-9
									</button>
								</span>
								<span className={cx({"btn-group": bootstrapCss, "pull-right": bootstrapCss})}>
									<button className={cx({"btn": bootstrapCss, "btn-default": bootstrapCss, "btn-xs": bootstrapCss})}
										onClick={() => this.props.onChange(field, [])}>
										clear
									</button>
								</span>
							</div>
						) : null }
					</div>
				) : null }
			</li>
		);
	}
}

ListFacet.defaultProps = {
	value: []
};

ListFacet.propTypes = {
	bootstrapCss: PropTypes.bool,
	children: PropTypes.array,
	collapse: PropTypes.bool,
	facetSort: PropTypes.string,
	facets: PropTypes.array.isRequired,
	field: PropTypes.string.isRequired,
	label: PropTypes.string,
	onChange: PropTypes.func,
	onFacetSortChange: PropTypes.func,
	onSetCollapse: PropTypes.func,
	query: PropTypes.object,
	truncateFacetListsAt: PropTypes.number,
	value: PropTypes.array
};

export default ListFacet;