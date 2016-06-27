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
	} else if (field.type.indexOf("range") > -1) {
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

const facetSorts = (fields) => fields
	.filter((field) => field.facetSort)
	.map((field) => `f.${field.field}.facet.sort=${field.facetSort}`)
	.join("&");

const buildSort = (sortFields) => sortFields
	.filter((sortField) => sortField.value)
	.map((sortField) => `${sortField.field} ${sortField.value}`)
	.join(",");

const solrQuery = (query) => {
	const {
			searchFields,
			sortFields,
			rows,
			start,
			facetLimit,
			facetSort,
			pageStrategy,
			cursorMark,
			idField
		} = query;

	const filters = (query.filters || []).map((filter) => ({...filter, type: filter.type || "text"}));
	const queryParams = buildQuery(searchFields.concat(filters));

	const facetFieldParam = facetFields(searchFields);
	const facetSortParams = facetSorts(searchFields);
	const facetLimitParam = `facet.limit=${facetLimit || -1}`;
	const facetSortParam = `facet.sort=${facetSort || "index"}`;

	const cursorMarkParam = pageStrategy === "cursor" ? `cursorMark=${encodeURIComponent(cursorMark || "*")}` : "";
	const idSort = pageStrategy === "cursor" ? [{field: idField, value: "asc"}] : [];

	const sortParam = buildSort(sortFields.concat(idSort));



	return `q=*:*&${queryParams.length > 0 ? queryParams : ""}` +
		`${sortParam.length > 0 ? `&sort=${sortParam}` : ""}` +
		`${facetFieldParam.length > 0 ? `&${facetFieldParam}` : ""}` +
		`${facetSortParams.length > 0 ? `&${facetSortParams}` : ""}` +
		`&rows=${rows}` +
		`&${facetLimitParam}` +
		`&${facetSortParam}` +
		`&${cursorMarkParam}` +
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
	facetSorts,
	buildSort,
	solrQuery
};