
```javascript
import React from "react";
import ReactDOM from "react-dom";
import {
	SolrFacetedSearch,
	SolrClient
} from "solr-faceted-search-react";


const fields = [
	{label: "All text fields", field: "*", type: "text"},
	{label: "Name", field: "name_t", type: "text"},
	{label: "Characteristics", field: "characteristics_ss", type: "list-facet"},
	{label: "Date of birth", field: "birthDate_i", type: "range-facet"},
	{label: "Date of death", field: "deathDate_i", type: "range-facet"}
];

const sortFields = [
	{label: "Name", field: "koppelnaam_s"},
	{label: "Date of birth", field: "birthDate_i"},
	{label: "Date of death", field: "deathDate_i"}
];


function doRender(state, handlers) {
	console.log(handlers);
	ReactDOM.render(
		<div>
			<SolrFacetedSearch
				{...state}
				{...handlers}
				bootstrapCss={true}
				onSelectDoc={(doc) => console.log(doc)}
			/>
		</div>, document.getElementById("app"));
}


document.addEventListener("DOMContentLoaded", () => {
	const client = new SolrClient({
		url: "http://localhost:8983/solr/cnwpersons/select",
		searchFields: fields,
		sortFields: sortFields,
		rows: 20,
		pageStrategy: "paginate",
		onChange: (state, handlers) => doRender(state, handlers)
	}).initialize();

	client.setCurrentPage(5);
});
```