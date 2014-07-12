"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var crypto = require("crypto");
var _ = require("lodash");
var Promise = require("bluebird");
var log4js = require("log4js");
var sockjs = require("sockjs")
var log = log4js.getLogger("backend");

var Group = require(__dirname + "/models/group.js");
var Unit = require(__dirname + "/models/unit.js");


var groups = [];

function replyJSON( res, code, object ){
    var objectJSON = JSON.stringify(object,null,4);
    res.set("Content-type", "application/json");
    res.status(code).send(objectJSON);
}

function replyJSONError( res, code, msg ) {
    replyJSON(res, code, {status: code, reason: msg} );
}

var keyStrength = 3;

function createGroup( req, res ) {    
    var groupCreateRequest = req.body;

    log.info("Creating group...");
    var newGroup = new Group( crypto.randomBytes(keyStrength).toString('hex'),
                              "lol");
    groups.push(newGroup);

    replyJSON(res, 201, newGroup); return;
};

function getGroups( req, res ) {    
    log.info("Getting groups...");
    replyJSON(res, 201, {groups:groups}); return;
};

function getUnitsForGroup( req, res ) {
    var groupId = req.params.groupId;
    log.info("Getting units for group %s...", groupId);
    var foundGroup = _.find( groups, function _findGroupById( g ) { return g.id === groupId; });
    if (foundGroup) {
        replyJSON(res, 200, {units:foundGroup.units}); return;
    } else {
        log.warn("Unable to find group %s!", groupId);
        replyJSONError(res, 404, "Unable to find group "+groupId); return;
    }
};

function getMarkersForGroup( req, res ) {
    var groupId = req.params.groupId;
    log.info("Getting markers for group %s...", groupId);
    var foundGroup = _.find( groups, function _findGroupById( g ) { return g.id === groupId; });
    if (foundGroup) {
        replyJSON(res, 200, {markers:foundGroup.markers}); return;
    } else {
        log.warn("Unable to find group %s!", groupId);
        replyJSONError(res, 404, "Unable to find group "+groupId); return;
    }
};

function addUnitToGroup( req, res ) {
    var groupId = req.params.groupId;
    console.log(req.body);
    var groupKey = req.body.key;
    var foundGroup = _.find( groups, function _findGroupById( g ) { return g.id === groupId; });
    log.info("Adding unit to group %s...", groupId);
    if (foundGroup) {
        console.log(foundGroup);
        if (foundGroup.key !== groupKey  && groupKey !== "sudo" ) {
            log.warn("Unable to auth to add unit to group %s! Given key %s, needed %s", groupId, groupKey, foundGroup.key);
            replyJSONError(res, 403, "Bad key"); return;
        } else {
            var unitName = req.body.name;
            var unitId = crypto.randomBytes(20).toString('hex');
            var unitToken = crypto.randomBytes(20).toString('hex');
            var unitLat = req.body.lat;
            var unitLong = req.body.long;
            var unitBearing = req.body.bearing;
            var unit = new Unit( unitId, unitName, unitToken, unitLat, unitLong, unitBearing );

            foundGroup.addUnit( unit );
            replyJSON(res, 201, {unit:unit}); return;
        }
    } else {
        log.warn("Unable to find group %s!", groupId);
        replyJSONError(res, 404, "Unable to find group "+groupId); return;
    }
};

function addMarkerToGroup( req, res ) {
    var groupId = req.params.groupId;
    log.info("Adding marker to group %s...", groupId);
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

    server.use( bodyParser.json() );
    server.get( "/api/1.0.0/groups/:groupId/units", getUnitsForGroup );
    server.get( "/api/1.0.0/groups/:groupId/markers", getMarkersForGroup );
    server.get( "/api/1.0.0/groups", getGroups );
    server.post( "/api/1.0.0/groups", createGroup );
    server.post( "/api/1.0.0/groups/:groupId/markers", addMarkerToGroup );
    server.post( "/api/1.0.0/groups/:groupId/units", addUnitToGroup );
    server.put( "/api/1.0.0/groups/:groupId/units/:unitId", updateUnit );
    server.use( "/", express.static(__dirname + "/web"));
    
    var webserver = server.listen(port);
    log.info("done.");
};


function tickGroups(){
    var reapInterval = 10 * 1000; // no reply in 10 secs? get reaped.

    log.info("Ticking groups.");
    _.each(groups, function _tickGroup( g ) {
        log.info("\tGroup "+ g.id);
        var reaped = g.reapUnits(reapInterval);
        log.info("\tReaped: ", reaped);
        log.info("\tAlive: ", g.getUnits());
    });

};

function init() {
    startWeb();
    process.on("SIGINT", shutdown);
    process.on("quit", shutdown);

    setInterval( tickGroups, 100 );
};

function shutdown() {
    log.warn("Shutting down...");
    process.exit(0);
};

init();
