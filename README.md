# Solr faceted search client and react component pack 

Solr faceted search client and react component pack

[![Build Status](https://travis-ci.org/HuygensING/solr-faceted-search-react.svg?branch=master)](https://travis-ci.org/HuygensING/solr-faceted-search-react)

## Table of Contents

1. [Quick start](#quick-start)
2. [Redux integration](#redux-integration)
3. [Dynamically loaded result lists](#dynamically-loaded-result-lists)
4. [Using preset filters](#using-preset-filters)
5. [Injecting custom components](#injecting-custom-components)
6. [Bootstrap CSS class names](#bootstrap-css-class-names)
7. [Using the SolrClient class](#using-the-solrclient-class)
8. [Component Lego](#component-lego)

Appendix A: [Setting up Solr](#setting-up-solr)

Appendix B: [Building the example webapp](#building-the-example-webapp)

## Screenshot

![Screenshot](https://raw.githubusercontent.com/HuygensING/solr-faceted-search-react/master/screen.png "Screenshot")


## Quick Start

This quick start assumes a solr installation as documented in the section on [setting up solr](#setting-up-solr).

Instructions on building a tiny web project from this example can be found [here](#building-the-example-webapp).

Installing this module:

```bash
	$ npm i solr-faceted-search-react --save
```

The source below assumes succesfully [setting up solr](#setting-up-solr).

```javascript
// index.js
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
		url: "http://localhost:8983/solr/gettingstarted/select",
		searchFields: fields,
		sortFields: sortFields,

		// The change handler passes the current query- and result state for render
		// as well as the default handlers for interaction with the search component
		onChange: (state, handlers) =>
			// Render the faceted search component
			ReactDOM.render(
				<SolrFacetedSearch 
					{...state}
					{...handlers}
					bootstrapCss={true}
					onSelectDoc={(doc) => console.log(doc)}
				/>,
				document.getElementById("app")
			)
	}).initialize(); // this will send an initial search, fetching all results from solr
});
```

Instructions on building this example can be found [here](#building-the-example-webapp).



## Redux integration

In the quick start example, the SolrClient state is tightly coupled to the rendering of the SolrFacetedSearch component.

In many cases however, you might want to manage state yourself at application scope. 
The example below illustrates how you can delegate state management to your own reducer/store using redux.

(To rebuild the webapp with redux follow the [building the redux example](#building-the-redux-example).)

Given this reducer:
```javascript
// solr-reducer.js
const initialState = {
	query: {},
	result: {}
}

export default function(state=initialState, action) {
	switch (action.type) {
		case "SET_SOLR_STATE":
			console.log("In reducer: ", action.state);
			return {...state, ...action.state}
	}
}
```

The quick start example can be modified to look like this:
```javascript
// (...)
import solrReducer from "./solr-reducer";
import { createStore } from "redux"

// Create a store for the reducer.
const store = createStore(solrReducer);

// (...)

// Construct the solr client api class
const solrClient = 	new SolrClient({
	url: "http://localhost:8983/solr/gettingstarted/select",
	searchFields: fields,
	sortFields: sortFields,

	// Delegate change callback to redux dispatcher
	onChange: (state) => store.dispatch({type: "SET_SOLR_STATE", state: state})
});

// Register your app with the store
store.subscribe(() =>
	// In stead of using the handlers passed along in the onChange callback of SolrClient
	// use the .getHandlers() method to get the default click / change handlers
	ReactDOM.render(
		<SolrFacetedSearch
			{...store.getState()}
			{...solrClient.getHandlers()}
			bootstrapCss={true}
			onSelectDoc={(doc) => console.log(doc)}
		/>,
		document.getElementById("app")
	)
);

document.addEventListener("DOMContentLoaded", () => {
	// this will send an initial search initializing the app
	solrClient.initialize();
});

```
To rebuild the webapp with redux follow the [building the redux example](#building-the-redux-example).

## Dynamically loaded result lists

If you want to change the way to paginate through the result list initialize the SolrClient with pageStrategy set to "cursor".

In this case you must also provide a unique idField, which is explained [here](https://cwiki.apache.org/confluence/display/solr/Pagination+of+Results#PaginationofResults-FetchingALargeNumberofSortedResults:Cursors). 


```javascript
const solrClient = new SolrClient({
	pageStrategy: "cursor", // do not paginate, but dynamically load new results
	idField: "id" // the field name in the index which is unique per indexed document.
	// ...
});
```

## Using preset filters

If you want to show only a subset of the index, filtered by a specific field, you can via the the filters prop of the SolrClient:

```javascript
const solrClient = new SolrClient({
	filters: [
		{field: "name_t", value "maria"},
		{field: "birthDate_i", type: "range", value [1880, 1890]}
	]
	// ...
});
```



## Injecting custom components

The SolrFacetedSearch component provides the facility of overriding its inner components. 

The default components are exposed through the defaultComponentPack, which has the following structure:

```javascript
{
	searchFields: {
		text: TextSearch, // src/components/text-search/index.js
		"list-facet": ListFacet, // src/components/list-facet/index.js
		"range-facet": RangeFacet,  // src/components/range-facet/index.js
		container: SearchFieldContainer, //  src/components/search-field-container.js
		currentQuery: CurrentQuery //  src/components/current-query/index.js
	},
	results: {
		result: Result, // src/components/results/result.js
		resultCount: CountLabel, // src/components/results/count-label.js
		header: ResultHeader, // src/components/results/header.js
		list: ResultList, // src/components/results/list.js
		container: ResultContainer, // src/components/results/container.js
		pending: ResultPending, // src/components/results/pending.js
		paginate: ResultPagination // src/components/results/pagination.js
		preloadIndicator: PreloadIndicator // src/components/results/preload-indicator.js
	},
	sortFields: {
		menu: SortMenu // src/components/sort-menu/index.js
	}
}
```

To override a default component an altered version of the defaultComponentPack can be passed to the SolrFacetedSearch component
via the customComponents prop:
```javascript
import {
	SolrFacetedSearch,
	SolrClient,
	defaultComponentPack
} from "solr-faceted-search-react";

// Custom class for the result component
class MyResult extends React.Component {
	render() {
		return (<li>
			<a onClick={() => this.props.onSelect(this.props.doc)}>MyResult: {this.props.doc.name_t}</a>
		</li>)
	}
}

// Create a custom component pack from the default component pack
const myComponentPack = {
	...defaultComponentPack,
	results: {
		...defaultComponentPack.results,
		result: MyResult
	}
}

// Render with the custom result component
ReactDOM.render(
	<SolrFacetedSearch
		{...state}
		{...handlers}
		bootstrapCss={true}
		customComponents={myComponentPack}
		onSelectDoc={(doc) => console.log(doc)}
	/>,
	document.getElementById("app")
);
```

When overriding a component it is worthwhile to look at the prop signature (and usage) in the source of the default component.

## Bootstrap CSS class names

The SolrFacetedSearch component and its default components optionally add bootstrap class names to the rendered dom elements.

To turn this off, render the SolrFacetedSearch component with the property bootstrapCss set to false.

```javascript
ReactDOM.render(
	<SolrFacetedSearch
		{...state}
		{...handlers}
		bootstrapCss={false}
		onSelectDoc={(doc) => console.log(doc)}
	/>,
	document.getElementById("app")
);
```

## Using the SolrClient class

##### Settings passed to the constructor:

```javascript
{
	url: "..." // the search url
	searchFields: [{...}] // the search field configuration
	sortFields: [{...}] // the sort field configuration,
	onChange: (state, handlers) => {...} // the change handler for query and result state
	rows: [1-9][0-9]+ // [optional] amount of results per page
	pageStrategy: "paginate" // [optional, defaults to "paginate", other option is "cursor" - in which case you must provide a unique idField from the index]
	idField: "id" // [optional, but required when using pageStrategy: "cursor"!]
	facetLimit: [1-9][0-9]+ // [optional, sets the facet.limit param (defaults to -1 = all) ]
	facetSort: "index" // [optional, how to sort the list facets by default (defaults to solr default)]
	filters: [{...}] // [optional: static filters passed to search, not visible in user interface]
}

```

##### Layout of searchFields:
```javascript
	[
		{
			label: "All fields", // label of the field
			field: "*", // field in index (asterisk indicates search in default text field)
			type: "text" // renders a free input, sends a text filter query
		},
		{
			label: ...
			field: "name_t" // field in index
			type: "text",
			value: "jo*" // [optional: initial text search value]
		},
		{
			label: ...
			field: "deathDate_i",
			type: "range-facet", // renders a range slider, sends a range query,
			value: [1890, 1900] // [optional: initial range value of filter]
		},
		{
			label: ...
			field: "characteristics_ss",
			type: "list-facet", // renders a facet list with checkboxes, sends a filter query
			value: ["Publicist", "Bestuurslid vakvereniging"] // [optional: initial active filters]
			facetSort: "index" // [optional: how to sort the list facet, options: "index" / "count"]
		},
		{
			label: ...
			field: "my-local-name",
			lowerBound: "startDate_i",
			upperBound: "endDate_i",
			type: "period-range-facet", // renders a range slider, sends a range query over startDate_i and endDate_i
			value: [1890, 1900] // [optional: initial range value of filter]
		},
	]
```
Search fields are presented in order of configuration array.

##### Layout of sortFields:
```javascript
[
	{
		label: "Name", // Label of the field
		field: "koppelnaam_s" // field in index
		value: "asc" // [optional: presorts on this field ascendingly]
	},
	{
		label: "Date of birth",
		field: "birthDate_i",
		value: "desc" // [optional: presorts on this field descendingly]
	}
]
```

##### Layout of filters:
```javascript
	[
		{
			field: "name_t" // field in index
			value: "jo*" // filter value
		},
		{
			field: "deathDate_i",
			type: "range",
			value: [1890, 1900] // [optional: initial range value of filter]
		}
	]
```


##### Methods

The SolrClient class exposes a number of methods to manipulate its state directly.

Invoking the methods below will trigger a new solr search (and rerender of the SolrFacetedSearch component).

These methods should be called after .initialize() has been invoked.


##### Changing the result page:

```javascript
	solrClient.setCurrentPage(3); // jump to page 3 (humans: 4) of the results
```

##### Setting active filters on a searchField

```javascript
	solrClient.setSearchFieldValue("characteristics_ss", ["Publicist", "Bestuurslid vakvereniging"]); // filter on exacly "Publicist" and "Bestuurslid vakvereniging"
	solrClient.setSearchFieldValue("deathDate_i", [1890, 1900]); // filter on exactly the range 1890-1900
	solrClient.setSearchFieldValue("name_t", "jo*"); // find all persons with a name starting with "jo"
```

#### Setting sortations
```javascript
	solrClient.setSortFieldValue("name_t", "asc"); // sort by name ascendingly
	solrClient.setSortFieldValue("birthDate_i", "desc"); // sort by birth date descendingly
```

## Component Lego

The SolrFacetedSearch component is not actually needed as a wrapper around the components.

If the container classes in the defaultComponentPack do not provide enough flexibility for moving around components, 
they can be used in a standalone manner.

Note, however, that prop management based on state.query and state.results is then up to the app developer.

Minor example:
```javascript

	// ...

	const TextSearch = defaultComponentPack.searchFields.text;

	// ...

	ReactDOM.render(
		<div>
			<TextSearch 
				bootstrapCss={false}
				field="name_t"
				label="Standalone name field"
				onChange={solrClient.getHandlers().onSearchFieldChange}
				value={state.query.searchFields.find((sf) => sf.field === "name_t").value }
			/>
			{state.results.docs.map((doc, i) => <div key={i}>{doc.name_t}</div>)}
		</div>,
		document.getElementById("app")
	)
```



## Setting up solr

### Install solr

Download solr from the [download page](http://lucene.apache.org/solr/mirrors-solr-latest-redir.html) and extract the .tgz or .zip file.

### Start solr with CORS

Navigate to the solr dir (assuming solr-6.1.0).

```bash
	$ cd solr-6.1.0
```

Edit the file server/etc/webdefault.xml and add these lines just above the last closing tag

```xml
	<!-- enable CORS filters (only suitable for local testing, use a proxy for real world application) -->
	<filter>
		<filter-name>cross-origin</filter-name>
		<filter-class>org.eclipse.jetty.servlets.CrossOriginFilter</filter-class>
	</filter>
	<filter-mapping>
		<filter-name>cross-origin</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>
	<!--- /enable CORS filters -->
</web-app>
```

Start the solr server

```bash
	$ bin/solr start -e cloud -noprompt
```

### Load sample data

Get sample data from this project

```bash
	$ wget https://raw.githubusercontent.com/HuygensING/solr-faceted-search-react/master/solr-sample-data.json
```

Load the sample data into the gettingstarted index of solr

```bash
	$ bin/post -c gettingstarted solr-sample-data.json
```

Check whether the data was succesfully indexed by navigation to [http://localhost:8983/solr/gettingstarted/select?q=*:*&wt=json](http://localhost:8983/solr/gettingstarted/select?q=*:*&wt=json)

### Done
This completes the solr instruction. Back to [quick start](#quick-start)

## Building the example webapp

These are just some minimal steps for building a webapp from the quick start with browserify.

Install react

```bash
	$ npm i react react-dom --save
```

For this example install

```
	$ npm i browserify babelify babel-preset-react babel-preset-react babel-preset-es2015 babel-preset-stage-2 --save-dev
```

Run browserify
```bash
	$ ./node_modules/.bin/browserify index.js \
		--require react \
		--require react-dom \
		--transform [ babelify --presets [ react es2015 stage-2 ] ] \
		--standalone FacetedSearch \
		-o web.js
```

Load this index.html in a browser

```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<script src="web.js"></script>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
	<style type="text/css">
		a {
			cursor: pointer;
		}

		.list-facet ul {
			overflow-y: auto;
			max-height: 200px;
		}

		.list-facet ul li {
			cursor: pointer
		}

		.list-facet ul li:hover {
			text-decoration: underline;
		}

		.facet-range-slider {
			-moz-user-select: none;
			-webkit-user-select: none;
			-ms-user-select: none;
			user-select: none;
			-webkit-user-drag: none;
			user-drag: none;
			cursor: pointer;
			width: 100%;
			stroke: #f1ebe6;
			fill: #f1ebe6;
		}

		.facet-range-slider .range-line {
			stroke-width: 8;
		}

		.facet-range-slider .range-line circle {
			stroke-width: 0;
		}

		.facet-range-slider .range-line circle.hovering,
		.facet-range-slider .range-line circle:hover {
			fill: #bda47e;
		}

		.facet-range-slider .range-line path.hovering,
		.facet-range-slider .range-line path:hover {
			stroke: #bda47e;
		}

		.current-query label,
		.solr-search-results ul label {
			display: inline-block;
			margin: 0 20px 0 0;
			width: 120px;
			color: #666;
			overflow: hidden;
			white-space: nowrap;
			vertical-align: bottom;
			text-overflow: ellipsis
		}

		.solr-search-results ul li ul {
			list-style: none;
			padding: 0;
		}

		svg.search-icon {
			stroke: #595959;
			fill: #595959;
		}

		.current-query .label {
			display: inline-block;
			padding: 4px;
			cursor: pointer;
			margin-left: 4px;
		}

		.current-query .label:hover a {
			color: #d08989;
		}
		.current-query .label a {
			color: white;
			margin-left: 4px;
		}

		.range-facet header h5 {
			max-width: calc(100% - 75px)

		}

		.facet-item-amount {
			display:inline-block;
			float:right;
			color: #aaa;
		}

		.list-facet > .list-group {
			box-shadow: none;
		}
		.list-facet > .list-group > .list-group-item {
			border: none;
		}

		.list-facet > input {
			width: calc(100% - 125px)
		}
	</style>
</head>
<body>
	<div id="app"></div>
</body>
</html>
```

This is enough for the [quick start](#quick-start).

### Building the redux example

To run the redux integration example install redux:
```bash
	$ npm i redux --save
```

And rebuild like this:
```bash
	$
```

Back to the [redux example](#redux-integration)
