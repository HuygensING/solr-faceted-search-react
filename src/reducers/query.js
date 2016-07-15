const initialState = {
	searchFields: [],
	sortFields: [],
	rows: 0,
	url: null,
	pageStrategy: null,
	start: null
};

const setQueryFields = (state, action) => {
	return {
		...state,
		searchFields: action.searchFields,
		sortFields: action.sortFields,
		url: action.url,
		rows: action.rows,
		pageStrategy: action.pageStrategy,
		start: action.start
	};
};

export default function(state=initialState, action) {
	switch (action.type) {
		case "SET_QUERY_FIELDS":
			return setQueryFields(state, action);
		case "SET_SEARCH_FIELDS":
			return {...state, searchFields: action.newFields, start: state.pageStrategy === "paginate" ? 0 : null};
		case "SET_SORT_FIELDS":
			return {...state, sortFields: action.newSortFields, start: state.pageStrategy === "paginate" ? 0 : null};
		case "SET_FILTERS":
			return {...state, filters: action.newFilters, start: state.pageStrategy === "paginate" ? 0 : null};
		case "SET_START":
			return {...state, start: action.newStart};
		case "SET_RESULTS":
			return action.data.nextCursorMark ? {...state, cursorMark: action.data.nextCursorMark } : state;
	}

	return state;
}