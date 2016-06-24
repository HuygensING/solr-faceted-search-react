import expect from "expect";

import queryReducer from "../../src/reducers/query";

describe("queryReducer", () => { //eslint-disable-line no-undef

	it("should SET_QUERY_FIELDS", () => {  //eslint-disable-line no-undef
		expect(queryReducer({
			init: "bar"
		}, {
			type: "SET_QUERY_FIELDS",
			searchFields: ["x"],
			sortFields: ["y"],
			url: "z",
			rows: 10,
			pageStrategy: "paginate",
			start: 0
		})).toEqual({
			init: "bar",
			searchFields: ["x"],
			sortFields: ["y"],
			url: "z",
			rows: 10,
			pageStrategy: "paginate",
			start: 0
		});
	});

	it("should SET_SEARCH_FIELDS");  //eslint-disable-line no-undef

	it("should SET_SORT_FIELDS");  //eslint-disable-line no-undef

	it("should SET_START");  //eslint-disable-line no-undef

});