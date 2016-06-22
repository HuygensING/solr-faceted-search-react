import store from "../reducers/store";
import server from "./server";
import solrQuery from "./solr-query";

const initializeQuery = (url, searchFields) => (dispatch) => {
	dispatch({type: "SET_QUERY_FIELDS", url: url, searchFields: searchFields});


	server.performXhr({
		url: solrQuery(url, searchFields)
	}, (err, resp) => {
		if (resp.statusCode >= 200 && resp.statusCode < 300) {
			dispatch({type: "SET_RESULTS", data: JSON.parse(resp.body)});
		} else {
			console.warn("Server error: ", resp.statusCode);
		}
	});
};

const submitQuery = (field, value) => (dispatch, getState) => {
	const { queries } = getState();
	const { searchFields, url } = queries;
	const newFields = searchFields.map((searchField) => searchField.field === field ? {...searchField, value: value} : searchField);

	server.performXhr({
		url: solrQuery(url, newFields)
	}, (err, resp) => {
		if (resp.statusCode >= 200 && resp.statusCode < 300) {
			dispatch({type: "SET_RESULTS", data: JSON.parse(resp.body)});
			dispatch({type: "SET_FIELD_VALUES", newFields: newFields});
		} else {
			console.warn("Server error: ", resp.statusCode);
		}
	});
};

export default {
	onInit: (url, fields) => store.dispatch(initializeQuery(url, fields)),

	onFieldChange: (field, value) => store.dispatch(submitQuery(field, value))
};