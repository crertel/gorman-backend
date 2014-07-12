function Unit (id, name, token, lat, long, bearing) {
    this.id = id;
    this.name = name || "unknown unit";
    this.token = token || "";
    this.lat = lat || 0.0;
    this.long = long || 0.0;
    this.bearing = 0.0;
    this.joined = new Date();
    this.updated = this.joined;
};

Unit.prototype.update( token, lat, long, bearing ) {
    this.updated = new Date();
    this.bearing = bearing || 0.0;
    this.lat = lat || 0.0;
    this.long = long || 0.0;
};
