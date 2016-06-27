const initialState = {
	facets: {},
	docs: [],
	numFound: 0,
	pending: false
};


export default function(state=initialState, action) {
	switch (action.type) {
		case "SET_RESULTS":
			return {
				...state,
				docs: action.data.response.docs,
				numFound: action.data.response.numFound,
				facets: action.data.facet_counts.facet_fields,
				pending: false
			};

		case "SET_NEXT_RESULTS":
			return {
				...state,
				docs: state.docs.concat(action.data.response.docs),
				pending: false
			};

		case "SET_RESULTS_PENDING":
			return {
				...state, pending: true
			};
	}

	return state;
}