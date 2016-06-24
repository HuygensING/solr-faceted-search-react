# Solr faceted search client and react component pack 

## Table of Contents

1. [Quick start](#quick-start)

2. [Redux integration](#redux-integration)

3. [Injecting custom components](#injecting-custom-components)

4. [Setting up Solr](#setting-up-solr)

5. [Building](#building)

## Quick Start

This quick start assumes a solr installation as documented in the section on [setting up solr](#setting-up-solr).

Instructions on building a tiny web project from this example can be found [here](#building).

Installing this module:

```bash
	$ npm i git+https://github.com/renevanderark/solr-react-client-work-in-progress --save
```

The source below assumes succesfully [setting up solr](#setting-up-solr).

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

## Redux integration

In the quick start example, the SolrClient state is tightly coupled to the rendering of the SolrFacetedSearch component.

In many cases however, you might want to manage state yourself at application scope. 
The example below illustrates how you can delegate state management to your own reducer/store using redux.

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

## Injecting custom components



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
	$ wget https://raw.githubusercontent.com/renevanderark/solr-react-client-work-in-progress/master/solr-sample-data.json
```

Load the sample data into the gettingstarted index of solr

```bash
	$ bin/post -c gettingstarted solr-sample-data.json
```

Check whether the data was succesfully indexed by navigation to [http://localhost:8983/solr/gettingstarted/select?q=*:*&wt=json](http://localhost:8983/solr/gettingstarted/select?q=*:*&wt=json)

## Building

These are just some minimal steps for building a webapp from the quick start with browserify.

Install react

```bash
	$ npm i react react-dom --save
```

For this example install

```
	$ npm i browserify babelify babel-preset-react babel-preset-react babel-preset-es2015 --save-dev
```

Run browserify
```bash
	$ ./node_modules/.bin/browserify index.js \
		--require react \
		--require react-dom \
		--transform [ babelify --presets [ react es2015 ] ] \
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
</head>
<body>
	<div id="app"></div>
</body>
</html>
```