import expect from "expect";

import resultsReducer from "../../src/reducers/results";

describe("resultsReducer", () => { //eslint-disable-line no-undef

	it("should SET_RESULTS", () => { //eslint-disable-line no-undef
		expect(resultsReducer({
			init: "bar",
			pending: true
		}, {
			type: "SET_RESULTS",
			data: {
				response: {
					docs: ["123"],
					numFound: 123
				},
				"facet_counts": {
					"facet_fields": ["123"]
				}
			}
		})).toEqual({
			init: "bar",
			docs: ["123"],
			numFound: 123,
			facets: ["123"],
			pending: false
		});
	});

	it("should SET_RESULTS_PENDING", () => { //eslint-disable-line no-undef
		expect(resultsReducer({
			init: "bar",
			pending: false
		}, {
			type: "SET_RESULTS_PENDING"
		})).toEqual({
			init: "bar",
			pending: true
		});
	});

	it("should append new docs to the results in stead of replacing them on SET_NEXT_RESULTS", () => { //eslint-disable-line no-undef
		expect(resultsReducer({
			init: "bar",
			pending: true,
			docs: ["abc"]
		}, {
			type: "SET_NEXT_RESULTS",
			data: {
				response: {
					docs: ["123"],
					numFound: 123
				},
				"facet_counts": {
					"facet_fields": ["123"]
				}
			}
		})).toEqual({
			init: "bar",
			docs: ["abc", "123"],
			pending: false
		});
	});

});