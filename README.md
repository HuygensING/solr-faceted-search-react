
```javascript
import React from "react";
import ReactDOM from "react-dom";
import {
	SolrFacetedSearch,
	solrStore,
	solrActions
} from "./index1";


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


solrStore.subscribe(() => {
	ReactDOM.render(
		<div>
			<SolrFacetedSearch
				{...solrActions}
				{...solrStore.getState()}
				bootstrapCss={true}
				onSelectDoc={(doc) => console.log(doc)}
			/>
		</div>, document.getElementById("app"));
});


document.addEventListener("DOMContentLoaded", () =>

	solrActions.onInit("http://localhost:8983/solr/cnwpersons/select", fields, sortFields, 20, "paginate")

);
```