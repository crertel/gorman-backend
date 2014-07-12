"use strict";

var express = require("express");
var log4js = require("log4js");
var sockjs = require("sockjs")
var log = log4js.getLogger("backend");
 
function getUnitsForGroup( req, res ) {
    var groupId = req.params.groupId;
    log.info("Getting units for group %s...", groupId);
    res.status(200).send();
};

function getMarkersForGroup( req, res ) {
    var groupId = req.params.groupId;
    log.info("Getting units for group %s...", groupId);
    res.status(200).send();
};

function addUnitToGroup( req, res ) {
    var groupId = req.params.groupId;
    log.info("Getting units for group %s...", groupId);
    res.status(201).send();
};

function addMarkerToGroup( req, res ) {
    var groupId = req.params.groupId;
    log.info("Getting units for group %s...", groupId);
    res.status(201).send();
};

function updateUnit( res, req ) {
    var groupId = req.params.groupId;
    var unitId = req.params.unitId;
    log.info("Updating unit %s for group %s...", unitId, groupId);
    res.status(201).send();
};

function startWeb() {
    var port = 3000;
    log.info("Starting web server on port %s...", port);
    var server = express();

    server.get( "/api/1.0.0/groups/:groupId/units", getUnitsForGroup );
    server.get( "/api/1.0.0/groups/:groupId/markers", getMarkersForGroup );
    server.post( "/api/1.0.0/groups/:groupId/markers", addMarkerToGroup );
    server.post( "/api/1.0.0/groups/:groupId/units", addUnitToGroup );
    server.put( "/api/1.0.0/groups/:groupId/units/:unitId", updateUnit );
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
