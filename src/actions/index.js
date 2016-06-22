import store from "../reducers/store";
import server from "./server";
import solrQuery from "./solr-query";

const initializeQuery = (url, searchFields, sortFields, rows) => (dispatch) => {
	dispatch({type: "SET_QUERY_FIELDS", url: url, searchFields: searchFields, sortFields: sortFields, rows: rows});


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

const submitQuery = (field, value, isSortField) => (dispatch, getState) => {
	const { queries } = getState();
	const { sortFields, searchFields, url, rows } = queries;
	const newFields = !isSortField ?
		searchFields.map((searchField) => searchField.field === field ? {...searchField, value: value} : searchField) : searchFields;

	const newSortFields = isSortField ?
		sortFields.map((sortField) => sortField.field === field ? {...sortField, value: value} : {...sortField, value: null}) : sortFields;

	server.performXhr({
		url: solrQuery(url, newFields, newSortFields, rows)
	}, (err, resp) => {
		if (resp.statusCode >= 200 && resp.statusCode < 300) {
			dispatch({type: "SET_RESULTS", data: JSON.parse(resp.body)});
			dispatch({type: "SET_FIELD_VALUES", newFields: newFields, newSortFields: newSortFields});
		} else {
			console.warn("Server error: ", resp.statusCode);
		}
	});
};

export default {
	onInit: (url, fields, sortFields, rows) => store.dispatch(initializeQuery(url, fields, sortFields, rows)),

	onFieldChange: (field, value, isSortField = false) => store.dispatch(submitQuery(field, value, isSortField))

};