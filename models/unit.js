function Unit (id, name, token, lat, long, bearing) {
    this.id = id;
    this.name = name || "unknown unit";
    this.token = token || "";
    this.lat = lat || 0.0;
    this.long = long || 0.0;
    this.bearing = 0.0;
    this.joined = Date.now()
    this.updated = this.joined;
};

Unit.prototype.update = function( lat, long, bearing ) {
    this.updated = Date.now();
    this.bearing = bearing || 0.0;
    this.lat = lat || 0.0;
    this.long = long || 0.0;
};

module.exports = Unit;
