# Solr faceted search client and react component pack 


```bash
	npm i git+https://github.com/renevanderark/solr-react-client-work-in-progress --save
```

## Table of Contents

1. [Quick start](#quick-start)
  * [Install and run](#install-and-run)

2. [Injecting custom components](#injecting-custom-components)

3. [Redux integration](#redux-integration)

4. [Setting up Solr](#setting-up-solr)
  * [Install solr](#install-solr)
  * [Solr with CORS](#solr-with-cors)
  * [Load sample data](#load-sample-data)


## Quick Start

### Install and run

##### Install this module

```bash
	$ npm i git+https://github.com/renevanderark/solr-react-client-work-in-progress --save
```

##### Install react

```bash
	$ npm i react react-dom --save
```

##### For this example install

```
	$ npm i browserify babelify babel-preset-react babel-preset-react babel-preset-es2015 --save-dev
```

##### Create this index.js

```javascript
import React from "react";
import ReactDOM from "react-dom";
import {
	SolrFacetedSearch,
	SolrClient
} from "solr-faceted-search-react";

// The search fields and filterable facets you want
const fields = [
	{label: "All text fields", field: "*", type: "text"},
	{label: "Name", field: "name_t", type: "text"},
	{label: "Characteristics", field: "characteristics_ss", type: "list-facet"},
	{label: "Date of birth", field: "birthDate_i", type: "range-facet"},
	{label: "Date of death", field: "deathDate_i", type: "range-facet"}
];

// The sortable fields you want
const sortFields = [
	{label: "Name", field: "koppelnaam_s"},
	{label: "Date of birth", field: "birthDate_i"},
	{label: "Date of death", field: "deathDate_i"}
];


document.addEventListener("DOMContentLoaded", () => {
	// The client class
	new SolrClient({
		// The solr index url to be queried by the client
		url: "http://localhost:8983/solr/cnwpersons/select",
		searchFields: fields,
		sortFields: sortFields,
		onChange: (state, handlers) => 
			ReactDOM.render(
				<SolrFacetedSearch {...state} {...handlers} bootstrapCss={true} onSelectDoc={(doc) => console.log(doc)} />,
				document.getElementById("app")
			)
	}).initialize();
});
```

Run
```bash

```



## Injecting custom components

## Redux integration


## Setting up solr

### Install solr

### Solr with CORS

### Load sample data


