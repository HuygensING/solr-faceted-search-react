import React from "react";
import cx from "classnames";

import TextSearch from "./text-search";
import ListFacet from "./list-facet";
import Result from "./results/result";
import RangeFacet from "./range-facet";
import CountLabel from "./results/count-label";
import SortMenu from "./sort-menu";

import store from "../reducers/store";

import { onInit, onFieldChange } from "../actions";



class SolrFacetedSearch extends React.Component {

	constructor(props) {
		super(props);

		this.state = store.getState();
	}

	componentDidMount() {
		this.unsubscribe = store.subscribe(this.updateState.bind(this));
		onInit(this.props.solrUrl, this.props.searchFields, this.props.sortFields);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	updateState() {
		this.setState(store.getState());
	}


	render() {
		const { queries, results } = this.state;
		const { searchFields, sortFields } = queries;
		const { customComponents, bootstrapCss } = this.props;
		const ResultCount = customComponents.results.resultCount;
		const SortComponent = customComponents.sortFields.menu;

		return (
			<div className={cx("solr-faceted-search", {"container": bootstrapCss, "col-md-12": bootstrapCss})}>


				<div className={cx({"col-md-3": bootstrapCss})}>
					<div className={cx({"panel": bootstrapCss, "panel-default": bootstrapCss})}>
						<header className={cx({"panel-heading": bootstrapCss})}>
							<label>Search</label>
						</header>

						<ul className={cx("solr-search-fields", {"list-group": bootstrapCss})}>
							{searchFields.map((searchField, i) => {
								const { type, field } = searchField;
								const SearchComponent = customComponents.searchFields[type];
								const facets = type === "list-facet" || type === "range-facet" ? results.facets[field] || [] : null;
								return <SearchComponent key={i} {...this.state} {...searchField} bootstrapCss={bootstrapCss} facets={facets} onChange={onFieldChange} />;
							})}
						</ul>
					</div>
				</div>

				<div className={cx("solr-search-results", {"col-md-9": bootstrapCss})}>
					<div className={cx({"panel": bootstrapCss, "panel-default": bootstrapCss})}>
						<div className={cx({"panel-heading": bootstrapCss})}>
							<ResultCount bootstrapCss={bootstrapCss} numFound={results.numFound} />
							<SortComponent bootstrapCss={bootstrapCss} onChange={onFieldChange} sortFields={sortFields} />
						</div>
						<ul className={cx({"list-group": bootstrapCss})}>
							{results.docs.map((doc, i) => <Result bootstrapCss={bootstrapCss} doc={doc} fields={this.props.searchFields} key={i} onSelect={this.props.onSelectDoc} />)}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

SolrFacetedSearch.defaultProps = {
	bootstrapCss: true,
	customComponents: {
		searchFields: {
			text: TextSearch,
			"list-facet": ListFacet,
			"range-facet": RangeFacet
		},
		results: {
			result: Result,
			resultCount: CountLabel
		},
		sortFields: {
			menu: SortMenu
		}
	},
	searchFields: [
		{type: "text", field: "*"}
	],
	sortFields: []
};

SolrFacetedSearch.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	customComponents: React.PropTypes.object,
	onSelectDoc: React.PropTypes.func.isRequired,
	resultCountLabels: React.PropTypes.object,
	searchFields: React.PropTypes.array,
	solrUrl: React.PropTypes.string.isRequired,
	sortFields: React.PropTypes.array
};

export default SolrFacetedSearch;