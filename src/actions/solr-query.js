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

const textFieldToQueryFilter = (field) =>
	field.field === "*" ? field.value || "*" : `${field.field}:${field.value || "*"}`;

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
	.join(" AND ");

const facetFields = (fields) => fields
	.filter((field) => field.type === "list-facet" || field.type === "range-facet")
	.map((field) => `facet.field=${encodeURIComponent(field.field)}`)
	.join("&");

const buildSort = (sortFields) => sortFields
	.filter((sortField) => sortField.value)
	.map((sortField) => `${sortField.field} ${sortField.value}`)
	.join(",");

const solrQuery = (url, fields, sortFields, rows) => {
	const queryParam = encodeURIComponent(buildQuery(fields));
	const sortParam = encodeURIComponent(buildSort(sortFields));
	const facetFieldParam = facetFields(fields);

	return `${url}?q=${queryParam.length > 0 ? queryParam : "*:*"}` +
		`${sortParam.length > 0 ? `&sort=${sortParam}` : ""}` +
		`${facetFieldParam.length > 0 ? `&${facetFieldParam}` : ""}` +
		`&rows=${rows}` +
		"&facet=on&wt=json";
};

export default solrQuery;
