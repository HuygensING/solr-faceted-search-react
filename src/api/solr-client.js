import queryReducer from "../reducers/query";
import resultReducer from "../reducers/results";
import { submitQuery } from "./server";

class SolrClient {
	constructor(settings) {
		const { onChange } = settings;

		this.onChange = onChange;
		this.state = {
			query: settings,
			results: {
				facets: [],
				docs: [],
				numFound: 0
			}
		};

		if (!this.state.query.pageStrategy) { this.state.query.pageStrategy = "paginate"; }
		if (!this.state.query.rows) { this.state.query.rows = 20; }
	}

	initialize() {
		const { query } = this.state;
		const { pageStrategy } = query;
		const payload = {type: "SET_QUERY_FIELDS",
			...query, start: pageStrategy === "paginate" ? 0 : null
		};

		this.sendQuery(queryReducer(this.state.query, payload));

		return this;
	}

	sendQuery(query = this.state.query) {
		this.state.query = query;
		submitQuery(query, (action) => {
			this.state.results = resultReducer(this.state.results, action);
			this.onChange(this.state, this.getHandlers());
		});
	}

	setCurrentPage(page) {
		const { query } = this.state;
		const { rows } = query;
		const payload = {type: "SET_START", newStart: page * rows};

		this.sendQuery(queryReducer(this.state.query, payload));

	}

	setSearchFieldValue(field, value) {
		const { query } = this.state;
		const { searchFields } = query;
		const newFields = searchFields
			.map((searchField) => searchField.field === field ? {...searchField, value: value} : searchField);

		const payload = {type: "SET_SEARCH_FIELDS", newFields: newFields};

		this.sendQuery(queryReducer(this.state.query, payload));
	}

	setSortFieldValue(field, value) {
		const { query } = this.state;
		const { sortFields } = query;
		const newSortFields = sortFields
			.map((sortField) => sortField.field === field ? {...sortField, value: value} : {...sortField, value: null});

		const payload = {type: "SET_SORT_FIELDS", newSortFields: newSortFields};
		this.sendQuery(queryReducer(this.state.query, payload));
	}

	getHandlers() {
		return {
			onSortFieldChange: this.setSortFieldValue.bind(this),
			onSearchFieldChange: this.setSearchFieldValue.bind(this),
			onPageChange: this.setCurrentPage.bind(this)
		};
	}
}

export {
	SolrClient
};