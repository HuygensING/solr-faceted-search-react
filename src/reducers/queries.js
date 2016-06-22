const initialState = {
	searchFields: [],
	url: null
};


export default function(state=initialState, action) {
	switch (action.type) {
		case "SET_QUERY_FIELDS":
			return {...state, searchFields: action.searchFields, url: action.url};
		case "SET_FIELD_VALUES":
			return {...state, searchFields: action.newFields};
	}

	return state;
}