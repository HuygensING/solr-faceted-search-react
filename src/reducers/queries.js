const initialState = {
	searchFields: [],
	sortFields: [],
	url: null
};


export default function(state=initialState, action) {
	switch (action.type) {
		case "SET_QUERY_FIELDS":
			return {...state, searchFields: action.searchFields, sortFields: action.sortFields, url: action.url};
		case "SET_FIELD_VALUES":
			return {...state, searchFields: action.newFields, sortFields: action.newSortFields};
	}

	return state;
}