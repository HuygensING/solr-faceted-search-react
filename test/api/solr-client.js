import expect from "expect";
import sinon from "sinon";
import { SolrClient } from "../../src/api/solr-client";

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
			let calls = 0;
			sinon.stub(underTest, "sendQuery", (queryState) => {
				if (++calls === 2) {
					underTest.sendQuery.restore();
					try {
						expect(queryState.start).toEqual(setPage * DEFAULT_ROWS);
						done();
					} catch (e) {
						done(e);
					}
				}
			});

			underTest.initialize().setCurrentPage(setPage);
		});
	});

	describe("setSearchFieldValue", () => { //eslint-disable-line no-undef
/*	setSearchFieldValue(field, value) {
		const { query } = this.state;
		const { searchFields } = query;
		const newFields = searchFields
			.map((searchField) => searchField.field === field ? {...searchField, value: value} : searchField);

		const payload = {type: "SET_SEARCH_FIELDS", newFields: newFields};

		this.sendQuery(queryReducer(this.state.query, payload));
	}
*/
	});

	describe("setSortFieldValue", () => { //eslint-disable-line no-undef
/*	setSortFieldValue(field, value) {
		const { query } = this.state;
		const { sortFields } = query;
		const newSortFields = sortFields
			.map((sortField) => sortField.field === field ? {...sortField, value: value} : {...sortField, value: null});

		const payload = {type: "SET_SORT_FIELDS", newSortFields: newSortFields};
		this.sendQuery(queryReducer(this.state.query, payload));
	}
*/
	});


	describe("sendQuery", () => { //eslint-disable-line no-undef
/*	sendQuery(query = this.state.query) {
		this.state.query = query;
		submitQuery(query, (action) => {
			this.state.results = resultReducer(this.state.results, action);
			this.onChange(this.state, this.getHandlers());
		});
	}
*/
	});


	describe("getHandlers", () => { //eslint-disable-line no-undef
/*	getHandlers() {
		return {
			onSortFieldChange: this.setSortFieldValue.bind(this),
			onSearchFieldChange: this.setSearchFieldValue.bind(this),
			onPageChange: this.setCurrentPage.bind(this)
		};
	}
*/
	});
});
