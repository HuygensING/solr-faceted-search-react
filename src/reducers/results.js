const initialState = {
	facets: {},
	docs: [],
	numFound: 0
};


export default function(state=initialState, action) {
	switch (action.type) {
		case "SET_RESULTS":
			return {
				...state,
				docs: action.data.response.docs,
				numFound: action.data.response.numFound,
				facets: action.data.facet_counts.facet_fields
			};
	}

	return state;
}