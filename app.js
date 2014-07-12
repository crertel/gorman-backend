"use strict";

var express = require("express");
var log4js = require("log4js");
var sockjs = require("sockjs")
var log = log4js.getLogger("backend");

function startWeb() {
    var port = 3000;
    log.info("Starting web server on port %s...", port);
    var server = express();
    server.use( "/", express.static(__dirname + "/web"));
    var webserver = server.listen(port);
    log.info("done.");
};

function init() {
    startWeb();
    process.on("SIGINT", shutdown);
    process.on("quit", shutdown);
};

function shutdown() {
    log.warn("Shutting down...");
    process.exit(0);
};

init();
