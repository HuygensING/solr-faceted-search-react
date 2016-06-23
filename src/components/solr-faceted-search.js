import React from "react";
import cx from "classnames";

import componentPack from "./component-pack";


class SolrFacetedSearch extends React.Component {

	render() {
		const { customComponents, bootstrapCss, query, results } = this.props;
		const { onSearchFieldChange, onSortFieldChange, onPageChange } = this.props;

		const { searchFields, sortFields } = query;


		const SearchFieldContainerComponent = customComponents.searchFields.container;
		const ResultContainerComponent = customComponents.results.container;

		const ResultComponent = customComponents.results.result;
		const ResultCount = customComponents.results.resultCount;
		const ResultHeaderComponent = customComponents.results.header;
		const ResultListComponent = customComponents.results.list;
		const ResultPendingComponent = customComponents.results.pending;
		const PaginateComponent = customComponents.results.paginate;

		const SortComponent = customComponents.sortFields.menu;
		const resultPending = results.pending ? (<ResultPendingComponent bootstrapCss={bootstrapCss} />) : null;

		const pagination = query.pageStrategy === "paginate" ?
			<PaginateComponent {...this.props} bootstrapCss={bootstrapCss} onChange={onPageChange} /> :
			null;

		return (
			<div className={cx("solr-faceted-search", {"container": bootstrapCss, "col-md-12": bootstrapCss})}>
				<SearchFieldContainerComponent bootstrapCss={bootstrapCss}>
					{searchFields.map((searchField, i) => {
						const { type, field } = searchField;
						const SearchComponent = customComponents.searchFields[type];
						const facets = type === "list-facet" || type === "range-facet" ? results.facets[field] || [] : null;
						return (<SearchComponent
							key={i} {...this.props} {...searchField}
							bootstrapCss={bootstrapCss}
							facets={facets}
							onChange={onSearchFieldChange} />
						);
					})}
				</SearchFieldContainerComponent>

				<ResultContainerComponent bootstrapCss={bootstrapCss}>
					<ResultHeaderComponent bootstrapCss={bootstrapCss}>
						<ResultCount bootstrapCss={bootstrapCss} numFound={results.numFound} />
						{resultPending}
						<SortComponent bootstrapCss={bootstrapCss} onChange={onSortFieldChange} sortFields={sortFields} />
					</ResultHeaderComponent>
					{pagination}
					<ResultListComponent bootstrapCss={bootstrapCss}>
						{results.docs.map((doc, i) => (
							<ResultComponent bootstrapCss={bootstrapCss}
								doc={doc}
								fields={searchFields}
								key={i}
								onSelect={this.props.onSelectDoc} />
						))}
					</ResultListComponent>
					{pagination}
				</ResultContainerComponent>
			</div>
		);
	}
}

SolrFacetedSearch.defaultProps = {
	bootstrapCss: true,
	customComponents: componentPack,
	pageStrategy: "paginate",
	rows: 20,
	searchFields: [
		{type: "text", field: "*"}
	],
	sortFields: []
};

SolrFacetedSearch.propTypes = {
	bootstrapCss: React.PropTypes.bool,
	customComponents: React.PropTypes.object,
	onPageChange: React.PropTypes.func,
	onSearchFieldChange: React.PropTypes.func.isRequired,
	onSelectDoc: React.PropTypes.func.isRequired,
	onSortFieldChange: React.PropTypes.func.isRequired,
	query: React.PropTypes.object,
	results: React.PropTypes.object
};

export default SolrFacetedSearch;