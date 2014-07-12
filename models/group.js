var _ = require("lodash");

function Group ( id, key ) {
    this.id = id;
    this.key = key
    this.units = [];
    this.markers = [];
};

Group.prototype.addUnit = function( unit ) {    
    this.units.push(unit);
};

Group.prototype.getUnits = function() {
    return this.units;
};

Group.prototype.addMarker = function ( marker ) {
    this.markers.push(marker);
};

Group.prototype.getMarkers = function() {
    return this.markers;
};

Group.prototype.reapUnits = function ( olderThan ) {
    var reaped = [];
    this.units = _.reject( this.units, function _removeIfOlder(u) {
        var now = Date.now();
        var shouldReap = u.updated + olderThan < now;
        if (shouldReap) {
            reaped.push(u);
        }

        return shouldReap;
    });

    return reaped;
};

module.exports = Group;
