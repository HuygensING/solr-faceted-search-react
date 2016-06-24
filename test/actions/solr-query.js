import expect from "expect";

import {
	rangeFacetToQueryFilter,
	listFacetFieldToQueryFilter,
	textFieldToQueryFilter,
	fieldToQueryFilter,
	buildQuery,
	facetFields,
	buildSort,
	solrQuery
} from "../../src/actions/solr-query";

describe("solr-query", () => { //eslint-disable-line no-undef

	describe("rangeFacetToQueryFilter", () => { //eslint-disable-line no-undef
		it("should return an empty string when field.value is null or empty", () => { //eslint-disable-line no-undef
			expect(rangeFacetToQueryFilter({
				field: "field_name",
				value: null
			})).toEqual(null);

			expect(rangeFacetToQueryFilter({
				field: "field_name",
				value: []
			})).toEqual(null);
		});

		it("should generate a solr range query from a valid range-facet searchField", () => { //eslint-disable-line no-undef
			expect(rangeFacetToQueryFilter({
				field: "field_name",
				value: [123, 456]
			})).toEqual("(field_name:[123 TO 456])");
		});
	});

	describe("listFacetFieldToQueryFilter", () => { //eslint-disable-line no-undef
		it("should return an empty string when field.value is null or empty", () => { //eslint-disable-line no-undef
			expect(listFacetFieldToQueryFilter({
				field: "field_name",
				value: null
			})).toEqual(null);

			expect(listFacetFieldToQueryFilter({
				field: "field_name",
				value: []
			})).toEqual(null);
		});

		it("should generate a solr filter query from a valid list-facet searchField", () => { //eslint-disable-line no-undef
			expect(listFacetFieldToQueryFilter({
				field: "field_name",
				value: ["val"]
			})).toEqual("field_name:(\"val\")");
		});

		it("should join filters with OR", () => { //eslint-disable-line no-undef
			expect(listFacetFieldToQueryFilter({
				field: "field_name",
				value: ["val", "val2"]
			})).toEqual("field_name:(\"val\" OR \"val2\")");
		});
	});

	describe("textFieldToQueryFilter", () => { //eslint-disable-line no-undef
		it("should filter on the default field when the .field prop is '*'", () => { //eslint-disable-line no-undef
			expect(textFieldToQueryFilter({
				field: "*",
				value: "val"
			})).toEqual("val");
		});

		it("should filter on the .field prop", () => { //eslint-disable-line no-undef
			expect(textFieldToQueryFilter({
				field: "field_name",
				value: "val"
			})).toEqual("field_name:val");
		});

		it("should set the filter value to '*' when field.value is null or empty", () => { //eslint-disable-line no-undef
			expect(textFieldToQueryFilter({
				field: "field_name",
				value: null
			})).toEqual("field_name:*");

			expect(textFieldToQueryFilter({
				field: "*",
				value: null
			})).toEqual("*");

			expect(textFieldToQueryFilter({
				field: "field_name",
				value: ""
			})).toEqual("field_name:*");

			expect(textFieldToQueryFilter({
				field: "*",
				value: ""
			})).toEqual("*");

		});
	});

	describe("fieldToQueryFilter", () => { //eslint-disable-line no-undef
		it("should return null when the field.type is not supported", () => { //eslint-disable-line no-undef
			expect(fieldToQueryFilter({
				type: "this-will-never-be-supported",
				value: [10, 30],
				field: "field_name"
			})).toEqual(null);
		});

		it("should return a range filter when the field.type is 'range-facet'", () => { //eslint-disable-line no-undef
			expect(fieldToQueryFilter({
				type: "range-facet",
				value: [10, 30],
				field: "field_name"
			})).toEqual("(field_name:[10 TO 30])");
		});

		it("should return a list filter when the field.type is 'list-facet'", () => { //eslint-disable-line no-undef
			expect(fieldToQueryFilter({
				type: "list-facet",
				value: [10, 30],
				field: "field_name"
			})).toEqual("field_name:(\"10\" OR \"30\")");
		});

		it("should return a text filter when the field.type is 'text'", () => { //eslint-disable-line no-undef
			expect(fieldToQueryFilter({
				type: "text",
				value: "val",
				field: "field_name"
			})).toEqual("field_name:val");
		});
	});

	describe("buildQuery", () => { //eslint-disable-line no-undef
		it("should create filters for the supported field types", () => {  //eslint-disable-line no-undef
			expect(buildQuery([{
				type: "text",
				value: "val",
				field: "field_name"
			}])).toEqual("field_name:val");


			expect(buildQuery([{
				type: "list-facet",
				value: [10, 30],
				field: "field_name"
			}])).toEqual("field_name:(\"10\" OR \"30\")");

			expect(buildQuery([{
				type: "range-facet",
				value: [10, 30],
				field: "field_name"
			}])).toEqual("(field_name:[10 TO 30])");
		});

		it("should ignore unsupported field types", () => {  //eslint-disable-line no-undef
			expect(buildQuery([{
				type: "this-will-never-be-supported",
				value: [10, 30],
				field: "field_name"
			}])).toEqual("");
		});


		it("should ignore facet fields where field.value is null or empty", () => { //eslint-disable-line no-undef
			expect(buildQuery([{
				type: "range-facet",
				field: "field_name"
			}, {
				type: "range-facet",
				field: "field_name",
				value: null
			}, {
				type: "range-facet",
				field: "field_name",
				value: []
			}, {
				type: "list-facet",
				field: "field_name"
			}, {
				type: "list-facet",
				field: "field_name",
				value: null
			}, {
				type: "list-facet",
				field: "field_name",
				value: []
			}])).toEqual("");

		});

		it("should join query parts with AND", () => {  //eslint-disable-line no-undef
			const query = buildQuery([{
				type: "text",
				value: "val",
				field: "field_name"
			}, {
				type: "list-facet",
				value: [10, 30],
				field: "field_name"
			}, {
				type: "range-facet",
				value: [10, 30],
				field: "field_name"
			}]);

			const parts = query.split(" AND ");

			expect(parts.length).toEqual(3);
			expect(parts.indexOf("(field_name:[10 TO 30])") > -1).toEqual(true);
			expect(parts.indexOf("field_name:(\"10\" OR \"30\")") > -1).toEqual(true);
			expect(parts.indexOf("field_name:val") > -1).toEqual(true);
		});
	});

	describe("facetFields", () => {  //eslint-disable-line no-undef
		it("should pass along all the facet field names to facet.field=field_name", () => {  //eslint-disable-line no-undef
			const facetParam = facetFields([{
				type: "text",
				value: "val",
				field: "text_field"
			}, {
				type: "list-facet",
				value: [10, 30],
				field: "list_field"
			}, {
				type: "range-facet",
				value: [10, 30],
				field: "range_field"
			}]);
			expect(facetParam.indexOf("facet.field=text_field")).toEqual(-1);
			expect(facetParam.indexOf("facet.field=list_field") > -1).toEqual(true);
			expect(facetParam.indexOf("facet.field=range_field") > -1).toEqual(true);

		});

		it("should join the facet.field params with ampersand", () => {  //eslint-disable-line no-undef
			const facetParam = facetFields([{
				type: "list-facet",
				value: [10, 30],
				field: "list_field"
			}, {
				type: "range-facet",
				value: [10, 30],
				field: "range_field"
			}]);

			const parts = facetParam.split("&");
			expect(parts.indexOf("facet.field=list_field") > -1).toEqual(true);
			expect(parts.indexOf("facet.field=range_field") > -1).toEqual(true);
		});
	});

	describe("buildSort", () => {  //eslint-disable-line no-undef
		it("should ignore fields where field.value is null or empty", () => { //eslint-disable-line no-undef
			expect(buildSort([{
				field: "field_name",
				value: null
			}])).toEqual("");

			expect(buildSort([{
				field: "field_name",
				value: ""
			}])).toEqual("");

			expect(buildSort([{
				field: "field_name"
			}])).toEqual("");
		});

		it("should map fields to 'field.field field.value'", () => { //eslint-disable-line no-undef
			expect(buildSort([{
				field: "field_name",
				value: "asc"
			}])).toEqual("field_name asc");
		});

		it("should join the mapped fields with a comma", () => { //eslint-disable-line no-undef
			expect(buildSort([{
				field: "field_name",
				value: "asc"
			}, {
				field: "other_field_name",
				value: "desc"
			}])).toEqual("field_name asc,other_field_name desc");
		});
	});

	describe("solrQuery", () => {  //eslint-disable-line no-undef
		it("should set the q parameter", () => { //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: 0
			};
			expect(solrQuery(query).split("&").indexOf("q=*:*") > -1).toEqual(true);

			expect(solrQuery({...query, searchFields: [
				{type: "text", field: "field_name", value: "val"}]
			}).split("&").indexOf("q=" + encodeURIComponent("field_name:val")) > -1).toEqual(true);
		});

		it("should set the rows parameter", () => {  //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: 0
			};
			expect(solrQuery(query).split("&").indexOf("rows=10") > -1).toEqual(true);
		});

		it("should (not) set the sort parameter", () => { //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: 0
			};
			expect(solrQuery(query).indexOf("sort")).toEqual(-1);

			expect(solrQuery({...query, sortFields: [{
				field: "field_name",
				value: "asc"
			}]}).split("&").indexOf("sort=" + encodeURIComponent("field_name asc")) > -1).toEqual(true);
		});

		it("should (not) set the facet.fields parameter", () => {  //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: 0
			};
			expect(solrQuery(query).indexOf("facet.field")).toEqual(-1);


			expect(solrQuery({...query, searchFields: [{
				field: "field_name",
				type: "list-facet"
			}]}).split("&").indexOf("facet.field=field_name") > -1).toEqual(true);
		});

		it("should (not) set the start parameter", () => {  //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: null
			};
			expect(solrQuery(query).indexOf("start=")).toEqual(-1);
			expect(solrQuery({...query, start: 10}).indexOf("start=") > -1).toEqual(true);
		});

		it("should set the wt parameter to json", () => {  //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: null
			};
			expect(solrQuery(query).split("&").indexOf("wt=json") > -1).toEqual(true);
		});

		it("should set the facet parameter to on", () => {  //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: null
			};
			expect(solrQuery(query).split("&").indexOf("facet=on") > -1).toEqual(true);
		});
	});
});
