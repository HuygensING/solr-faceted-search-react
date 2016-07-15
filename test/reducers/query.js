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

	it("should SET_SEARCH_FIELDS", () => {  //eslint-disable-line no-undef
		expect(queryReducer({
			initial: "x",
			pageStrategy: "paginate"
		},
		{
			type: "SET_SEARCH_FIELDS",
			newFields: "y"
		})).toEqual({
			initial: "x",
			searchFields: "y",
			start: 0,
			pageStrategy: "paginate"
		});

		expect(queryReducer({
			initial: "x",
			pageStrategy: "anyother"
		},
		{
			type: "SET_SEARCH_FIELDS",
			newFields: "y"
		})).toEqual({
			initial: "x",
			searchFields: "y",
			start: null,
			pageStrategy: "anyother"
		});
	});



	it("should SET_SORT_FIELDS", () => {  //eslint-disable-line no-undef
		expect(queryReducer({
			initial: "x",
			pageStrategy: "paginate"
		}, {
			type: "SET_SORT_FIELDS",
			newSortFields: "y"
		})).toEqual({
			initial: "x",
			sortFields: "y",
			start: 0,
			pageStrategy: "paginate"
		});

		expect(queryReducer({
			initial: "x",
			pageStrategy: "anyother"
		}, {
			type: "SET_SORT_FIELDS",
			newSortFields: "y"
		})).toEqual({
			initial: "x",
			sortFields: "y",
			start: null,
			pageStrategy: "anyother"
		});

	});

	it("should SET_START", () => {  //eslint-disable-line no-undef
		expect(queryReducer({
			initial: "x",
			start: 100
		}, {
			type: "SET_START",
			newStart: 10
		})).toEqual({
			initial: "x",
			start: 10
		});
	});

	it("should SET_FILTERS", () => {  //eslint-disable-line no-undef
		expect(queryReducer({
			initial: "x"
		}, {
			type: "SET_FILTERS",
			newFilters: [{x: "y"}]
		})).toEqual({
			initial: "x",
			filters: [{x: "y"}],
			start: null
		});
	});

	it("should set the cursorMark on SET_RESULTS if present", () => {  //eslint-disable-line no-undef
		expect(queryReducer({
			initial: "x"
		}, {
			type: "SET_RESULTS",
			data: { nextCursorMark: "confirm-cursor-mark" }
		})).toEqual({
			initial: "x",
			cursorMark: "confirm-cursor-mark"
		});

				expect(queryReducer({
			initial: "x"
		}, {
			type: "SET_RESULTS",
			data: { }
		})).toEqual({
			initial: "x"
		});
	});
});