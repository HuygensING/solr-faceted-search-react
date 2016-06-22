/*
http://localhost:8983/solr/cnwpersons/select?facet=on&facet.field=combinedDomains_ss&facet.field=deathDate_i&indent=on&q=*:*&rows=1&wt=json
http://localhost:8983/solr/cnwpersons/schema
http://localhost:3000/solr/cnwpersons/select?q=maria*%20AND%20(domains_ss:%22Geneeskunde%22+OR+domains_ss:%22Onderwijs%22)+AND+(networkDomains_ss:%22Verwey%22)%20AND%20(deathDate_i:[1933%20TO%201938])&wt=json&facet=on&facet.field=deathDate_i
*/

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


const solrQuery = (url, fields) => {
	const queryParam = encodeURIComponent(buildQuery(fields));
	const facetFieldParam = facetFields(fields);
	return `${url}?q=${queryParam.length > 0 ? queryParam : "*:*"}&facet=on&wt=json${facetFieldParam.length > 0 ? `&${facetFieldParam}` : ""}`;
};

export default solrQuery;
