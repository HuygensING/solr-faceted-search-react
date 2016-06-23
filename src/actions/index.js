import store from "../reducers/store";
import server from "./server";
import solrQuery from "./solr-query";

const submitQuery = (queries, dispatch) => {
	const { url, sortFields, searchFields, rows } = queries;
	console.log("sortFields: ", sortFields);
	console.log("searchFields: ", searchFields);
	dispatch({type: "SET_RESULTS_PENDING"});

	server.performXhr({
		url: solrQuery(url, searchFields, sortFields, rows)
	}, (err, resp) => {
		if (resp.statusCode >= 200 && resp.statusCode < 300) {
			dispatch({type: "SET_RESULTS", data: JSON.parse(resp.body)});
		} else {
			console.warn("Server error: ", resp.statusCode);
		}
	});
};

const initializeQuery = (url, searchFields, sortFields, rows) => (dispatch) => {
	const query = {url: url, searchFields: searchFields, sortFields: sortFields, rows: rows};
	dispatch({type: "SET_QUERY_FIELDS", ...query});

	submitQuery(query, dispatch);
};


const updateSearchField = (field, value) => (dispatch, getState) => {
	const { queries } = getState();
	const { searchFields } = queries;
	const newFields = searchFields
		.map((searchField) => searchField.field === field ? {...searchField, value: value} : searchField);

	dispatch({type: "SET_SEARCH_FIELDS", newFields: newFields});

	submitQuery({...queries, searchFields: newFields}, dispatch);
};

const updateSortField = (field, value) => (dispatch, getState) => {
	const { queries } = getState();
	const { sortFields } = queries;
	const newSortFields = sortFields
		.map((sortField) => sortField.field === field ? {...sortField, value: value} : {...sortField, value: null});

	dispatch({type: "SET_SORT_FIELDS", newSortFields: newSortFields});

	submitQuery({...queries, sortFields: newSortFields}, dispatch);
};

export default {
	onInit: (url, fields, sortFields, rows) => store.dispatch(initializeQuery(url, fields, sortFields, rows)),

	onFieldChange: (field, value, isSortField = false) => isSortField ?
		store.dispatch(updateSortField(field, value)) :
		store.dispatch(updateSearchField(field, value))

};