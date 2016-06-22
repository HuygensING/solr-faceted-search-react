#!/bin/sh

mkdir -p build/development
mkdir build/development/js
cp -R src/static/* build/development/


node_modules/.bin/browserify \
	--require react \
	--require react-dom > build/development/js/react-libs.js

node_modules/.bin/watchify src/index.js \
	--outfile build/development/js/index.js \
	--external react \
	--external react-dom \
	--standalone ExcelImportMock \
	--transform [ babelify ] \
	--verbose
