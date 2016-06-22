#!/usr/bin/env node

var browserSync = require("browser-sync").create();
var debounce = require("lodash.debounce");
var proxy = require("proxy-middleware");
var url = require("url");

var baseDir = "./build/development";
var watchFiles = [
	baseDir + "/js/*.js",
	baseDir + "/css/*.css",
	baseDir + "/index.html"
];

function onFilesChanged(event, file) {
	if (event === "change") {
		browserSync.reload(file);
	}
}

browserSync.watch(watchFiles, debounce(onFilesChanged, 300));

var proxyOptions = url.parse("http://localhost:8983/solr");
proxyOptions.route = "/solr";


browserSync.init({
	server: {
		baseDir: baseDir
	},
	middleware: [
		proxy(proxyOptions)
	]
});
