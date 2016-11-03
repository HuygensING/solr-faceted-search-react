import expect from "expect";

import {
	rangeFacetToQueryFilter,
	periodRangeFacetToQueryFilter,
	listFacetFieldToQueryFilter,
	textFieldToQueryFilter,
	fieldToQueryFilter,
	buildQuery,
	facetFields,
	facetSorts,
	buildSort,
	solrQuery
} from "../../src/api/solr-query";

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
			})).toEqual(encodeURIComponent("field_name:[123 TO 456]"));
		});
	});

	describe("periodRangeFacetToQueryFilter", () => { //eslint-disable-line no-undef
		it("should return an empty string when field.value is null or empty", () => { //eslint-disable-line no-undef
			expect(periodRangeFacetToQueryFilter({
				field: "field_name",
				value: null
			})).toEqual(null);

			expect(periodRangeFacetToQueryFilter({
				field: "field_name",
				value: []
			})).toEqual(null);
		});

		it("should generate combined solr range query from a valid period-range-facet searchField", () => { //eslint-disable-line no-undef
			expect(periodRangeFacetToQueryFilter({
				lowerBound: "beginDate_i",
				upperBound: "endDate_i",
				value: [1700, 1750]
			})).toEqual(encodeURIComponent("beginDate_i:[1700 TO 1750] OR endDate_i:[1700 TO 1750] OR (beginDate_i:[* TO 1700] AND endDate_i:[1750 TO *])"));
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
			})).toEqual(encodeURIComponent("field_name:(\"val\")"));
		});

		it("should join filters with OR", () => { //eslint-disable-line no-undef
			expect(listFacetFieldToQueryFilter({
				field: "field_name",
				value: ["val", "val2"]
			})).toEqual(encodeURIComponent("field_name:(\"val\" OR \"val2\")"));
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
			})).toEqual("field_name%3Aval");
		});

		it("should ignore the filter value to when field.value is null or empty", () => { //eslint-disable-line no-undef
			expect(textFieldToQueryFilter({
				field: "field_name",
				value: null
			})).toEqual(null);

			expect(textFieldToQueryFilter({
				field: "*",
				value: null
			})).toEqual(null);

			expect(textFieldToQueryFilter({
				field: "field_name",
				value: ""
			})).toEqual(null);

			expect(textFieldToQueryFilter({
				field: "*",
				value: ""
			})).toEqual(null);

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
			})).toEqual(encodeURIComponent("field_name:[10 TO 30]"));
		});

		it("should return a period range filter when the field.type is 'period-range-facet'", () => { //eslint-disable-line no-undef
			expect(fieldToQueryFilter({
				type: "period-range-facet",
				value: [1700, 1750],
				lowerBound: "beginDate_i",
				upperBound: "endDate_i"
			})).toEqual(encodeURIComponent("beginDate_i:[1700 TO 1750] OR endDate_i:[1700 TO 1750] OR (beginDate_i:[* TO 1700] AND endDate_i:[1750 TO *])"));
		});


		it("should return a list filter when the field.type is 'list-facet'", () => { //eslint-disable-line no-undef
			expect(fieldToQueryFilter({
				type: "list-facet",
				value: [10, 30],
				field: "field_name"
			})).toEqual(encodeURIComponent("field_name:(\"10\" OR \"30\")"));
		});

		it("should return a text filter when the field.type is 'text'", () => { //eslint-disable-line no-undef
			expect(fieldToQueryFilter({
				type: "text",
				value: "val",
				field: "field_name"
			})).toEqual("field_name%3Aval");
		});
	});

	describe("buildQuery", () => { //eslint-disable-line no-undef
		it("should create filters for the supported field types", () => {  //eslint-disable-line no-undef
			expect(buildQuery([{
				type: "text",
				value: "val",
				field: "field_name"
			}])).toEqual("fq=field_name%3Aval");


			expect(buildQuery([{
				type: "list-facet",
				value: [10, 30],
				field: "field_name"
			}])).toEqual("fq=" + encodeURIComponent("field_name:(\"10\" OR \"30\")"));

			expect(buildQuery([{
				type: "range-facet",
				value: [10, 30],
				field: "field_name"
			}])).toEqual("fq=" + encodeURIComponent("field_name:[10 TO 30]"));

			expect(buildQuery([{
				type: "period-range-facet",
				value: [1700, 1750],
				lowerBound: "beginDate_i",
				upperBound: "endDate_i"
			}])).toEqual("fq=" + encodeURIComponent("beginDate_i:[1700 TO 1750] OR endDate_i:[1700 TO 1750] OR (beginDate_i:[* TO 1700] AND endDate_i:[1750 TO *])"));
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
				type: "period-range-facet",
				field: "field_name",
				value: null
			}, {
				type: "period-range-facet",
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

		it("should join query parts with ampersand", () => {  //eslint-disable-line no-undef
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

			const parts = query.split("&");

			expect(parts.length).toEqual(3);
			expect(parts.indexOf("fq=" + encodeURIComponent("field_name:[10 TO 30]")) > -1).toEqual(true);
			expect(parts.indexOf("fq=" + encodeURIComponent("field_name:(\"10\" OR \"30\")")) > -1).toEqual(true);
			expect(parts.indexOf("fq=" + encodeURIComponent("field_name:val")) > -1).toEqual(true);
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
			}, {
				type: "period-range-facet",
				value: [1700, 1750],
				lowerBound: "beginDate_i",
				upperBound: "endDate_i"
			}]);
			expect(facetParam.indexOf("facet.field=text_field")).toEqual(-1);
			expect(facetParam.indexOf("facet.field=list_field") > -1).toEqual(true);
			expect(facetParam.indexOf("facet.field=range_field") > -1).toEqual(true);
			expect(facetParam.indexOf("facet.field=beginDate_i") > -1).toEqual(true);
			expect(facetParam.indexOf("facet.field=endDate_i") > -1).toEqual(true);
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
			}, {
				type: "period-range-facet",
				value: [1700, 1750],
				lowerBound: "beginDate_i",
				upperBound: "endDate_i"
			}]);

			const parts = facetParam.split("&");
			expect(parts.indexOf("facet.field=list_field") > -1).toEqual(true);
			expect(parts.indexOf("facet.field=range_field") > -1).toEqual(true);
			expect(parts.indexOf("facet.field=beginDate_i") > -1).toEqual(true);
			expect(parts.indexOf("facet.field=endDate_i") > -1).toEqual(true);
		});
	});

	describe("buildFacetSort", () => { //eslint-disable-line no-undef
		it("should add the facet.field_name.sort parameter for searchFields where facetSort is set", () => { //eslint-disable-line no-undef
			const facetSortParams = facetSorts([{
				type: "list-facet",
				field: "field_name1"
			}, {
				type: "list-facet",
				facetSort: "index",
				field: "field_name2"
			}, {
				type: "list-facet",
				facetSort: "count",
				field: "field_name3"
			}]);

			const parts = facetSortParams.split("&");
			expect(parts.length).toEqual(2);
			expect(parts.indexOf("f.field_name2.facet.sort=index") > -1).toEqual(true);
			expect(parts.indexOf("f.field_name3.facet.sort=count") > -1).toEqual(true);
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
			}])).toEqual("field_name%20asc");
		});

		it("should join the mapped fields with a comma", () => { //eslint-disable-line no-undef
			expect(buildSort([{
				field: "field_name",
				value: "asc"
			}, {
				field: "other_field_name",
				value: "desc"
			}])).toEqual("field_name%20asc,other_field_name%20desc");
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
		});

		it("should set the fq parameters", () => {  //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: 0
			};
			expect(solrQuery({...query, searchFields: [
				{type: "text", field: "field_name", value: "val"}]
			}).split("&").indexOf("fq=field_name%3Aval") > -1).toEqual(true);
		});

		it("should set the fq parameters from static filters", () => {  //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: 0
			};
			expect(solrQuery({...query, filters: [{field: "field_name", value: "val"}]
			}).split("&").indexOf("fq=field_name%3Aval") > -1).toEqual(true);
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
			expect(solrQuery(query).indexOf("&sort=")).toEqual(-1);

			expect(solrQuery({...query, sortFields: [{
				field: "field_name",
				value: "asc"
			}]}).split("&").indexOf("sort=field_name%20asc") > -1).toEqual(true);
		});

		it("should (not) set the facet.field parameters", () => {  //eslint-disable-line no-undef
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

		it("should set the facet.limit parameter to -1 by default", () => {  //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: null
			};
			expect(solrQuery(query).split("&").indexOf("facet.limit=-1") > -1).toEqual(true);
		});

		it("should set the facet.limit parameter from the facetLimit prop", () => {  //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: null,
				facetLimit: 100
			};
			expect(solrQuery(query).split("&").indexOf("facet.limit=100") > -1).toEqual(true);
		});

		it("should set the facet.sort parameter from the facetSort prop", () => {  //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: null,
				facetSort: "index"
			};
			expect(solrQuery(query).split("&").indexOf("facet.sort=index") > -1).toEqual(true);
		});

		it("should set the cursorMark parameter to * when pageStrategy is 'cursor' and cursor is not passed", () => { //eslint-disable-line no-undef
			const query = {
				searchFields: [],
				sortFields: [],
				rows: 10,
				start: null,
				facetSort: "index",
				pageStrategy: "cursor"
			};
			expect(solrQuery(query).split("&").indexOf("cursorMark=*") > -1).toEqual(true);
		});
	});
});
