import React from "react";
import ReactDOM from "react-dom";
import Search from "./components";

const fields = [
	{label: "All text fields", field: "*", type: "text"},
	{label: "Name", field: "name_t", type: "text"},
	{label: "Characteristics", field: "characteristics_ss", type: "list-facet"},
	{label: "Date of birth", field: "birthDate_i", type: "range-facet"}
];

document.addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Search onSelectDoc={(doc) => console.log(doc)} searchFields={fields} solrUrl="/solr/cnwpersons/select" />, document.getElementById("app"));
});
