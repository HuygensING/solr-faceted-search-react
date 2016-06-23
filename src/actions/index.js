import store from "../reducers/store";
import server from "./server";
import solrQuery from "./solr-query";

const submitQuery = (query, dispatch) => {
	dispatch({type: "SET_RESULTS_PENDING"});

	server.performXhr({
		url: solrQuery(query)
	}, (err, resp) => {
		if (resp.statusCode >= 200 && resp.statusCode < 300) {
			dispatch({type: "SET_RESULTS", data: JSON.parse(resp.body)});
		} else {
			console.log("Server error: ", resp.statusCode);
		}
	});
};

const initializeQuery = (url, searchFields, sortFields, rows, pageStrategy) => (dispatch) => {
	const query = {
		url: url,
		searchFields: searchFields,
		sortFields: sortFields,
		rows: rows,
		pageStrategy: pageStrategy,
		start: pageStrategy === "paginate" ? 0 : null
	};

	dispatch({type: "SET_QUERY_FIELDS", ...query});

	submitQuery(query, dispatch);
};


const updateSearchField = (field, value) => (dispatch, getState) => {
	const { query } = getState();
	const { searchFields, pageStrategy } = query;
	const newFields = searchFields
		.map((searchField) => searchField.field === field ? {...searchField, value: value} : searchField);

	dispatch({type: "SET_SEARCH_FIELDS", newFields: newFields});

	submitQuery({...query, searchFields: newFields, start: pageStrategy === "paginate" ? 0 : null}, dispatch);
};

const updateSortField = (field, value) => (dispatch, getState) => {
	const { query } = getState();
	const { sortFields, pageStrategy } = query;
	const newSortFields = sortFields
		.map((sortField) => sortField.field === field ? {...sortField, value: value} : {...sortField, value: null});

	dispatch({type: "SET_SORT_FIELDS", newSortFields: newSortFields});

	submitQuery({...query, sortFields: newSortFields, start: pageStrategy === "paginate" ? 0 : null}, dispatch);
};

const updateStart = (page) => (dispatch, getState) => {
	const { query } = getState();
	const { rows } = query;

	dispatch({type: "SET_START", newStart: page * rows});

	submitQuery({...query, start: page * rows}, dispatch);

};

export default {
	onInit: (url, fields, sortFields, rows, pageStrategy) => store.dispatch(initializeQuery(url, fields, sortFields, rows, pageStrategy)),

	onSearchFieldChange: (field, value) => store.dispatch(updateSearchField(field, value)),

	onSortFieldChange: (field, value) => store.dispatch(updateSortField(field, value)),

	onPageChange: (page) => store.dispatch(updateStart(page))
};