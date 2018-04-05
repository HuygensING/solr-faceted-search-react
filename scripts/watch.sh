#!/bin/sh

node_modules/.bin/watchify src/index.js \
	--outfile 'node_modules/.bin/derequire > build/index.js' \
	--external react \
	--external react-dom \
	--standalone SolrFacetedSearch \
	--transform [ babelify --presets [ env react ] --plugins [ transform-es2015-destructuring transform-object-rest-spread transform-object-assign] ] \
	--verbose
