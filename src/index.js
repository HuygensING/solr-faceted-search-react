import React from "react";
import ReactDOM from "react-dom";
import Search from "./components";

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

document.addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Search bootstrapCss={true} onSelectDoc={(doc) => console.log(doc)} searchFields={fields} solrUrl="/solr/cnwpersons/select" sortFields={sortFields} />, document.getElementById("app"));
});
