import expect from "expect";
import sinon from "sinon";
import { SolrClient } from "../../src/api/solr-client";
import server from "../../src/api/server";

const DEFAULT_ROWS = 20;

describe("SolrClient", () => { //eslint-disable-line no-undef

	describe("constructor", () => { //eslint-disable-line no-undef
		it("should prepare query and result state with initial values", () => { //eslint-disable-line no-undef
			const changeFunc = () => "confirm-changeFunc";

			const underTest = new SolrClient({
				onChange: changeFunc,
				queryProp1: "queryProp1",
				queryProp2: "queryProp2"
			});

			expect(underTest.onChange()).toEqual("confirm-changeFunc");

			expect(underTest.state.query).toEqual({
				queryProp1: "queryProp1",
				queryProp2: "queryProp2",
				pageStrategy: "paginate",
				rows: DEFAULT_ROWS
			});

			expect(underTest.state.results).toEqual({
				facets: [],
				docs: [],
				numFound: 0
			});
		});

		it("should throw an error when pageStrategy 'cursor' is requested without an idField", () => { //eslint-disable-line no-undef
			expect(() => new SolrClient({ onChange: () => { }, pageStrategy: "cursor" }))
			.toThrow(/idField/);
		});
	});


	describe("initialize", () => { //eslint-disable-line no-undef
		it("should send an initial query using sendQuery", (done) => { //eslint-disable-line no-undef
			const underTest = new SolrClient({
				onChange: () => {},
				searchFields: "searchFields",
				sortFields: "sortFields",
				url: "url"
			});

			sinon.stub(underTest, "sendQuery", (queryState) => {
				underTest.sendQuery.restore();
				try {
					expect(queryState).toEqual({
						start: 0,
						pageStrategy: "paginate",
						searchFields: "searchFields",
						sortFields: "sortFields",
						url: "url",
						rows: DEFAULT_ROWS
					});
					done();
				} catch(e) {
					done(e);
				}
			});

			underTest.initialize();
		});

	});


	describe("setCurrentPage", () => { // eslint-disable-line no-undef
		it("should update the start parameters according to page and rows and sendQuery", (done) => { // eslint-disable-line no-undef
			const underTest = new SolrClient({
				onChange: () => {},
				searchFields: "searchFields",
				sortFields: "sortFields",
				url: "url"
			});
			const setPage = 5;
			sinon.stub(underTest, "sendQuery", (queryState) => {
				underTest.sendQuery.restore();
				try {
					expect(queryState.start).toEqual(setPage * DEFAULT_ROWS);
					done();
				} catch (e) {
					done(e);
				}
			});

			underTest.setCurrentPage(setPage);
		});
	});

	describe("setFilters", () => { // eslint-disable-line no-undef
		it("should set the filters", (done) => { // eslint-disable-line no-undef
			const underTest = new SolrClient({
				onChange: () => {},
				searchFields: "searchFields",
				sortFields: "sortFields",
				url: "url"
			});
			const filters = [{a: "b"}];
			sinon.stub(underTest, "sendQuery", (queryState) => {
				underTest.sendQuery.restore();
				try {
					expect(queryState.filters).toEqual([{a: "b"}]);
					done();
				} catch (e) {
					done(e);
				}
			});

			underTest.setFilters(filters);
		});
	});


	describe("setSearchFieldValue", () => { //eslint-disable-line no-undef
		it("should update the filter value for the given searchField key", (done) => { //eslint-disable-line no-undef
			const underTest = new SolrClient({
				onChange: () => {},
				searchFields: [{
					field: "searchField",
					value: "initial-value"
				}, {
					field: "otherField",
					value: "original-value"
				}],
				url: "url"
			});
			const newValue = "new value";

			sinon.stub(underTest, "sendQuery", (queryState) => {
				underTest.sendQuery.restore();
				try {
					expect(queryState.searchFields).toEqual([{
						field: "searchField",
						value: newValue
					}, {
						field: "otherField",
						value: "original-value"
					}]);
					done();
				} catch (e) {
					done(e);
				}
			});

			underTest.setSearchFieldValue("searchField", newValue);
		});
	});

	describe("setFacetSort", () => { //eslint-disable-line no-undef
		it("should update the facet.field_name.sort parameter", (done) => { //eslint-disable-line no-undef
			const underTest = new SolrClient({
				onChange: () => {},
				searchFields: [{
					field: "searchField",
					value: "initial-value"
				}, {
					field: "otherField",
					value: "original-value"
				}],
				url: "url"
			});

			sinon.stub(underTest, "sendQuery", (queryState) => {
				underTest.sendQuery.restore();
				try {
					expect(queryState.searchFields).toEqual([{
						field: "searchField",
						value: "initial-value",
						facetSort: "index"
					}, {
						field: "otherField",
						value: "original-value"
					}]);
					done();
				} catch (e) {
					done(e);
				}
			});

			underTest.setFacetSort("searchField", "index");
		});
	});

	describe("setSortFieldValue", () => { //eslint-disable-line no-undef
		it("should update the sort value for the given sortField key and clear the others", (done) => { //eslint-disable-line no-undef
			const underTest = new SolrClient({
				onChange: () => {},
				sortFields: [{
					field: "sortField"
				}, {
					field: "otherSort",
					value: "asc"
				}],
				url: "url"
			});
			const newValue = "desc";

			sinon.stub(underTest, "sendQuery", (queryState) => {
				underTest.sendQuery.restore();
				try {
					expect(queryState.sortFields).toEqual([{
						field: "sortField",
						value: newValue
					}, {
						field: "otherSort",
						value: null
					}]);
					done();
				} catch (e) {
					done(e);
				}
			});

			underTest.setSortFieldValue("sortField", newValue);
		});
	});


	describe("sendNextCursorQuery", () => { //eslint-disable-line no-undef
		it("should append new docs to the results in stead of replacing them", (done) => { //eslint-disable-line no-undef

			const finalize = (e) => {
				server.submitQuery.restore();
				done(e);
			};

			sinon.stub(server, "submitQuery", (query, cb) => {
				try {
					cb({
						type: "SET_RESULTS",
						data: {
							response: { docs: ["abc"] },
							"facet_counts": { }
						}
					});
				} catch (e) {
					finalize(e);
				}
			});

			const underTest = new SolrClient({
				onChange: (newState) => {
					const { results } = newState;
					try {
						expect(results.docs).toEqual(["123", "abc"]);
						finalize();
					} catch (e) {
						finalize(e);
					}
				}
			});
			underTest.state.results = {
				docs: ["123"]
			};

			underTest.sendNextCursorQuery();
		});
	});

	describe("sendQuery", () => { //eslint-disable-line no-undef
		it("should send the query with submitQuery and pass the new state to the onChange callback", (done) => { //eslint-disable-line no-undef
			const finalize = (e) => {
				server.submitQuery.restore();
				done(e);
			};

			sinon.stub(server, "submitQuery", (query, cb) => {
				try {
					expect(query).toEqual("confirm-query-passed");
					cb({
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
					});
				} catch (e) {
					finalize(e);
				}
			});

			const underTest = new SolrClient({
				onChange: (newState) => {
					const { query, results } = newState;
					try {
						expect(query).toEqual("confirm-query-passed");
						expect(results).toEqual({
							docs: ["123"],
							numFound: 123,
							facets: ["123"],
							pending: false
						});
						finalize();
					} catch (e) {
						finalize(e);
					}
				}
			});

			underTest.sendQuery("confirm-query-passed");
		});

		it("should set the cursorMark in query state from the  nextCursorMark in the results", (done) => { //eslint-disable-line no-undef
			const finalize = (e) => {
				server.submitQuery.restore();
				done(e);
			};

			sinon.stub(server, "submitQuery", (query, cb) => {
				try {
					cb({
						type: "SET_RESULTS",
						data: {
							response: { },
							"facet_counts": { },
							nextCursorMark: "confirm-cursor-mark"
						}
					});
				} catch (e) {
					finalize(e);
				}
			});

			const underTest = new SolrClient({
				pageStrategy: "cursor",
				rows: DEFAULT_ROWS,
				idField: "id",
				onChange: (newState) => {
					const { query } = newState;
					try {
						expect(query.cursorMark).toEqual("confirm-cursor-mark");
						finalize();
					} catch (e) {
						finalize(e);
					}
				}
			});

			underTest.sendQuery();
		});


		it("should send the query from state when no param is passed", (done) => { //eslint-disable-line no-undef
			const finalize = (e) => {
				server.submitQuery.restore();
				done(e);
			};

			sinon.stub(server, "submitQuery", (query, cb) => {
				try {
					expect(query).toEqual({
						searchFields: "searchFields",
						pageStrategy: "paginate",
						rows: 20
					});

					cb({});
				} catch (e) {
					finalize(e);
				}
			});

			const underTest = new SolrClient({
				searchFields: "searchFields",
				onChange: (newState) => {
					const { query } = newState;
					try {
						expect(query).toEqual({
							searchFields: "searchFields",
							pageStrategy: "paginate",
							rows: 20
						});
						finalize();
					} catch (e) {
						finalize(e);
					}
				}
			});

			underTest.sendQuery();
		});

		it("should pass the handlers from getHandlers to the onChange callback", (done) => { //eslint-disable-line no-undef
			const finalize = (e) => {
				server.submitQuery.restore();
				done(e);
			};

			sinon.stub(server, "submitQuery", (query, cb) => {
				cb({});
			});

			const underTest = new SolrClient({
				onChange: (newState, handlers) => {
					try {
						const { onPageChange, onSortFieldChange, onSearchFieldChange, onFacetSortChange, onNextCursorQuery } = handlers;
						expect(onPageChange()).toEqual("confirm-current-page-handler");
						expect(onSortFieldChange()).toEqual("confirm-sortfield-handler");
						expect(onSearchFieldChange()).toEqual("confirm-searchfield-handler");
						expect(onFacetSortChange()).toEqual("confirm-facet-sort-handler");
						expect(onNextCursorQuery()).toEqual("confirm-next-cursor-query-handler");
						finalize();
					} catch (e) {
						finalize(e);
					}
				}
			});

			underTest.setSortFieldValue = () => "confirm-sortfield-handler";
			underTest.setSearchFieldValue = () => "confirm-searchfield-handler";
			underTest.setCurrentPage = () => "confirm-current-page-handler";
			underTest.setFacetSort = () => "confirm-facet-sort-handler";
			underTest.sendNextCursorQuery = () => "confirm-next-cursor-query-handler";
			underTest.sendQuery();
		});
	});


	describe("getHandlers", () => { //eslint-disable-line no-undef
		it("should return the handlers", () => { //eslint-disable-line no-undef
			const underTest = new SolrClient({ onChange: () => {} });
			underTest.setSortFieldValue = () => "confirm-sortfield-handler";
			underTest.setSearchFieldValue = () => "confirm-searchfield-handler";
			underTest.setCurrentPage = () => "confirm-current-page-handler";
			underTest.setFacetSort = () => "confirm-facet-sort-handler";
			underTest.sendNextCursorQuery = () => "confirm-next-cursor-query-handler";


			const { onPageChange, onSortFieldChange, onSearchFieldChange, onFacetSortChange, onNextCursorQuery } = underTest.getHandlers();

			expect(onPageChange()).toEqual("confirm-current-page-handler");
			expect(onSortFieldChange()).toEqual("confirm-sortfield-handler");
			expect(onSearchFieldChange()).toEqual("confirm-searchfield-handler");
			expect(onFacetSortChange()).toEqual("confirm-facet-sort-handler");
			expect(onNextCursorQuery()).toEqual("confirm-next-cursor-query-handler");

		});
	});
});
