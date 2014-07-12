var http = require("http");
var argv = process.argv.slice(2);

var aolat = 29.7628;
var aolong = -95.3831;

var createOpts = function(group) {
    return  {
        method: "POST",
        headers: { "Content-type" : "application/json"},
        host: argv[0],
        path: "/api/1.0.0/groups/" + group +"/units",
        port: argv[1]
    };
};

var updateOpts = function(group,unit) {
    var path =  "/api/1.0.0/groups/" + group +"/units/"+unit;
    return  {
        method: "PUT",
        headers: { "Content-type" : "application/json"},
        host: argv[0],
        path: path,
        port: argv[1]
    };
};

function updateClient( unit, token,  group,state ) {
    state.lat  +=  Math.random() *0.0001;
    state.long += Math.random() * 0.0001;
    var updateDesc = {
        bearing: Math.random() * 360.0,
        lat: state.lat,
        long: state.long,
        token: token
    };
    
    var req = http.request( updateOpts(group,unit), function(res){
        res.setEncoding("utf-8");
        var response = "";
        res.on('data', function(data) {
            response += data;
        });
        res.on("end", function() {
            var reply = JSON.parse(response);
        });
    });
    req.write( JSON.stringify(updateDesc));
    req.end();
};

function startClient( name, group ) {
    var clientDesc = {
        name: name,
        bearing: 0.0,
        lat: aolat,
        long: aolong,
        key: "key"
    };
    
    var req = http.request( createOpts(group), function(res){
        res.setEncoding("utf-8");
        var response = "";
        res.on('data', function(data) {
            response += data;
        });
        res.on("end", function() {
            var reply = JSON.parse(response);
            console.log("Confirmed unit "+reply.id+ "\n" + response);            
            setInterval(function(){updateClient(reply.id, reply.token, group,clientDesc)},250);
        });
    });
    req.write( JSON.stringify(clientDesc));
    req.end();
};

startClient("chris", argv[2]);
startClient("jim", argv[2]);
startClient("paul", argv[2]);
//startClient("jeff", argv[2]);
