const rangeFacetToQueryFilter = (field) => {
	const filters = field.value || [];
	if (filters.length < 2) {
		return null;
	}

	return `(${field.field}:[${filters[0]} TO ${filters[1]}])`;
};

const listFacetFieldToQueryFilter = (field) => {
	const filters = field.value || [];
	if (filters.length === 0) {
		return null;
	}

	const filterQ = filters.map((f) => `"${f}"`).join(" OR ");
	return `${field.field}:(${filterQ})`;
};

const textFieldToQueryFilter = (field) => {
	if(!field.value || field.value.length === 0) {
		return null;
	}

	return field.field === "*" ? field.value : `${field.field}:${field.value}`;
};

const fieldToQueryFilter = (field) => {
	if (field.type === "text") {
		return textFieldToQueryFilter(field);
	} else if (field.type === "list-facet") {
		return listFacetFieldToQueryFilter(field);
	} else if (field.type === "range-facet") {
		return rangeFacetToQueryFilter(field);
	}
	return null;
};

const buildQuery = (fields) => fields
	.map(fieldToQueryFilter)
	.filter((queryFilter) => queryFilter !== null)
	.map((queryFilter) => `fq=${queryFilter}`)
	.join("&");

const facetFields = (fields) => fields
	.filter((field) => field.type === "list-facet" || field.type === "range-facet")
	.map((field) => `facet.field=${field.field}`)
	.join("&");

const buildSort = (sortFields) => sortFields
	.filter((sortField) => sortField.value)
	.map((sortField) => `${sortField.field} ${sortField.value}`)
	.join(",");

const solrQuery = (query) => {
	const { searchFields, sortFields, rows, start, facetLimit } = query;

	const queryParams = buildQuery(searchFields);
	const sortParam = buildSort(sortFields);
	const facetFieldParam = facetFields(searchFields);

	const facetLimitParam = `facet.limit=${facetLimit || -1}`;

	return `q=*:*&${queryParams.length > 0 ? queryParams : ""}` +
		`${sortParam.length > 0 ? `&sort=${sortParam}` : ""}` +
		`${facetFieldParam.length > 0 ? `&${facetFieldParam}` : ""}` +
		`&rows=${rows}` +
		`&${facetLimitParam}` +
		(start === null ? "" : `&start=${start}`) +
		"&facet=on&wt=json";
};

export default solrQuery;

export {
	rangeFacetToQueryFilter,
	listFacetFieldToQueryFilter,
	textFieldToQueryFilter,
	fieldToQueryFilter,
	buildQuery,
	facetFields,
	buildSort,
	solrQuery
};