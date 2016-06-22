import store from "../reducers/store";
import server from "./server";
import solrQuery from "./solr-query";

const initializeQuery = (url, searchFields, sortFields) => (dispatch) => {
	dispatch({type: "SET_QUERY_FIELDS", url: url, searchFields: searchFields, sortFields: sortFields});


	server.performXhr({
		url: solrQuery(url, searchFields, sortFields)
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
	const { sortFields, searchFields, url } = queries;
	const newFields = !isSortField ?
		searchFields.map((searchField) => searchField.field === field ? {...searchField, value: value} : searchField) : searchFields;

	const newSortFields = isSortField ?
		sortFields.map((sortField) => sortField.field === field ? {...sortField, value: value} : sortField) : sortFields;

	server.performXhr({
		url: solrQuery(url, newFields)
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
	onInit: (url, fields, sortFields) => store.dispatch(initializeQuery(url, fields, sortFields)),

	onFieldChange: (field, value, isSortField = false) => store.dispatch(submitQuery(field, value, isSortField))

};